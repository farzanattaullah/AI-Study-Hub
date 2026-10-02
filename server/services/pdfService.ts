import { extractText } from 'unpdf';

export async function extractTextFromUploadedFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<{ text: string; fileType: 'PDF' | 'TXT' }> {
  const lowerName = originalName.toLowerCase();
  const isTxt = lowerName.endsWith('.txt') || mimeType === 'text/plain';
  const isPdf = lowerName.endsWith('.pdf') || mimeType === 'application/pdf';

  if (!isTxt && !isPdf) {
    throw new Error('Unsupported file format. Please upload a valid PDF (.pdf) or Text (.txt) file.');
  }

  if (isTxt) {
    const text = buffer.toString('utf-8').trim();
    if (!text || text.length < 15) {
      throw new Error('The uploaded TXT file appears to be empty or too short to analyze.');
    }
    return { text, fileType: 'TXT' };
  }

  // Extract from PDF using unpdf
  try {
    const uint8 = new Uint8Array(buffer);
    const result = await extractText(uint8, { mergePages: true });
    const extracted = Array.isArray(result.text) ? result.text.join('\n\n') : String(result.text || '');
    const clean = extracted.replace(/\s+\n/g, '\n').trim();
    if (clean.length >= 20) {
      return { text: clean, fileType: 'PDF' };
    }
  } catch (err) {
    console.warn('[PDF] unpdf extraction fallback triggered:', err);
  }

  // Fallback: extract readable ASCII/UTF-8 text streams from raw PDF buffer
  const rawString = buffer.toString('latin1');
  const parentheticalMatches = rawString.match(/\(([^()\\]{3,})\)/g) || [];
  const extractedFragments = parentheticalMatches
    .map((m) => m.slice(1, -1))
    .filter((fragment) => /[a-zA-Z]{3,}/.test(fragment) && !/^(Type|Font|Page|Catalog|Outlines|Parent|Resources|MediaBox|Contents)/i.test(fragment));

  const fallbackText = extractedFragments.join(' ').replace(/\s+/g, ' ').trim();
  if (fallbackText.length >= 25) {
    return { text: fallbackText, fileType: 'PDF' };
  }

  throw new Error("Sorry, we couldn't process this PDF. Please make sure it contains selectable text and try another file.");
}
