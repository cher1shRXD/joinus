"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";
import { customFetch } from "@/libs/fetch/customFetch";
import { toast } from "@/components/provider/ToastProvider";
import { CheckCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useCustomRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');
        const meetingId = searchParams.get('meetingId');

        if (!paymentKey || !orderId || !amount) {
          throw new Error('결제 정보가 부족합니다.');
        }

        // 토스페이먼츠 결제 승인 (실제 환경에서는 서버에서 처리)
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from('test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R:').toString('base64'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        if (!response.ok) {
          throw new Error('결제 승인 실패');
        }

        // 성공 시 프로모션 업그레이드 요청
        if (meetingId) {
          await customFetch.post(`/meetings/regular/${meetingId}/upgrade`, {
            paymentKey,
            orderId,
            amount: parseInt(amount),
          });
        }

        setSuccess(true);
        toast.success('프로모션 업그레이드가 완료되었습니다!');
      } catch (error) {
        console.error('결제 처리 오류:', error);
        toast.error('결제 처리 중 오류가 발생했습니다.');
        router.push('/my-groups');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">결제 완료!</h1>
        <p className="text-gray-600 mb-6">프로모션 업그레이드가 성공적으로 완료되었습니다.</p>
        <button
          onClick={() => router.push('/my-groups')}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          내 모임으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;