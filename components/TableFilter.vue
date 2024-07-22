<template>
  <div class="flex">
    <img
      src="../assets/images/buy-sell.svg"
      class="cursor-pointer w-5 h-5 ml-4"
      @click="setFilter(FilterEnum.All)"
    />
    <img
      src="../assets/images/buy.svg"
      class="cursor-pointer w-5 h-5 ml-4"
      @click="setFilter(FilterEnum.Bids)"
    />
    <img
      src="../assets/images/sell.svg"
      class="cursor-pointer w-5 h-5"
      @click="setFilter(FilterEnum.Asks)"
    />
  </div>
</template>

<script lang="ts" setup>
import { FilterEnum } from "~/enums/filter.enum";

const router = useRouter();

const setFilter = (filter: FilterEnum) => {
  router.push({ query: { filter } });
};
</script>
