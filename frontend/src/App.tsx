import React, { useState, useEffect, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import './pdfConfig';
import "./App.css";
import Controlles from './components/Controlles';
import PdfViewer from './components/PdfViewer';
import OcrResults from './components/OcrResults';



const languages = [
  { name: "English", code: "eng" },
  { name: "Portuguese", code: "por" },
  { name: "Afrikaans", code: "afr" },
  { name: "Albanian", code: "sqi" },
  { name: "Amharic", code: "amh" },
  { name: "Arabic", code: "ara" },
  { name: "Assamese", code: "asm" },
  { name: "Azerbaijani", code: "aze" },
  { name: "Azerbaijani - Cyrillic", code: "aze_cyrl" },
  { name: "Basque", code: "eus" },
  { name: "Belarusian", code: "bel" },
  { name: "Bengali", code: "ben" },
  { name: "Bosnian", code: "bos" },
  { name: "Bulgarian", code: "bul" },
  { name: "Burmese", code: "mya" },
  { name: "Catalan; Valencian", code: "cat" },
  { name: "Cebuano", code: "ceb" },
  { name: "Central Khmer", code: "khm" },
  { name: "Cherokee", code: "chr" },
  { name: "Chinese - Simplified", code: "chi_sim" },
  { name: "Chinese - Traditional", code: "chi_tra" },
  { name: "Croatian", code: "hrv" },
  { name: "Czech", code: "ces" },
  { name: "Danish", code: "dan" },
  { name: "Dutch; Flemish", code: "nld" },
  { name: "Dzongkha", code: "dzo" },
  { name: "English, Middle (1100-1500)", code: "enm" },
  { name: "Esperanto", code: "epo" },
  { name: "Estonian", code: "est" },
  { name: "Finnish", code: "fin" },
  { name: "French", code: "fra" },
  { name: "French, Middle (ca. 1400-1600)", code: "frm" },
  { name: "Galician", code: "glg" },
  { name: "Georgian", code: "kat" },
  { name: "German", code: "deu" },
  { name: "German Fraktur", code: "frk" },
  { name: "Greek, Modern (1453-)", code: "ell" },
  { name: "Greek, Ancient (-1453)", code: "grc" },
  { name: "Gujarati", code: "guj" },
  { name: "Haitian; Haitian Creole", code: "hat" },
  { name: "Hebrew", code: "heb" },
  { name: "Hindi", code: "hin" },
  { name: "Hungarian", code: "hun" },
  { name: "Icelandic", code: "isl" },
  { name: "Indonesian", code: "ind" },
  { name: "Inuktitut", code: "iku" },
  { name: "Irish", code: "gle" },
  { name: "Italian", code: "ita" },
  { name: "Japanese", code: "jpn" },
  { name: "Javanese", code: "jav" },
  { name: "Kannada", code: "kan" },
  { name: "Kazakh", code: "kaz" },
  { name: "Kirghiz; Kyrgyz", code: "kir" },
  { name: "Korean", code: "kor" },
  { name: "Kurdish", code: "kur" },
  { name: "Lao", code: "lao" },
  { name: "Latin", code: "lat" },
  { name: "Latvian", code: "lav" },
  { name: "Lithuanian", code: "lit" },
  { name: "Macedonian", code: "mkd" },
  { name: "Malay", code: "msa" },
  { name: "Malayalam", code: "mal" },
  { name: "Maltese", code: "mlt" },
  { name: "Marathi", code: "mar" },
  { name: "Nepali", code: "nep" },
  { name: "Norwegian", code: "nor" },
  { name: "Oriya", code: "ori" },
  { name: "Panjabi; Punjabi", code: "pan" },
  { name: "Persian", code: "fas" },
  { name: "Polish", code: "pol" },
  { name: "Pushto; Pashto", code: "pus" },
  { name: "Romanian; Moldavian; Moldovan", code: "ron" },
  { name: "Russian", code: "rus" },
  { name: "Sanskrit", code: "san" },
  { name: "Serbian", code: "srp" },
  { name: "Serbian - Latin", code: "srp_latn" },
  { name: "Sinhala; Sinhalese", code: "sin" },
  { name: "Slovak", code: "slk" },
  { name: "Slovenian", code: "slv" },
  { name: "Spanish; Castilian", code: "spa" },
  { name: "Swahili", code: "swa" },
  { name: "Swedish", code: "swe" },
  { name: "Syriac", code: "syr" },
  { name: "Tagalog", code: "tgl" },
  { name: "Tajik", code: "tgk" },
  { name: "Tamil", code: "tam" },
  { name: "Telugu", code: "tel" },
  { name: "Thai", code: "tha" },
  { name: "Tibetan", code: "bod" },
  { name: "Tigrinya", code: "tir" },
  { name: "Turkish", code: "tur" },
  { name: "Uighur; Uyghur", code: "uig" },
  { name: "Ukrainian", code: "ukr" },
  { name: "Urdu", code: "urd" },
  { name: "Uzbek", code: "uzb" },
  { name: "Uzbek - Cyrillic", code: "uzb_cyrl" },
  { name: "Vietnamese", code: "vie" },
  { name: "Welsh", code: "cym" },
  { name: "Yiddish", code: "yid" },
];

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ocrResults, setOcrResults] = useState<{ [key: number]: Tesseract.RecognizeResult }>({});
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    setOcrResults({});
    setCurrentPage(1);
  };

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    localStorage.setItem("opadhyalanguage", language);
  };

  const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (file) {
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
      setPdfDocument(pdf);
    }
  };

  const performOcr = useCallback(async (pageNum: number) => {
    if (!pdfDocument || ocrResults[pageNum]) return;
  
      const page = await pdfDocument.getPage(pageNum);
      // const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      await page.render({ canvasContext: context!, viewport }).promise;
      const dataUrl = canvas.toDataURL();
  
      const result = await Tesseract.recognize(dataUrl, selectedLanguage);
      console.log(result);
      setOcrResults(prevResults => ({ ...prevResults, [pageNum]: result }));
    }, [pdfDocument, ocrResults,selectedLanguage]);
  
    useEffect(() => {
      const savedLanguage = localStorage.getItem("opadhyalanguage");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
      if (file && currentPage) {
        performOcr(currentPage);
      }
    }, [file, currentPage, performOcr]);

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => {
      console.log(prevPage);
      return Math.min(prevPage + 1, numPages || 1);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Controlles
          onFileChange={onFileChange}
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          languages={languages}
          file={file}
          currentPage={currentPage}
          numPages={numPages}
        />
      </header>
      <div className="content">
        <PdfViewer 
          file={file}
          currentPage={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          numPages={numPages}
        />
        <OcrResults currentPage={currentPage} ocrResults={ocrResults} />
      </div>
    </div>
  );
};

export default App;