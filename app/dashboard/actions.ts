'use server';

import { OrderStatus } from '@prisma/client';
import { db } from '~/db';

interface Order {
  id: string;
  status: OrderStatus;
}

export const changeOrderStatus = async ({ id, status }: Order) => {
  await db.order.update({
    where: { id },
    data: { status },
  });
};
