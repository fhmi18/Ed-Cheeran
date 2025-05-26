import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 4;
const prisma = new PrismaClient();

async function main() {
  // Hapus data lama (urutan penting karena relasi antar tabel)
  await prisma.transactionItem.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Buat data user
  const userData = [
    {
      username: 'admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('admin', saltRounds),
    },
    {
      username: 'fahmi',
      email: 'fahmi@gmail.com',
      password: bcrypt.hashSync('fahmi', saltRounds),
    },
  ];
  const users = await prisma.user.createMany({ data: userData });

  // Buat data kategori
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

  // Buat data produk (menggunakan ID kategori yang dihasilkan)
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

  // Buat data transaksi
  const transaksi1 = await prisma.transaction.create({
    data: {
      invoice: 'T001',
      date: new Date('2023-10-01'),
      total: 20000000,
    },
  });

  const transaksi2 = await prisma.transaction.create({
    data: {
      invoice: 'T002',
      date: new Date('2023-10-02'),
      total: 5000000,
    },
  });

  // Buat data item transaksi (menggunakan ID transaksi dan produk hasil create)
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
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
