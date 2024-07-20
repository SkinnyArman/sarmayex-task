<template>
  <div class="flex justify-center bg-dark h-[100vh] text-text-gray">
    <div class="mt-16 max-w-[300px] w-full">
      <table class="w-full table-fixed">
        <thead>
          <tr>
            <th class="w-[30%] text-right">قیمت</th>
            <th class="w-[30%]">مقدار</th>
            <th class="w-[40%] text-left">مجموع</th>
          </tr>
        </thead>
        <tbody class="w-full">
          <tr v-for="ask in asks" :key="ask.p + ask.a">
            <td class="text-text-red">
              {{
                new Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 0,
                }).format(ask.p)
              }}
            </td>
            <td class="text-center text-text-white">
              {{ ask.a }}
            </td>
            <td class="text-left text-text-white">
              {{
                new Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 0,
                }).format(ask.p * ask.a)
              }}
            </td>
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
  const sse = new EventSource(USDT_LIVE_URL);

  sse.onmessage = (message) => {
    const order = JSON.parse(message.data);
    if (order.event == EventEnum.Markets) {
      return;
    }
    asks.value = order.data.asks.slice(0, 15);
    bids.value = order.data.bids.slice(0, 15);
    sse.close()
  };
});
</script>

<style scoped>
/* Add any specific styles if necessary */
</style>
