export interface SalesRecord {
  'Department Name': string;
  Date: string;
  'Number of Sales': number;
}

export interface AggregatedSales {
  [department: string]: number;
}

export interface UploadResponse {
  success: boolean;
  downloadUrl: string;
  message?: string;
}