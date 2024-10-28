import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import the styles

const ShopMore = () => {
  const pdfFile = '/pdfs/CigarettesCatalog.pdf';

  return (
    <div>
      {/* PDF Viewer Component with Worker */}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfFile} />
      </Worker>

      {/* Download Button */}
      <a href={pdfFile} download>
        <button>Download PDF</button>
      </a>
    </div>
  );
};

export default ShopMore;


