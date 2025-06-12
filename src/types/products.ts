interface color {
  color: string;
  product: number;
  id: number;
}
export interface SubCategory {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
}

export interface ProductImage {
  id: number;
  product: number;
  img: string;
}

export interface Offer {
  id: number | null;
  product: number | null;
  offer_value: number | null;
  start_datetime: string | null;
  end_datetime: string | null;
  active: boolean;
}

export interface ProductColor {
  id: number;
  product: number;
  color: string;
}

export interface Product {
  id: string;
  category: string;
  type: string;
  average_rate: string | number;
  name: string;
  rating?: number | string;
  gender: string;
  sub_category: number;
  new: boolean;
  has_offer: boolean;
  rate: number;
  price: string | number;
  new_price?: number;
  offer_value: number;
  brand?: string;
  sold: number;
  quantity: number;
  quantityPurchase: number;
  size?: number;
  colors: color[];
  thumbImage: Array<string>;
  images: {
    img: string;
    id: number;
  }[];
  description: string;
  action: string;
  slug: string;
}
