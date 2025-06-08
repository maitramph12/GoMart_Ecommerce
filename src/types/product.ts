export type Product = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews: number;
  discountedPrice: number;
}
