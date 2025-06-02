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

export interface ProductType {
  id: string;
  category: string;
  type: string;
  name: string;
  gender: string;
  sub_category: SubCategory;
  new: boolean;
  has_offer: boolean;
  rate: number;
  price: string | number;
  new_price: number;
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
