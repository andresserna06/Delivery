import { Theater } from "./theater.model";

export class Seat {
    id?: number;
    location?: string;
    recliner?: boolean;
    theater: Theater
    theaterId?: number;
}
