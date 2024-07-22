import type { Order } from "~/types/api/orderBook.response";
export const formatNumber = (
  number: string | number,
  maximumFractionDigits = 0
) =>
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

export const getHighestOrderAmount = (orders: Order[]) => {
  const ordersArray = orders.sort(
    (a: Order, b: Order) => orderTotal(b.a, b.p) - orderTotal(a.a, a.p)
  );
  const highestOrder = ordersArray[0];
  return orderTotal(highestOrder.a, highestOrder.p);
};
