const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'email and password are required'
        });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.'
        });
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_change_in_production';
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      // Login successful
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.getAllNonAdminUsers();
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });

    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const Order = require('../models/Order');
      const orders = await Order.getAllOrders();
      
      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders
      });

    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getAllComplaints(req, res) {
    try {
      const Complaint = require('../models/Complaint');
      const complaints = await Complaint.getAllComplaints();
      
      res.status(200).json({
        success: true,
        message: 'Complaints retrieved successfully',
        data: complaints
      });

    } catch (error) {
      console.error('Get complaints error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async getDashboardStats(req, res) {
    try {
      const User = require('../models/User');
      const Order = require('../models/Order');
      const Complaint = require('../models/Complaint');

      // Get all data
      const users = await User.getAllNonAdminUsers();
      const orders = await Order.getAllOrders();
      const complaints = await Complaint.getAllComplaints();

      // Calculate statistics
      const stats = {
        totalUsers: users.length,
        totalOrders: orders.length,
        totalComplaints: complaints.length,
        recentOrders: orders.slice(0, 5), // Last 5 orders
        recentComplaints: complaints.slice(0, 5), // Last 5 complaints
        orderStatuses: {
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing').length,
          shipped: orders.filter(o => o.status === 'shipped').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length
        },
        complaintStatuses: {
          open: complaints.filter(c => c.status === 'open').length,
          investigating: complaints.filter(c => c.status === 'investigating').length,
          resolved: complaints.filter(c => c.status === 'resolved').length,
          closed: complaints.filter(c => c.status === 'closed').length
        }
      };
      
      res.status(200).json({
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: stats
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;
