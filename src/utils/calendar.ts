import { createEvent, DateArray } from 'ics';
import { Interview } from '../models/interview';

export const downloadCalendarEvent = (interview: Interview) => {
  const { companyName, date, type, platform, link, address } = interview;

  const description = type === 'online' 
    ? `Platform: ${platform}\nLink: ${link}` 
    : `Address: ${address}`;

  const location = type === 'online' ? (link || platform) : address;

  const event = {
    start: [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()],
    duration: { hours: 1 },
    title: `Interview: ${companyName}`,
    description: description,
    location: location,
    status: 'CONFIRMED' as const,
  };

  createEvent(event, (error, value) => {
    if (error) return;
    
    const blob = new Blob([value], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const linkEl = document.createElement('a');
    linkEl.href = url;
    linkEl.setAttribute('download', `interview-${companyName.replace(/\s+/g, '-').toLowerCase()}.ics`);
    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
  });
};