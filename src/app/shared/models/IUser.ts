import {Certificate} from "./ICertificate";

export interface User {
  firstName: string;
  lastName: string;
  id: number;
  email:string;
  orders: Order[];
  _links: any;
}

export interface Order {
  giftCertificates: Certificate[];
}
