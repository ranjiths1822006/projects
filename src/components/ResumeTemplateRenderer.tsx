import React from 'react';
import { ResumeData } from '../types';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { CleanATSTemplate } from './templates/CleanATSTemplate';

interface ResumeTemplateRendererProps {
  data: ResumeData;
}

export const ResumeTemplateRenderer: React.FC<ResumeTemplateRendererProps> = ({ data }) => {
  switch (data.theme?.templateId) {
    case 'classic':
      return <ClassicTemplate data={data} />;
    case 'minimal':
      return <MinimalTemplate data={data} />;
    case 'executive':
      return <ExecutiveTemplate data={data} />;
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'clean_ats':
      return <CleanATSTemplate data={data} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} />;
  }
};
