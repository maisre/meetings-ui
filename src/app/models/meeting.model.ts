import { WardBusinessItem } from './wardbusiness';

export interface Meeting {
  _id?: string;
  date: Date;
  invocation: string;
  speakers: string[];
  benediction: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: string[];
}
