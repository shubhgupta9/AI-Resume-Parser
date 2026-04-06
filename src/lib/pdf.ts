import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Use the worker from the package directly via Vite's ?url import
// This is the recommended way for pdfjs-dist 4+ in Vite
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => (item as any).str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}
