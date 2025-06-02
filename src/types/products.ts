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
  // From Product (API data)
  sub_category: SubCategory;
  imagesDetails: ProductImage[]; // renamed from `images` to avoid conflict
  size: number;
  average_rate: number;
  id: string;
  category: string;
  type: string;
  name: string;
  gender: string;
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
  colors: color[];
  thumbImage: Array<string>;
  images: {
    img: string;
    id: number;
  }[];
  description: string;
  action: string;
  slug: string;

  // add originalPrice method if needed
  originalPrice?: (originalPrice: any) => unknown;
}
