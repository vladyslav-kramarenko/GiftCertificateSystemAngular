import {Certificate} from "./ICertificate";

export interface Order {
  id: number;
  sum: number;
  createDate: string;
  lastUpdateDate: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string | null;
  };
  orderGiftCertificateDTOS: Certificate[];
  _links: {
    self: {
      href: string;
      method: string;
    };
  };
}
