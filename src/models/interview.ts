export type InterviewType = 'online' | 'in-person';

export interface Interview {
  id: string;
  companyName: string;
  date: Date;
  type: InterviewType;
  platform?: string; 
  link?: string;
  address?: string;
}