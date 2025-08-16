export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  groundingMetadata?: any[];
}

export type View = 'chat' | 'imageGenerator' | 'appInfo' | 'terms';