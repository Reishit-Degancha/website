const API_KEY = import.meta.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = import.meta.env.GOOGLE_SHEET_ID;

interface ServiceTimeItem {
  event: string;
  time: string;
  notes?: string;
}

interface ServiceTimeSection {
  title: string;
  subtitle?: string;
  items: ServiceTimeItem[];
}

interface Announcement {
  title: string;
  content: string;
}

async function fetchSheet(tabName: string, range: string): Promise<string[][]> {
  const encodedTab = encodeURIComponent(tabName);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedTab}!${range}?key=${API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error('Failed to fetch sheet:', await response.text());
    return [];
  }
  
  const data = await response.json();
  return data.values || [];
}

export async function getServiceTimes(): Promise<ServiceTimeSection[]> {
  const rows = await fetchSheet('times', 'A2:D100');
  
  const sections: ServiceTimeSection[] = [];
  let currentSection: ServiceTimeSection | null = null;
  
  for (const row of rows) {
    const [section, event, time, notes] = row;
    
    if (section?.trim()) {
      // New section header
      currentSection = {
        title: section.trim(),
        subtitle: notes?.trim() || undefined,
        items: [],
      };
      sections.push(currentSection);
    } else if (event?.trim() && currentSection) {
      // Item in current section
      currentSection.items.push({
        event: event.trim(),
        time: time?.trim() || '',
        notes: notes?.trim() || undefined,
      });
    }
  }
  
  return sections;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const rows = await fetchSheet('announcements', 'A2:B100');
  
  return rows
    .filter(row => row[0]?.trim())
    .map(row => ({
      title: row[0]?.trim() || '',
      content: row[1]?.trim() || '',
    }));
}
