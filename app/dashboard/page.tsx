import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { db } from '~/db';
import { formatPrice } from '~/lib/utils';
import { StatusDropdown } from './status-dropdown';

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  if (!user || !isAdmin) {
    return notFound();
  }

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      shippingAddress: true,
    },
  });

  const lastWeekSum = await db.order.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
  });

  const lastMonthSum = await db.order.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
  });

  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2500;

  return (
    <div className='flex min-h-screen w-full bg-muted/40'>
      <div className='max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4'>
        <div className='flex flex-col gap-16'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Last week</CardDescription>
                <CardTitle className='text-2xl'>{formatPrice(lastWeekSum._sum.amount ?? 0)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>of:</span>
                  <span className='text-green-500'>{formatPrice(WEEKLY_GOAL)} goal</span>
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={((lastWeekSum._sum.amount ?? 0) / WEEKLY_GOAL) * 100} />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Last month</CardDescription>
                <CardTitle className='text-2xl'>{formatPrice(lastMonthSum._sum.amount ?? 0)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>of:</span>
                  <span className='text-green-500'>{formatPrice(MONTHLY_GOAL)} goal</span>
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={((lastMonthSum._sum.amount ?? 0) / MONTHLY_GOAL) * 100} />
              </CardFooter>
            </Card>
          </div>
          <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className='hidden sm:table-cell'>Status</TableHead>
                <TableHead className='hidden sm:table-cell'>Purchase date</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className='bg-accent'>
                  <TableCell>
                    <div className='font-medium'>{order.shippingAddress[0].name}</div>
                    <div className='hidden text-sm text-muted-foreground md:inline'>{order.user?.email}</div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <StatusDropdown orderStatus={order.status} id={order.id} />
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>{order.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className='text-right'>{formatPrice(order.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
