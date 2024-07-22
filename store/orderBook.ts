import { defineStore } from "pinia";
import type { Order } from "~/types/order";
import { USDT_LIVE_URL, ORDER_BOOK_URL } from "../constants/variables";
import type { OrderBook } from "~/types/api/orderBook.response";
export const useOrderBookStore = defineStore("orderBook", () => {
  const orders = ref<{ bids: Order[]; asks: Order[] }>({ asks: [], bids: [] });

  const fetchInitialData = async () => {
    const { data, error } = await useFetch<OrderBook>(ORDER_BOOK_URL);
    if (!error.value && data.value) {
      orders.value.asks = data.value.data.asks.sort(
        (a, b) => b.p - a.p
      );
      orders.value.bids = data.value.data.bids;
    } else {
      console.error("Error fetching initial data:", error.value);
    }
  };
  const subscribeToUpdates = () => {
    const sse = new EventSource(USDT_LIVE_URL);
    sse.onmessage = (message) => {
      const order = JSON.parse(message.data);
      if (order.event === "markets") {
        return;
      }
      orders.value.asks = order.data.asks.sort((a, b) => b.p - a.p);
      orders.value.bids = order.data.bids;
    };
    sse.onerror = (error) => {
      console.error("SSE error:", error);
    };
  };
  return { orders, fetchInitialData, subscribeToUpdates };
});
