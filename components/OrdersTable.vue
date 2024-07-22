<template>
  <table class="w-full table-fixed border-separate border-spacing-[1.5px]">
    <thead>
      <tr class="py-2">
        <th class="w-[30%] text-right py-2">قیمت</th>
        <th class="w-[30%] py-2">مقدار</th>
        <th class="w-[40%] text-left py-2">مجموع</th>
      </tr>
    </thead>
    <tbody class="relative w-full">
      <tr
        class="relative mb-1"
        v-for="ask in ordersToShow(FilterEnum.Asks)"
        :key="ask.p + ask.a"
      >
        <td class="text-red h-6">
          <span
            class="absolute h-full bg-red opacity-20 z-0"
            :style="{ width: calculateWidth(ask, FilterEnum.Asks) + '%' }"
          ></span>
          <span class="relative top-1 z-10">{{ formatNumber(ask.p) }}</span>
        </td>
        <td
          class="relative top-1 text-center dark:text-white-light text-white-dark"
        >
          {{ ask.a }}
        </td>
        <td
          class="relative top-1 text-left dark:text-white-light text-white-dark"
        >
          {{ formatNumber(orderTotal(ask.a, ask.p)) }}
        </td>
      </tr>
      <tr
        class="relative mb-1 my-auto align-middle"
        v-for="bid in ordersToShow(FilterEnum.Bids)"
        :key="bid.p + bid.a"
      >
        <td class="text-success h-6">
          <span
            class="absolute h-full bg-success opacity-20 z-0"
            :style="{ width: calculateWidth(bid, FilterEnum.Bids) + '%' }"
          ></span>
          <span class="relative top-1 z-10">{{ formatNumber(bid.p) }}</span>
        </td>
        <td
          class="relative top-1 text-center dark:text-white-light text-white-dark"
        >
          {{ bid.a }}
        </td>
        <td
          class="relative top-1 text-left dark:text-white-light text-white-dark"
        >
          {{ formatNumber(orderTotal(bid.a, bid.p)) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { FilterEnum } from "~/enums/filter.enum";
import { formatNumber, orderTotal } from "../helpers/utils";
import type { Order } from "~/types/api/orderBook.response";
const props = defineProps<{
  orders: { asks: Order[]; bids: Order[] };
  highestAskAmount: number;
  highestBidAmount: number;
  totalAsks: number;
  totalBids: number;
}>();

const route = useRoute();
const filter = ref<FilterEnum | undefined>(route.query.filter as FilterEnum);
watch(route, (newRoute) => {
  filter.value = newRoute.query.filter;
});

const ordersToShow = (orderType: FilterEnum.Asks | FilterEnum.Bids) => {
  const sortedOrders = props.orders[orderType].sort(
    (a: Order, b: Order) => +b.p - +a.p
  );

  if (!filter.value || filter.value === FilterEnum.All) {
    return sortedOrders.slice(0, 15);
  }
  if (filter.value === orderType) {
    return sortedOrders;
  }
  return [];
};

// the logic for this is mostly made up as i was not sure
const calculateWidth = (order: Order, type: FilterEnum) => {
  if (!filter.value) {
    let value =
      (orderTotal(order.a, order.p) /
        (props.highestAskAmount + props.highestBidAmount)) *
      100;
    return Math.min(value, 100);
  }
  let value =
    (orderTotal(order.a, order.p) /
      (type === FilterEnum.Asks
        ? props.highestAskAmount
        : props.highestBidAmount)) *
    100;
  return Math.min(value, 100);
};
</script>
