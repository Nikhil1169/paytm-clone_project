import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();

async function main() {
    const baadshah =  await prisma.user.upsert({
        where: {
            number: '1111111111'
        },
        update: {},
        create: {
            number: '1111111111',
            password: await bcrypt.hash('baadshah',10),
            name: 'Baadshah',
            Balance: {
                create: {
                    amount: 20000,
                    locked: 0
                }
            },
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Success",
                    amount: 20000,
                    token: "token_t",
                    provider: "HDFC Bank",
                },
            },
        },
    })
    const nikhil = await prisma.user.upsert({
        where: { number: '9999999998' },
        update: {},
        create: {
          number: '9999999998',
          password: 'nikil',
          name: 'nikhil',
          OnRampTransaction: {
            create: {
              startTime: new Date(),
              status: "Failure",
              amount: 2000,
              token: "123",
              provider: "HDFC Bank",
            },
          },
        },
    })
    console.log({ baadshah, nikhil })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })