export interface Photo {
  id: number;
  caption: string;
  image_url: string;
  issue_id: number;
  created_at?: string;
  taken_at?: string | null;
}
