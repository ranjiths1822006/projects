import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '../types';

export const exportToDocx = async (resumeData: ResumeData): Promise<void> => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, theme } = resumeData;

  // Convert primary color hex to docx RGB string (without #)
  const primaryHex = theme?.primaryColor ? theme.primaryColor.replace('#', '') : '1E40AF';

  const children: (Paragraph | Table)[] = [];

  // Helper for Section Heading
  const createSectionHeading = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: primaryHex,
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24, // 12pt
          color: primaryHex,
          font: theme.fontFamily === 'serif' ? 'Georgia' : 'Arial',
        }),
      ],
    });
  };

  // 1. Header (Name, Job Title, Contact Details)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Your Name',
          bold: true,
          size: 36, // 18pt
          color: '111827',
          font: theme.fontFamily === 'serif' ? 'Georgia' : 'Arial',
        }),
      ],
    })
  );

  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: personalInfo.jobTitle,
            size: 24, // 12pt
            color: primaryHex,
            bold: true,
            font: theme.fontFamily === 'serif' ? 'Georgia' : 'Arial',
          }),
        ],
      })
    );
  }

  // Contact line
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.website) contactParts.push(personalInfo.website);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.github) contactParts.push(personalInfo.github);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 18, // 9pt
            color: '4B5563',
          }),
        ],
      })
    );
  }

  // 2. Professional Summary
  if (personalInfo.summary) {
    children.push(createSectionHeading('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 20, // 10pt
            color: '1F2937',
          }),
        ],
      })
    );
  }

  // 3. Work Experience
  if (experience && experience.length > 0) {
    children.push(createSectionHeading('Work Experience'));

    experience.forEach((exp) => {
      // Header row: Position & Company (Left) / Dates & Location (Right) using a borderless 2-column table
      const dateText = `${exp.startDate || ''} – ${exp.isCurrent ? 'Present' : exp.endDate || ''}`;
      
      const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: exp.position,
                        bold: true,
                        size: 22,
                        color: '111827',
                      }),
                      new TextRun({
                        text: exp.company ? `  |  ${exp.company}` : '',
                        size: 20,
                        color: '374151',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `${dateText}${exp.location ? ` (${exp.location})` : ''}`,
                        size: 18,
                        color: '6B7280',
                        italics: true,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      children.push(headerTable);

      // Bullet points
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet) => {
          if (bullet.trim()) {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: bullet.replace(/^[•\s-]+/, ''),
                    size: 20,
                    color: '1F2937',
                  }),
                ],
              })
            );
          }
        });
      }

      // Spacing between experience items
      children.push(new Paragraph({ spacing: { after: 120 } }));
    });
  }

  // 4. Education
  if (education && education.length > 0) {
    children.push(createSectionHeading('Education'));

    education.forEach((edu) => {
      const dateText = `${edu.startDate || ''} – ${edu.endDate || ''}`;

      const eduTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`,
                        bold: true,
                        size: 22,
                        color: '111827',
                      }),
                      new TextRun({
                        text: edu.institution ? `  •  ${edu.institution}` : '',
                        size: 20,
                        color: '374151',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `${dateText}${edu.location ? ` (${edu.location})` : ''}`,
                        size: 18,
                        color: '6B7280',
                        italics: true,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      children.push(eduTable);

      if (edu.gpa) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 40 },
            children: [
              new TextRun({ text: `GPA: `, bold: true, size: 18 }),
              new TextRun({ text: edu.gpa, size: 18 }),
            ],
          })
        );
      }

      if (edu.highlights && edu.highlights.length > 0) {
        edu.highlights.forEach((h) => {
          if (h.trim()) {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 20, after: 20 },
                children: [new TextRun({ text: h, size: 18 })],
              })
            );
          }
        });
      }

      children.push(new Paragraph({ spacing: { after: 100 } }));
    });
  }

  // 5. Skills
  if (skills && skills.length > 0) {
    children.push(createSectionHeading('Skills & Expertise'));

    // Group skills by category
    const categories: { [cat: string]: string[] } = {};
    skills.forEach((sk) => {
      const cat = sk.category || 'Technical';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(sk.name);
    });

    Object.entries(categories).forEach(([category, skillList]) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 60 },
          children: [
            new TextRun({
              text: `${category}: `,
              bold: true,
              color: primaryHex,
              size: 20,
            }),
            new TextRun({
              text: skillList.join(', '),
              size: 20,
              color: '1F2937',
            }),
          ],
        })
      );
    });
  }

  // 6. Projects
  if (projects && projects.length > 0) {
    children.push(createSectionHeading('Projects'));

    projects.forEach((proj) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({
              text: proj.title,
              bold: true,
              size: 22,
              color: '111827',
            }),
            proj.link
              ? new TextRun({
                  text: ` (${proj.link})`,
                  size: 18,
                  color: primaryHex,
                })
              : new TextRun({ text: '' }),
          ],
        })
      );

      if (proj.techStack && proj.techStack.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: 'Technologies: ', bold: true, size: 18, color: '4B5563' }),
              new TextRun({ text: proj.techStack.join(', '), size: 18, color: '6B7280' }),
            ],
          })
        );
      }

      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: proj.description, size: 20 })],
          })
        );
      }

      if (proj.bullets && proj.bullets.length > 0) {
        proj.bullets.forEach((b) => {
          if (b.trim()) {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 20, after: 20 },
                children: [new TextRun({ text: b.replace(/^[•\s-]+/, ''), size: 20 })],
              })
            );
          }
        });
      }

      children.push(new Paragraph({ spacing: { after: 100 } }));
    });
  }

  // 7. Certifications & Languages
  if ((certifications && certifications.length > 0) || (languages && languages.length > 0)) {
    children.push(createSectionHeading('Certifications & Languages'));

    if (certifications && certifications.length > 0) {
      certifications.forEach((c) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: c.name, bold: true, size: 20 }),
              new TextRun({ text: c.issuer ? ` – ${c.issuer}` : '', size: 20 }),
              new TextRun({ text: c.issueDate ? ` (${c.issueDate})` : '', size: 18, color: '6B7280' }),
            ],
          })
        );
      });
    }

    if (languages && languages.length > 0) {
      const langStr = languages.map((l) => `${l.name} (${l.proficiency})`).join(', ');
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: 'Languages: ', bold: true, size: 20, color: primaryHex }),
            new TextRun({ text: langStr, size: 20 }),
          ],
        })
      );
    }
  }

  // Build document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  // Export to Blob and trigger save
  const blob = await Packer.toBlob(doc);
  const safeName = personalInfo.fullName
    ? personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_')
    : 'My';
  saveAs(blob, `${safeName}_Resume.docx`);
};
