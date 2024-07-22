<template>
  <div>
    <NavBar></NavBar>
    <div
      class="flex justify-center dark:bg-black overflow-auto text-gray bg-light text-body1 py-4"
    >
      <div class="max-w-[300px] w-full dark:bg-dark bg-white-light p-4 rounded">
        <div class="flex justify-between">
          <TableFilter></TableFilter>
          <AsksVsBidsPercentage></AsksVsBidsPercentage>
        </div>
        <OrdersTable
          :orders="orders"
          :total-asks="totalAsks"
          :total-bids="totalBids"
          :highest-ask-amount="highestAskAmount"
          :highest-bid-amount="highestBidAmount"
        ></OrdersTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useOrderBookStore } from "./store/orderBook";

const store = useOrderBookStore();
const {
  orders,
  totalBids,
  highestAskAmount,
  highestBidAmount,
  totalAsks,
} = storeToRefs(store);
await store.fetchInitialData();
onMounted(() => store.subscribeToUpdates())
</script>