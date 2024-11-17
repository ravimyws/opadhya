import React from 'react';

interface OcrResultsProps {
  currentPage: number;
  ocrResults: { [key: number]: Tesseract.RecognizeResult };
}

const OcrResults: React.FC<OcrResultsProps> = ({ currentPage, ocrResults }) => {

  return (
    ocrResults[currentPage] && (
      <div className="ocr-results">
        <h3>Page {currentPage}</h3>
        <div dangerouslySetInnerHTML={{ __html: ocrResults[currentPage].data.hocr as string }} />
      </div>
    )
  );
};

export default OcrResults;