import { Photo } from "./photo.model";

export class Issue {
  id?: number;
  description?: string;
  issue_type?: string;
  status?: string;
  motorcycle_id: number;
  photos: Photo[];
}
