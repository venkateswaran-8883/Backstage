export interface MobileBrandData {
  [key: string]: string | number | null | undefined;
}

export interface MobileBrandItem {
  id: string;
  name: string;
  data: MobileBrandData | null;
}
