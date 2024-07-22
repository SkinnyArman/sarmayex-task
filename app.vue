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
                  :style="{ width: calculateWidth(ask, filter) + '%' }"
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
              class="relative mb-1 my-auto align-middle"
              v-for="bid in ordersToShow(FilterEnum.Bids)"
              :key="bid.p + bid.a"
            >
              <td class="text-success h-6 align-middle">
                <span
                  class="absolute h-full bg-success opacity-20 z-0"
                  :style="{ width: calculateWidth(bid, filter) + '%' }"
                ></span>
                <span class="relative z-10">{{ formatNumber(bid.p) }}</span>
              </td>
              <td
                class="relative text-center dark:text-white-light text-white-dark"
              >
                {{ bid.a }}
              </td>
              <td
                class="relative text-left dark:text-white-light text-white-dark"
              >
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
import { FilterEnum } from "./enums/filter.enum";
import type { Order } from "./types/api/orderBook.response";
import {
  formatNumber,
  ordersSummation,
  orderTotal,
  getHighestOrderAmount,
} from "./helpers/utils";

import { useOrderBookStore } from "./store/orderBook";

const { orders, fetchInitialData, subscribeToUpdates } = useOrderBookStore();
await fetchInitialData();
onMounted(() => {
  subscribeToUpdates();
});

const filter = ref<FilterEnum | null>(null);
const setFilter = (fil: FilterEnum | null) => {
  filter.value = fil;
};

const ordersToShow = (orderType: FilterEnum) => {
  const sortedOrders = orders[orderType]
    .slice()
    .sort((a: Order, b: Order) => +b.p - +a.p);

  if (!filter.value) {
    return sortedOrders.slice(0, 15);
  }
  if (filter.value === orderType) {
    return sortedOrders;
  }
  return [];
};

const totalBids = computed(() => ordersSummation(orders.bids));
const totalAsks = computed(() => ordersSummation(orders.asks));
const total = computed(() => totalAsks.value + totalBids.value);

const totalAsksPercentage = computed(
  () => (totalAsks.value / total.value) * 100
);
const totalBidsPercentage = computed(() => 100 - totalAsksPercentage.value);

const highestAskAmount = computed(() => getHighestOrderAmount(orders.asks));
const highestBidAmount = computed(() => getHighestOrderAmount(orders.bids));
// the logic for this is mostly made up as i was not sure
const calculateWidth = (order, type) => {
  if (!filter.value) {
    let value =
      ((order.p * order.a) /
        (highestAskAmount.value + highestBidAmount.value)) *
      100;
    return Math.min(value, 100);
  }
  let value =
    ((order.p * order.a) /
      (type === "ask" ? highestAskAmount.value : highestBidAmount.value)) *
    100;
  return Math.min(value, 100);
};
</script>

<style scoped>
/* table {
  border-collapse: separate;
  border-spacing: 0 2px;
} */

</style>
