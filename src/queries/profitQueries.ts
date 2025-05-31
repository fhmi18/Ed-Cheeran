import { PrismaClient } from '@prisma/client';
// Menggunakan addDays dari date-fns untuk manipulasi tanggal yang lebih aman
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';

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
  type TransactionDetail = {
    product_name: string;
    quantity_sold: number;
    sell_price: number;
    buy_price: number;
    profit: number;
  };
  const transactionDetails: TransactionDetail[] = [];

  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const sellPricePerUnit = item.price; 
      const buyPricePerUnit = item.product.buy_price;

      total_income += sellPricePerUnit * item.quantity;
      total_expense += buyPricePerUnit * item.quantity;

      const profitPerUnit = sellPricePerUnit - buyPricePerUnit; 
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
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  type DailySummary = {
    date: string;
    income: number;
    expense: number;
    profit: number;
  };
  const dailySummaries: DailySummary[] = [];
  let currentDay = startOfDay(startDate); 

  let total_income_week = 0;
  let total_expense_week = 0;
  let total_profit_week = 0;

  while (currentDay <= endOfDay(endDate)) { // Lo
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

    currentDay = addDays(currentDay, 1); 
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

  type WeeklySummary = {
    week: string;
    income: number;
    expense: number;
    profit: number;
  };
  const weeklySummaries: WeeklySummary[] = [];
  let currentWeekStart = startDate;
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

    currentWeekStart = addDays(actualWeekEnd, 1); 
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