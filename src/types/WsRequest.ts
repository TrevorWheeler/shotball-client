import type { Token } from './Token';

export interface WsRequest {
  token: string;
  id: string;
  data: any
}