class MessagePipeline {
  static process(message, req) {
    message = message.toLowerCase();

    // extract order number
    const match = message.match(
      /(ord\d+|\d{4,})/i
    );
    // console.log("match", match);
    if(match){
      req.session.orderId = match[0].toUpperCase();
    }
    
    return {
      orderNumber: match ? match[0].toUpperCase() : null,
      original: message
    };
  }
}

module.exports = MessagePipeline;