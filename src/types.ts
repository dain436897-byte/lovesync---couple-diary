export interface Partner {
  name: string;
  avatar: string;
}

export interface CoupleProfile {
  partner1: Partner;
  partner2: Partner;
  startDate: string; // ISO format date string
}
