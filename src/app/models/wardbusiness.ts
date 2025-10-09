export enum WardBusinessType {
  CALLING = 'calling',
  RELEASE = 'release',
  SUSTAINING = 'sustaining',
  ANNOUNCEMENT = 'announcement',
  OTHER = 'other',
}

export interface WardBusinessItem {
  type: WardBusinessType;
  text: string;
}
