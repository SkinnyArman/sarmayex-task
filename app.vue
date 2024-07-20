<template>
  <div class="flex justify-center bg-dark h-[100vh] text-text-gray">
    <div class="mt-16 max-w-[600px]">
      <table>
        <thead>
          <th colspan="3">قیمت</th>
          <th colspan="3">مقدار</th>
          <th colspan="3">مجموع</th>
        </thead>
        <tbody>
          <tr v-for="ask in asks" :key="ask.p + ask.a">
            <td colspan="3">{{ ask.p }}</td>
            <td colspan="3" class="text-center">{{ ask.a }}</td>
            <td colspan="3">{{ ask.p * ask.a }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ORDER_BOOK_URL, USDT_LIVE_URL } from "./constants/variables";
import { EventEnum } from "./enums/event.enum";
import type {
  OrderBookResponse,
  OrderBook,
} from "./types/api/orderBook.response";

const asks = ref<OrderBookResponse>([]);
const bids = ref<OrderBookResponse>([]);

onMounted(() => {
  let count = 0;
  const sse = new EventSource(USDT_LIVE_URL);

  sse.onmessage = (message) => {
    if (count == 5) return;
    const order = JSON.parse(message.data);
    if (order.event == EventEnum.Markets) {
      return;
    }
    asks.value = order.data.asks;
    bids.value = order.data.bids;
    count++;
  };
});
</script>
