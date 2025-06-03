import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 4;
const prisma = new PrismaClient();

async function main() {

  await prisma.transactionItem.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  const userData = [
    {
      username: 'admin',
      email: 'admin@gmail.com', 
      password: bcrypt.hashSync('admin', saltRounds),
      role: Role.ADMIN,
    },
    {
      username: 'fahmi',
      email: 'fahmi@gmail.com', 
      password: bcrypt.hashSync('fahmi', saltRounds),
      role: Role.KASIR,
    },
  ];
  await prisma.user.createMany({ data: userData }); 

  const kategoriElektronik = await prisma.category.create({
    data: {
      categories: 'Elektronik',
      description: 'Kategori Elektronik',
    },
  });

  const kategoriMakanan = await prisma.category.create({
    data: {
      categories: 'Makanan',
      description: 'Kategori Makanan',
    },
  });

  const laptop = await prisma.product.create({
    data: {
      name: 'Laptop',
      categoryId: kategoriElektronik.id,
      buy_price: 8000000,
      sell_price: 10000000,
      stock: 10,
    },
  });

  const smartphone = await prisma.product.create({
    data: {
      name: 'Smartphone',
      categoryId: kategoriElektronik.id,
      buy_price: 4000000,
      sell_price: 5000000,
      stock: 20,
    },
  });

  const transaksi1 = await prisma.transaction.create({
    data: {
      invoice: 'T001',
      date: new Date('2023-10-01T00:00:00Z'), 
      total: 20000000,
    },
  });

  const transaksi2 = await prisma.transaction.create({
    data: {
      invoice: 'T002',
      date: new Date('2023-10-02T00:00:00Z'), 
      total: 5000000,
    },
  });

  await prisma.transactionItem.createMany({
    data: [
      {
        transactionId: transaksi1.id,
        productId: laptop.id,
        quantity: 2,
        price: 10000000, 
      },
      {
        transactionId: transaksi2.id,
        productId: smartphone.id,
        quantity: 1,
        price: 5000000, 
      },
    ],
  });

  console.log('Data berhasil di-seed');
}

main()
  .then(() => {
    console.log('Seeding selesai!');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e); 
    await prisma.$disconnect();
    process.exit(1); 
  });