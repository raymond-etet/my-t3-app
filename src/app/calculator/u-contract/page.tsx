import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { UContractCalculator } from "~/components/calculator/u-contract-calculator";

export default async function UContractCalculatorPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/calculator/u-contract");
  }

  return (
    <main className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-base-content">
            U本位合约计算器
          </h1>
          <p className="mt-2 text-base-content/70">精确计算您的合约交易参数</p>
        </div>
        <UContractCalculator />
      </div>
    </main>
  );
}
