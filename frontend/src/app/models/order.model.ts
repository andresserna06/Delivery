import { Address } from "cluster";
import { Customer } from "./customer.model";
import { Menu } from "./menu.model";

export class Order {
  id?: number;
  customer_id?: number;
  menu_id?: number;
  motorcycle_id?: number;
  quantity?: number;
  status?: string;
  total_price?: number;
  created_at?: string;
  customer?: Customer;
  menu?: Menu;
  address?: Address;
}