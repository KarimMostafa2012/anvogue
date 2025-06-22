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
export interface Category {
  id: number;
  name: string;
}

export interface RateType {
  comments: [Comment];
  id: number;
  product: number;
  rate: number;
  rate_owner: boolean;
  first_name: string;
  last_name: string;
  profile_img: string;
}

export interface Comment {
  comment: string;
  comment_owner: boolean;
  created_at: string;
  id: number;
  parched: boolean;
  product: number;
  super_user: boolean;
  user: number;
}

export interface ProductType {
  id: string;
  category: string;
  type: string;
  average_rate: string | number;
  name: string;
  gender: string;
  sub_category: number;
  new: boolean;
  has_offer: boolean;
  rates: [RateType] | [];
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
  offer_id?: number;
}
