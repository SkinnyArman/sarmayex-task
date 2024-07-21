import { EventEnum } from "~/enums/event.enum";

export type Order = {
  p: string;
  a: string;
};

export type OrderBook = {
  event: EventEnum;
  data: { asks: Order[]; bids: Order[] };
};

export type OrderBookResponse = OrderBook[];
