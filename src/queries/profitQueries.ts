import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export const getDailyProfitReport = async (dateString: string) => {
  const targetDate = new Date(dateString);
  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  let total_income = 0;
  let total_expense = 0;
  const transactionDetails: any[] = [];

  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const sellPrice = item.price;
      const buyPricePerUnit = item.product.buy_price;
      const profitPerUnit = item.product.sell_price - item.product.buy_price;

      total_income += sellPrice;
      total_expense += buyPricePerUnit * item.quantity;

      transactionDetails.push({
        product_name: item.product.name,
        quantity_sold: item.quantity,
        sell_price: item.product.sell_price,
        buy_price: item.product.buy_price,
        profit: profitPerUnit * item.quantity,
      });
    });
  });

  const total_profit = total_income - total_expense;

  return {
    date: dateString,
    total_income,
    total_expense,
    total_profit,
    transactions: transactionDetails,
  };
};

export const getWeeklyProfitReport = async (startDateString: string, endDateString: string) => {
  // Using native Date constructor
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const dailySummaries: any[] = [];
  let currentDay = new Date(startDate); 

  let total_income_week = 0;
  let total_expense_week = 0;
  let total_profit_week = 0;

  while (currentDay <= endDate) {
    const dayReport = await getDailyProfitReport(currentDay.toISOString().split('T')[0]);
    dailySummaries.push({
      date: dayReport.date,
      income: dayReport.total_income,
      expense: dayReport.total_expense,
      profit: dayReport.total_profit,
    });
    total_income_week += dayReport.total_income;
    total_expense_week += dayReport.total_expense;
    total_profit_week += dayReport.total_profit;

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return {
    start_date: startDateString,
    end_date: endDateString,
    total_income: total_income_week,
    total_expense: total_expense_week,
    total_profit: total_profit_week,
    daily_summary: dailySummaries,
  };
};

export const getMonthlyProfitReport = async (monthString: string) => {
  const [year, month] = monthString.split('-').map(Number);
  const startDate = startOfMonth(new Date(year, month - 1, 1));
  const endDate = endOfMonth(new Date(year, month - 1, 1));

  const weeklySummaries: any[] = [];
  let currentWeekStart = new Date(startDate); 
  let total_income_month = 0;
  let total_expense_month = 0;
  let total_profit_month = 0;
  let weekCounter = 1;

  while (currentWeekStart <= endDate) {
    const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const actualWeekEnd = currentWeekEnd > endDate ? endDate : currentWeekEnd;

    const weeklyReport = await getWeeklyProfitReport(
      currentWeekStart.toISOString().split('T')[0],
      actualWeekEnd.toISOString().split('T')[0]
    );

    weeklySummaries.push({
      week: `Week ${weekCounter}`,
      income: weeklyReport.total_income,
      expense: weeklyReport.total_expense,
      profit: weeklyReport.total_profit,
    });

    total_income_month += weeklyReport.total_income;
    total_expense_month += weeklyReport.total_expense;
    total_profit_month += weeklyReport.total_profit;

    currentWeekStart = new Date(actualWeekEnd);
    currentWeekStart.setDate(currentWeekStart.getDate() + 1);
    weekCounter++;
  }

  return {
    month: monthString,
    total_income: total_income_month,
    total_expense: total_expense_month,
    total_profit: total_profit_month,
    weekly_summary: weeklySummaries,
  };
};