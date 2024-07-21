import type { Order } from "~/types/api/orderBook.response";
export const formatNumber = (number: string | number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(+number);

export const orderTotal = (amount: string, price: string) => {
  return +amount * +price;
};

export const ordersSummation = (orders: Order[]) =>
  orders.reduce(
    (acc: number, order: Order) => acc + orderTotal(order.a, order.p),
    0
  );
