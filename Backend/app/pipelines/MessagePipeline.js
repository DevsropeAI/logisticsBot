class MessagePipeline {
  static process(message) {
    message = message.toLowerCase();

    // extract order number
    const match = message.match(
      /(ord\d+|\d{4,})/i
    );
    // console.log("match", match);
    return {
      orderNumber: match ? match[0].toUpperCase() : null,
      original: message
    };
  }
}

module.exports = MessagePipeline;