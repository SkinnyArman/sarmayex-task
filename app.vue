<template>
  <div>
    <NavBar></NavBar>
    <div
      class="flex justify-center dark:bg-black overflow-auto text-gray bg-light text-body1 py-4"
    >
      <div class="max-w-[300px] w-full dark:bg-dark bg-white-light p-4 rounded">
        <div class="flex justify-between">
          <div class="flex">
            <img
              src="./assets/images/buy-sell.svg"
              class="cursor-pointer w-5 h-5 ml-4"
              @click="setFilter(null)"
            />
            <img
              src="./assets/images/buy.svg"
              class="cursor-pointer w-5 h-5 ml-4"
              @click="setFilter(FilterEnum.Bids)"
            />
            <img
              src="./assets/images/sell.svg"
              class="cursor-pointer w-5 h-5"
              @click="setFilter(FilterEnum.Asks)"
            />
          </div>
          <div class="flex flex-col justify-center">
            <div class="flex justify-between">
              <span class="text-red"
                >{{ Math.ceil(totalAsksPercentage) }}%</span
              >
              <span class="text-success"
                >{{ Math.floor(totalBidsPercentage) }}%</span
              >
            </div>
            <div class="flex w-[100px]">
              <div
                class="h-1 bg-red ml-1"
                :style="{ width: totalAsksPercentage + '%' }"
              ></div>
              <div
                class="h-1 bg-success"
                :style="{ width: totalBidsPercentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <table class="w-full table-fixed">
          <thead>
            <tr class="py-2">
              <th class="w-[30%] text-right py-2">قیمت</th>
              <th class="w-[30%] py-2">مقدار</th>
              <th class="w-[40%] text-left py-2">مجموع</th>
            </tr>
          </thead>
          <tbody class="relative w-full">
            <tr
              class="relative mb-1 my-auto align-middle"
              v-for="ask in ordersToShow(FilterEnum.Asks)"
              :key="ask.p + ask.a"
            >
              <td class="text-red h-6 align-middle">
                <span
                  class="absolute h-full bg-red opacity-20 z-0"
                  :style="{
                    width: `${((ask.p * ask.a) / highestAskAmount) * 100}%`,
                  }"
                ></span>
                <span class="relative z-10">{{ formatNumber(ask.p) }}</span>
              </td>
              <td
                class="relative text-center dark:text-white-light text-white-dark"
              >
                {{ ask.a }}
              </td>
              <td
                class="relative text-left dark:text-white-light text-white-dark"
              >
                {{ formatNumber(orderTotal(ask.a, ask.p)) }}
              </td>
            </tr>
            <tr
              class="mb-1"
              v-for="bid in ordersToShow(FilterEnum.Bids)"
              :key="bid.p + bid.a"
            >
              <td class="text-success py-[2px]">
                {{ formatNumber(bid.p) }}
              </td>
              <td class="text-center dark:text-white-light text-white-dark">
                {{ bid.a }}
              </td>
              <td class="text-left dark:text-white-light text-white-dark">
                {{ formatNumber(orderTotal(bid.a, bid.p)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ORDER_BOOK_URL, USDT_LIVE_URL } from "./constants/variables";
import { EventEnum } from "./enums/event.enum";
import { FilterEnum } from "./enums/filter.enum";
import type { OrderBookResponse, Order } from "./types/api/orderBook.response";
import { formatNumber, ordersSummation, orderTotal } from "./helpers/utils";

const orders = ref<{ bids: Order[]; asks: Order[] }>({ asks: [], bids: [] });

const filter = ref<FilterEnum | null>(null);
const setFilter = (fil: FilterEnum | null) => {
  filter.value = fil;
};

const ordersToShow = (orderType: FilterEnum) => {
  // if no filters applied, show 15 of each
  if (!filter.value) {
    return orders.value[orderType].slice(0, 15);
  }
  // if filter applied, show all the items of that filter
  if (filter.value === orderType) {
    return orders.value[orderType];
  }
  return [];
};

const totalBids = computed(() => ordersSummation(orders.value.bids));
const totalAsks = computed(() => ordersSummation(orders.value.asks));
const total = computed(() => totalAsks.value + totalBids.value);

const totalAsksPercentage = computed(
  () => (totalAsks.value / total.value) * 100
);
const totalBidsPercentage = computed(() => 100 - totalAsksPercentage.value);

const highestAskAmount = computed(() => {
  let highestOrder = orders.value.asks.sort((a, b) => b.a * b.p - a.a * a.p)[0];
  return highestOrder.p * highestOrder.a;
});
onMounted(() => {
  const sse = new EventSource(USDT_LIVE_URL);

  sse.onmessage = (message) => {
    const order = JSON.parse(message.data);
    if (order.event == EventEnum.Markets) {
      return;
    }
    orders.value = order.data;
    sse.close()
  };
});
</script>

<style scoped>
/* table {
  border-collapse: separate;
  border-spacing: 0 2px;
} */
/* td {
  vertical-align: middle;
} */
</style>
