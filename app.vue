<template>
  <div
    class="flex justify-center bg-dark overflow-auto text-text-gray text-body1 py-16"
  >
    <div class="max-w-[300px] w-full">
      <div class="flex justify-between">
        <div class="flex">
          <img
            src="./assets/images/buy-sell.svg"
            class="cursor-pointer w-5 h-5 ml-4"
          />
          <img
            src="./assets/images/buy.svg"
            class="cursor-pointer w-5 h-5 ml-4"
          />
          <img src="./assets/images/sell.svg" class="cursor-pointer w-5 h-5" />
        </div>
        <div class="flex flex-col justify-center">
          <div class="flex justify-between">
            <span class="text-text-red"
              >{{ Math.ceil(totalBidsPercentage) }}%</span
            >
            <span class="text-text-success"
              >{{ Math.floor(totalAsksPercentage) }}%</span
            >
          </div>
          <div class="flex w-[100px]">
            <div
              class="h-1 bg-text-red ml-1"
              :style="{ width: totalBidsPercentage + '%' }"
            ></div>
            <div
              class="h-1 bg-text-success"
              :style="{ width: totalAsksPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
      <table class="w-full table-fixed">
        <thead>
          <tr>
            <th class="w-[30%] text-right py-2">قیمت</th>
            <th class="w-[30%] py-2">مقدار</th>
            <th class="w-[40%] text-left py-2">مجموع</th>
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
          <tr v-for="bid in bids" :key="bid.p + bid.a">
            <td class="text-text-success">
              {{
                new Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 0,
                }).format(bid.p)
              }}
            </td>
            <td class="text-center text-text-white">
              {{ bid.a }}
            </td>
            <td class="text-left text-text-white">
              {{
                new Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 0,
                }).format(bid.p * bid.a)
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

const totalAsks = computed(() =>
  asks.value.reduce((acc, ask) => acc + ask.p * ask.a, 0)
);
const totalBids = computed(() =>
  bids.value.reduce((acc, bid) => acc + bid.p * bid.a, 0)
);
const total = computed(() => totalAsks.value + totalBids.value);

const totalAsksPercentage = computed(
  () => (totalAsks.value / total.value) * 100
);
const totalBidsPercentage = computed(() => 100 - totalAsksPercentage.value);

onMounted(() => {
  const sse = new EventSource(USDT_LIVE_URL);

  sse.onmessage = (message) => {
    const order = JSON.parse(message.data);
    if (order.event == EventEnum.Markets) {
      return;
    }
    order.data.asks.sort((a, b) => b.p - a.p);
    order.data.bids.sort((a, b) => b.p - a.p)
    asks.value = order.data.asks.slice(0, 15);
    bids.value = order.data.bids.slice(0, 15);
  };
});
</script>

<style scoped>
/* Add any specific styles if necessary */
</style>
