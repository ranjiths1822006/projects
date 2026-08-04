import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeData } from '../types';

// Pure JavaScript mathematical converter from oklch(...) to rgb(r, g, b) / rgba(...)
function parseVal(str: string, maxVal: number): number {
  if (!str) return 0;
  if (str.endsWith('%')) {
    return (parseFloat(str) / 100) * maxVal;
  }
  return parseFloat(str);
}

function oklchToRgb(oklchStr: string): string {
  // Support both space-separated and comma-separated oklch arguments
  const match = oklchStr.match(/oklch\(\s*([\d.%]+)(?:[\s,]+)([\d.%]+)(?:[\s,]+)([\d.%]+)(?:\s*(?:[\/,])\s*([\d.%]+))?\s*\)/i);
  if (!match) {
    return '#334155'; // Fallback dark slate
  }

  const l = parseVal(match[1], 1);
  const c = parseVal(match[2], 1);
  const h = parseFloat(match[3]) || 0;
  const a = match[4] !== undefined ? parseVal(match[4], 1) : 1;

  const hRad = (h * Math.PI) / 180;
  const aLab = c * Math.cos(hRad);
  const bLab = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * aLab + 0.2158037573 * bLab;
  const m_ = l - 0.1055613458 * aLab - 0.0638541728 * bLab;
  const s_ = l - 0.0894841775 * aLab - 1.2914855480 * bLab;

  const l_cube = l_ * l_ * l_;
  const m_cube = m_ * m_ * m_;
  const s_cube = s_ * s_ * s_;

  const rLin = +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
  const gLin = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
  const bLin = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.7076147010 * s_cube;

  const toSRGB = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    const val = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(val * 255);
  };

  const r = toSRGB(rLin);
  const g = toSRGB(gLin);
  const b = toSRGB(bLin);

  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function replaceOklchColors(text: string): string {
  if (!text || !text.includes('oklch')) return text;
  return text.replace(/oklch\([^)]+\)/gi, (match) => oklchToRgb(match));
}

export const exportToPdf = async (elementId: string, resumeData: ResumeData): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Resume preview element with id '${elementId}' not found.`);
  }

  // Temporary zoom reset for full resolution capture
  const originalStyleWidth = element.style.width;
  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;

  try {
    element.style.transform = 'none';

    // Render canvas with high resolution scale
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x for sharp crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // 1. Sanitize all <style> tag elements containing oklch
        const styleElements = Array.from(clonedDoc.querySelectorAll('style'));
        styleElements.forEach((styleEl) => {
          if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
            styleEl.textContent = replaceOklchColors(styleEl.textContent);
          }
        });

        // 2. Sanitize inline styles and computed styles on all cloned DOM nodes
        const allNodes = Array.from(clonedDoc.querySelectorAll('*')) as HTMLElement[];
        allNodes.forEach((node) => {
          const styleAttr = node.getAttribute('style');
          if (styleAttr && styleAttr.includes('oklch')) {
            node.setAttribute('style', replaceOklchColors(styleAttr));
          }

          const computed = clonedDoc.defaultView?.getComputedStyle(node);
          if (computed) {
            const colorProps = [
              'color',
              'background-color',
              'border-color',
              'border-top-color',
              'border-right-color',
              'border-bottom-color',
              'border-left-color',
              'outline-color',
              'fill',
              'stroke',
            ];

            colorProps.forEach((prop) => {
              const val = computed.getPropertyValue(prop);
              if (val && val.includes('oklch')) {
                node.style.setProperty(prop, replaceOklchColors(val), 'important');
              }
            });
          }
        });
      },
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Initialize A4 size PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Calculate height according to aspect ratio
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Handle multi-page if resume content spans longer
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    // Format clean filename: e.g., Alex_Vance_Resume.pdf
    const safeName = resumeData.personalInfo.fullName
      ? resumeData.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_')
      : 'My';
    const filename = `${safeName}_Resume.pdf`;

    pdf.save(filename);
  } finally {
    // Restore preview transform styles
    element.style.width = originalStyleWidth;
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
  }
};

