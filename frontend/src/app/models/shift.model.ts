import { Driver } from './driver.model';
import { Motorcycle } from './motorcycle.model';

export interface Shift {
    id?: number;
    driver_id: number;
    motorcycle_id: number;
    start_time: string;
    end_time?: string | null;
    status: string;
    created_at?: string;

    driver?: Driver;
    motorcycle?: Motorcycle;
}
