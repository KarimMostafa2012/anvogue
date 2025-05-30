export interface Variation {
    // Define this if you have Variation details
    // For example:
    id: number;
    name: string;
    values: string[];
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

export interface ProductColor {
    id: number;
    product: number;
    color: string;
}

export interface Product {
    id: number | string;

    // From ProductType
    category: string;
    gender: string;
    new: boolean;
    sale: boolean;
    rate: number;
    originPrice: number;
    brand?: string;
    sold: number;
    quantity: number;
    quantityPurchase: number;
    sizes?: string[];
    variation: Variation[];
    thumbImage: string[];
    images: string[]; // From ProductType (string array)

    // From Product (API data)
    sub_category: SubCategory;
    price: string;
    imagesDetails: ProductImage[]; // renamed from `images` to avoid conflict
    colors: ProductColor[];
    size: number;
    name: string;
    material: string;
    type: string;
    description: string;
    has_offer: boolean;
    offer_value: number;
    new_price: number;
    average_rate: number;

    action?: string;
    slug?: string;

    // add originalPrice method if needed
    originalPrice?: (originalPrice: any) => unknown;
}
