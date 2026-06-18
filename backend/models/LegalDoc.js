const mongoose = require('mongoose');

const riskClauseSchema = new mongoose.Schema({
  clause:      String,   // Original risky clause text
  explanation: String,   // Why it's risky in plain language
  severity:    { type: String, enum: ['low', 'medium', 'high'] },
});

const chatMessageSchema = new mongoose.Schema({
  role:    { type: String, enum: ['user', 'assistant'] },
  content: String,
}, { timestamps: true });

const legalDocSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName:        String,
  fileSize:        Number,
  docType:         String,   // rent agreement, job contract, court notice, NDA, etc.
  originalText:    String,   // raw extracted text (truncated for storage)
  simplifiedText:  String,   // AI plain language summary
  keyPoints:       [String], // bullet point key facts
  riskClauses:     [riskClauseSchema],
  riskScore:       { type: Number, min: 0, max: 10 },
  riskSummary:     String,
  partyNames:      [String],
  importantDates:  [String],
  chatHistory:     [chatMessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('LegalDoc', legalDocSchema);