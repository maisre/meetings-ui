import { WardBusinessItem } from './wardbusiness';

export interface Meeting {
  date: Date;
  invocation: string;
  speakers: string[];
  benediction: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: string[];
}
