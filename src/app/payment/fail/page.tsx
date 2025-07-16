"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { toast } from "@/components/provider/ToastProvider";
import { XCircle } from "lucide-react";

const PaymentFailPage = () => {
  const searchParams = useSearchParams();
  const router = useCustomRouter();

  useEffect(() => {
    const message = searchParams.get('message') || '결제가 취소되었습니다.';
    toast.error(message);
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">결제 실패</h1>
        <p className="text-gray-600 mb-6">
          {searchParams.get('message') || '결제가 취소되었거나 오류가 발생했습니다.'}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => router.push('/my-groups')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            내 모임으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;