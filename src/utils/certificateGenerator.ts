import { Certificate } from '../types';

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

export const generateCertificateData = async (certificate: Certificate): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Canvas size
  canvas.width = 1200;
  canvas.height = 850;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Inner border
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  // Header background band
  const headerY = 100;
  const headerHeight = 160;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(80, headerY, canvas.width - 160, headerHeight);

  // Prepare college name font for measurement
  ctx.font = 'bold 24px serif';
  const collegeName = 'MUHAMMED ABDURAHIMAN MEMORIAL ORPHANAGE COLLEGE';
  const centerX = canvas.width / 2;
  const textWidth = ctx.measureText(collegeName).width;
  const textLeft = centerX - textWidth / 2;
  const textRight = centerX + textWidth / 2;

  // Try load logos from public folder
  let nssImg: HTMLImageElement | null = null;
  let collegeImg: HTMLImageElement | null = null;
  try {
    nssImg = await loadImage('/download.png'); // NSS logo (existing)
  } catch {
    nssImg = null;
  }
  try {
    // prefer a safe filename without spaces; fall back to encoded name then a generic name
    try {
      collegeImg = await loadImage('/mamo-logo.png');
    } catch {
      try {
        collegeImg = await loadImage('/mamo%20logo.png');
      } catch {
        collegeImg = await loadImage('/college-logo.png');
      }
    }
  } catch {
    collegeImg = null;
  }

  // Logo sizes and positions: college larger, NSS smaller
  const collegeLogoDiameter = 160; // px
  const nssLogoDiameter = 110; // px (smaller)
  // initial left logo x based on inner margin
  const leftLogoX = 60 + collegeLogoDiameter / 2 + 20; // left gap from inner border
  const leftLogoY = headerY + headerHeight / 2;

  // compute symmetric gap between logos and text edges
  const leftLogoRight = leftLogoX + collegeLogoDiameter / 2;
  let leftGap = textLeft - leftLogoRight;
  if (leftGap < 16) leftGap = 16; // ensure a minimum gap

  // position right logo so right gap equals leftGap
  const rightLogoLeftDesired = textRight + leftGap;
  const rightLogoX = rightLogoLeftDesired + nssLogoDiameter / 2;
  const rightLogoY = leftLogoY;

  // Draw college logo (left) as circle
  if (collegeImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(leftLogoX, leftLogoY, collegeLogoDiameter / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    // draw image centered in that circle
    ctx.drawImage(collegeImg, leftLogoX - collegeLogoDiameter / 2, leftLogoY - collegeLogoDiameter / 2, collegeLogoDiameter, collegeLogoDiameter);
    ctx.restore();
  }

  // Draw NSS logo (right) as circle
  if (nssImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(rightLogoX, rightLogoY, nssLogoDiameter / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(nssImg, rightLogoX - nssLogoDiameter / 2, rightLogoY - nssLogoDiameter / 2, nssLogoDiameter, nssLogoDiameter);
    ctx.restore();
  }

  // College/Institution Header (centered) - ensure text fits between logos
  ctx.fillStyle = '#1e40af';
  ctx.textAlign = 'center';
  const headerCenterY = headerY + headerHeight / 2;
  ctx.fillText(collegeName, centerX, headerCenterY - 8);

  // NSS subtitle
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('National Service Scheme (NSS)', centerX, headerCenterY + 18);

  // Certificate Title (moved below header band)
  const titleY = headerY + headerHeight + 30; // leave space after header
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 44px serif';
  ctx.fillText('CERTIFICATE OF PARTICIPATION', centerX, titleY);

  // Decorative line under title
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, titleY + 20);
  ctx.lineTo(canvas.width - 300, titleY + 20);
  ctx.stroke();

  // Main content
  ctx.fillStyle = '#374151';
  ctx.font = '22px serif';
  const contentStartY = titleY + 60;
  // use contentStartY for positioning the certificate text block
  ctx.fillText('This is to certify that', centerX, contentStartY);

  // Student name
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 34px serif';
  ctx.fillText(certificate.studentName, centerX, contentStartY + 50);

  // Department
  ctx.fillStyle = '#059669';
  ctx.font = '18px serif';
  ctx.fillText(`Department of ${certificate.studentDepartment}`, centerX, contentStartY + 80);

  // Participation line
  ctx.fillStyle = '#374151';
  ctx.font = '20px serif';
  ctx.fillText('has successfully participated in', centerX, contentStartY + 120);

  // Program title
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 26px serif';
  ctx.fillText(certificate.programTitle, centerX, contentStartY + 165);

  // Program details
  ctx.fillStyle = '#374151';
  ctx.font = '18px serif';
  const programDateStr = new Date(certificate.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  ctx.fillText(`held on ${programDateStr} at ${certificate.time}`, centerX, contentStartY + 200);
  ctx.fillText(`Venue: ${certificate.venue}`, centerX, contentStartY + 230);

  // Signature section
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px serif';
  ctx.textAlign = 'left';

  // Left signature
  ctx.fillText('Program Coordinator', 180, canvas.height - 170);
  ctx.fillText(certificate.coordinator, 180, canvas.height - 140);
  ctx.beginPath();
  ctx.moveTo(160, canvas.height - 120);
  ctx.lineTo(340, canvas.height - 120);
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Right signature
  ctx.fillText('NSS Program Officer', canvas.width - 360, canvas.height - 170);
  ctx.fillText('Dr. Academic Head', canvas.width - 360, canvas.height - 140);
  ctx.beginPath();
  ctx.moveTo(canvas.width - 380, canvas.height - 120);
  ctx.lineTo(canvas.width - 200, canvas.height - 120);
  ctx.stroke();

  // Left official seal (if college logo not used)
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(250, canvas.height - 200, 40, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL', 250, canvas.height - 205);
  ctx.fillText('SEAL', 250, canvas.height - 190);

  // Right college seal (if college logo not used)
  ctx.strokeStyle = '#059669';
  ctx.beginPath();
  ctx.arc(canvas.width - 250, canvas.height - 200, 40, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#059669';
  ctx.fillText('COLLEGE', canvas.width - 250, canvas.height - 205);
  ctx.fillText('SEAL', canvas.width - 250, canvas.height - 190);

  // Date of issue
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Date of Issue: ${new Date().toLocaleDateString('en-IN')}`, centerX, canvas.height - 50);

  return canvas.toDataURL('image/png');
};

export const downloadCertificate = async (certificate: Certificate): Promise<void> => {
  const dataUrl = await generateCertificateData(certificate);
  const link = document.createElement('a');
  link.download = `${certificate.studentName.replace(/\s+/g, '_')}_${certificate.programTitle.replace(/\s+/g, '_')}_Certificate.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};