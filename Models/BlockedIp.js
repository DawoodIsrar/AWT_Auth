const mongoose = require('mongoose');

const blockedIPSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, unique: true },
  failedAttempts: { type: Number, default: 0 },
  lastFailedAttempt: { type: Date },
  blockedUntil: { type: Date },
});

const BlockedIP = mongoose.model('BlockedIP', blockedIPSchema);

module.exports = BlockedIP;
