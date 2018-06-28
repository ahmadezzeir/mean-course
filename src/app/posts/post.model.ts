export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  invoices?: any[];
  createdBy?: string;
}
