import prisma from "@repo/db/client";
import { AddMoney } from "../../../component/AddMoneyCard";
import { BalanceCard } from "../../../component/BalanceCard";
import { OnRampTransactions } from "../../../component/OnRampTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}


// async function getP2PTransactions() {
//     const session = await getServerSession(authOptions);
//     const txns = await prisma.p2pTransfer.findMany({
//         where: {
//             toUserId: Number(session?.user?.id)
//         }
//     });
//     return txns.map(t => ({
//         time: t.timestamp,
//         amount: t.amount,
//         status: "Succeded"
//     }))
// }

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();
    //const transactions2 = await getP2PTransactions();
    //const transactions = transactions1 || transactions2;

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}