import { defineStore } from "pinia";
import type { Order } from "~/types/api/orderBook.response";
import { USDT_LIVE_URL, ORDER_BOOK_URL } from "../constants/variables";
import type { OrderBook } from "~/types/api/orderBook.response";
import { ordersSummation, getHighestOrderAmount } from "~/helpers/utils";

export const useOrderBookStore = defineStore("orderBook", () => {
  const orders = ref<{ bids: Order[]; asks: Order[] }>({ asks: [], bids: [] });

  const fetchInitialData = async () => {
    const { data, error } = await useFetch<OrderBook>(ORDER_BOOK_URL);
    if (!error.value && data.value) {
      orders.value.asks = [...data.value.data.asks];
      orders.value.bids = [...data.value.data.bids];
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
      orders.value.asks = [...order.data.asks];
      orders.value.bids = [...order.data.bids];
    };
    sse.onerror = (error) => {
      console.error("SSE error:", error);
    };
  };

  const totalBids = computed(() => ordersSummation(orders.value.bids));
  const totalAsks = computed(() => ordersSummation(orders.value.asks));
  const total = computed(() => totalAsks.value + totalBids.value);
  const totalAsksPercentage = computed(
    () => (totalAsks.value / total.value) * 100
  );
  const totalBidsPercentage = computed(() => 100 - totalAsksPercentage.value);
  const highestAskAmount = computed(() =>
    getHighestOrderAmount(orders.value.asks)
  );
  const highestBidAmount = computed(() =>
    getHighestOrderAmount(orders.value.bids)
  );
  return {
    orders,
    totalAsksPercentage,
    totalBidsPercentage,
    fetchInitialData,
    totalBids,
    totalAsks,
    highestAskAmount,
    highestBidAmount,
    subscribeToUpdates,
  };
});
