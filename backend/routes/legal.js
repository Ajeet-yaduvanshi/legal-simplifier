const express   = require('express');
const router    = express.Router();
const multer    = require('multer');
const auth      = require('../middleware/authMiddleware');
const LegalDoc  = require('../models/LegalDoc');
const { extractTextFromPDF }               = require('../services/pdfService');
const { analyzeDocument, askDocumentQuestion } = require('../services/groqService');

// Multer — memory storage, PDF only, 10MB max
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files allowed'), false),
});

// ── POST /api/legal/upload ─────────────────────────────────────────
router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'PDF file required.' });

  try {
    // 1. Extract text
    const rawText = await extractTextFromPDF(req.file.buffer);

    // 2. Claude AI analysis
    const aiResult = await analyzeDocument(rawText);

    // 3. Save to MongoDB
    const doc = await LegalDoc.create({
      userId:         req.userId,
      fileName:       req.file.originalname,
      fileSize:       req.file.size,
      originalText:   rawText.slice(0, 8000),  // store first 8k chars
      docType:        aiResult.docType,
      simplifiedText: aiResult.simplifiedText,
      keyPoints:      aiResult.keyPoints,
      riskClauses:    aiResult.riskClauses,
      riskScore:      aiResult.riskScore,
      riskSummary:    aiResult.riskSummary,
      partyNames:     aiResult.partyNames,
      importantDates: aiResult.importantDates,
      chatHistory:    [],
    });

    res.status(201).json({ doc });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/legal/ask ────────────────────────────────────────────
router.post('/ask', auth, async (req, res) => {
  const { docId, question } = req.body;
  if (!docId || !question)
    return res.status(400).json({ message: 'docId and question required.' });

  try {
    const doc = await LegalDoc.findOne({ _id: docId, userId: req.userId });
    if (!doc) return res.status(404).json({ message: 'Document not found.' });

    // Get AI answer using stored text + chat history
    const answer = await askDocumentQuestion(
      doc.originalText,
      doc.chatHistory,
      question
    );

    // Append to chat history
    doc.chatHistory.push({ role: 'user',      content: question });
    doc.chatHistory.push({ role: 'assistant', content: answer   });
    await doc.save();

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/legal/history ─────────────────────────────────────────
router.get('/history', auth, async (req, res) => {
  try {
    const docs = await LegalDoc.find({ userId: req.userId })
      .select('-originalText -chatHistory')  // don't send heavy fields in list
      .sort({ createdAt: -1 });
    res.json({ docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/legal/doc/:id ─────────────────────────────────────────
router.get('/doc/:id', auth, async (req, res) => {
  try {
    const doc = await LegalDoc.findOne({ _id: req.params.id, userId: req.userId });
    if (!doc) return res.status(404).json({ message: 'Document not found.' });
    res.json({ doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;