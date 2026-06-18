const pdfParse = require('pdf-parse');

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    const text = data.text?.trim();
    if (!text || text.length < 100) {
      throw new Error('PDF text extract nahi hua. Scanned PDF ho sakta hai — please text-based PDF upload karo.');
    }
    // Return first 12000 chars to stay within Claude token limits
    return text.slice(0, 12000);
  } catch (err) {
    throw new Error('PDF parse error: ' + err.message);
  }
}

module.exports = { extractTextFromPDF };