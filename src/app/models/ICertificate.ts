import {Tag} from "./ITag";

export interface Certificate {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  createDate: string;
  lastUpdateDate: string;
  img: string | null;
  tags: Tag[];
  _links: any;
}
