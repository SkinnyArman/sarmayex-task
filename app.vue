<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
    {{ orderBook[0] }}
  </div>
</template>

<script lang="ts" setup>
import { ORDER_BOOK_URL, USDT_LIVE_URL } from "./constants/variables";
import { EventEnum } from "./enums/event.enum";
import type {
  OrderBookResponse,
  OrderBook,
} from "./types/api/orderBook.response";

const data = ref<OrderBookResponse>([]);
const orderBook = computed(() =>
  data.value
    ? data.value.filter((order: OrderBook) => order.event !== EventEnum.Markets)
    : []
);

onMounted(() => {
  const sse = new EventSource(USDT_LIVE_URL);

  sse.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    data.value.push(newData);
  };
});
</script>
