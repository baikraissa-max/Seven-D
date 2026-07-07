export interface Student {
  id: string;
  absentNo: number;
  name: string;
  nickname?: string;
  avatar: string;
  hobby: string;
  dream: string;
  quote: string;
}

export interface PiketDay {
  id: string; // e.g., 'senin', 'selasa'
  dayName: string; // e.g., 'Senin', 'Selasa'
  members: string[]; // names of students
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  date?: string;
}

export interface VideoItem {
  id: string;
  url: string; // YouTube embed URL or standard MP4 URL
  thumbnail: string;
  title: string;
  description?: string;
}

export interface ClassStats {
  studentsCount: number;
  homeroomTeacher: string;
  photosCount: number;
  videosCount: number;
}

export interface WebConfig {
  logoText: string;
  subtitleText: string;
  bgImageUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  piketSchedule: PiketDay[];
  announcements: Announcement[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isActive: boolean;
}

export interface ClassData {
  students: Student[];
  piket: PiketDay[];
  timeline: TimelineEvent[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  stats: ClassStats;
  config: WebConfig;
}
