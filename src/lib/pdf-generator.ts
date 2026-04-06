import { jsPDF } from 'jspdf';
import { ParsedResume } from '../types';

export const generateResumePDF = (resume: ParsedResume) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Helper to add text and update Y
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, margin, y);
    y += (lines.length * (fontSize * 0.5)) + 2;
    
    if (y > 280) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  addText(resume.personalDetails.name, 22, true, [37, 99, 235]); // Blue-600
  y += 2;
  addText(`${resume.personalDetails.email} | ${resume.personalDetails.phone} | ${resume.personalDetails.location}`, 10, false, [100, 116, 139]);
  
  const links = [
    resume.personalDetails.linkedin,
    resume.personalDetails.github,
    resume.personalDetails.portfolio
  ].filter(Boolean).join(' | ');
  
  if (links) {
    addText(links, 10, false, [100, 116, 139]);
  }
  
  y += 5;
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.line(margin, y, 190, y);
  y += 10;

  // Experience
  addText('PROFESSIONAL EXPERIENCE', 14, true, [15, 23, 42]); // Slate-900
  y += 2;
  
  resume.experience.forEach(exp => {
    addText(`${exp.role} at ${exp.company}`, 11, true);
    addText(`${exp.startDate} - ${exp.endDate} | ${exp.location}`, 9, false, [100, 116, 139]);
    
    exp.responsibilities.forEach(resp => {
      addText(`• ${resp}`, 10);
    });
    y += 4;
  });

  // Education
  y += 5;
  addText('EDUCATION', 14, true, [15, 23, 42]);
  y += 2;
  
  resume.education.forEach(edu => {
    addText(`${edu.degree}`, 11, true);
    addText(`${edu.institution}`, 10, false);
    addText(`${edu.startDate} - ${edu.endDate} | ${edu.location}`, 9, false, [100, 116, 139]);
    if (edu.description) addText(edu.description, 10);
    y += 4;
  });

  // Skills
  y += 5;
  addText('SKILLS', 14, true, [15, 23, 42]);
  y += 2;
  addText(resume.skills.join(', '), 10);

  // Projects
  if (resume.projects.length > 0) {
    y += 10;
    addText('PROJECTS', 14, true, [15, 23, 42]);
    y += 2;
    
    resume.projects.forEach(proj => {
      addText(proj.name, 11, true);
      addText(proj.description, 10);
      addText(`Technologies: ${proj.technologies.join(', ')}`, 9, false, [100, 116, 139]);
      if (proj.link) addText(`Link: ${proj.link}`, 9, false, [37, 99, 235]);
      y += 4;
    });
  }

  doc.save(`${resume.personalDetails.name.replace(/\s+/g, '_')}_Optimized_Resume.pdf`);
};
