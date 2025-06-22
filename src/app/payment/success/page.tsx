"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

interface order {
  created_at: string;
  updated_at: string;
  total: number;
}

export default function Component() {
  const [order, setOrder] = useState<order>();

  useEffect(() => {
    fetch(`https://api.malalshammobel.com/order/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          window.localStorage.getItem("accessToken") ||
          window.sessionStorage.getItem("accessToken")
        }`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        console.log(response);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData[0] || "some thing went wrong");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setOrder(data[data.length-1]);
      })
      .catch((error) => {
        // معالجة الأخطاء
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <CircleCheckIcon className="text-green-500 h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-4">
            Payment Successful
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Thank you for your payment. Your order is being processed.
          </p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Amount Paid:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              ${order?.total}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Date &amp; Time:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {order?.updated_at}
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            href="/my-account"
            className="button-main"
            prefetch={false}
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}

function CircleCheckIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
