import React, { useState } from 'react';
import { ResumeData } from '../types';
import { ResumeTemplateRenderer } from './ResumeTemplateRenderer';
import { exportToPdf } from '../services/pdfExport';
import { exportToDocx } from '../services/docxExport';
import { FileText, Download, ZoomIn, ZoomOut, Maximize2, Loader2, Sparkles } from 'lucide-react';

interface LivePreviewProps {
  data: ResumeData;
  onOpenATSModal: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ data, onOpenATSModal }) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportToPdf('resume-preview-document', data);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportToDocx(data);
    } catch (err) {
      console.error('Word Export Error:', err);
      alert('Failed to export Word document. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="bg-slate-200/60 dark:bg-slate-900/60 rounded-lg border border-slate-300/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-colors">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-700 dark:text-slate-200 font-bold tracking-tight">Live A4 Preview</span>
          <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700">
            {data.theme.templateId}
          </span>
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded p-0.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono font-semibold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download Word DOCX Button */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isExportingDocx ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
            Word (.docx)
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Download PDF
          </button>
        </div>
      </div>

      {/* Preview Scalable Scroll Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: '794px', // A4 pixel width at standard DPI
          }}
          className="shadow-xl rounded border border-slate-200 overflow-hidden bg-white"
        >
          <div id="resume-preview-document">
            <ResumeTemplateRenderer data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};
