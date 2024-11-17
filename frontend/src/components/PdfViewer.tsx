import React from 'react';
import { Document, Page } from 'react-pdf';

interface PdfViewerProps {
  file: File | null;
  currentPage: number;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  numPages: number | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file, currentPage, onDocumentLoadSuccess, numPages }) => {
  return (
    <div className="pdf-viewer">
      {file && (
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={currentPage} renderTextLayer={false} />
        </Document>
      )}
    </div>
  );
};

export default PdfViewer;