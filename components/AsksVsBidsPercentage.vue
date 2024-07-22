<template>
  <div class="flex flex-col justify-center">
    <div class="flex justify-between">
      <span class="text-red">{{ Math.ceil(totalAsksPercentage) }}%</span>
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
</template>

<script lang="ts" setup>
import { useOrderBookStore } from "~/store/orderBook";

const store = useOrderBookStore();
const { totalBidsPercentage, totalAsksPercentage } = storeToRefs(store);
</script>
