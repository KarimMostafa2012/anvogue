"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import { Minus, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import { useTranslation } from "next-i18next";
import { useModalCartContext } from "@/context/ModalCartContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
  selectedColor?: string;
  selectedSize?: string;
}

const Cart = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { cartState, updateCart, removeFromCart } = useCart();
  const { openModalCart } = useModalCartContext();
  const [totalCart, setTotalCart] = useState<number>(0);
  const [discountCart, setDiscountCart] = useState<number>(0);
  const [shipCart, setShipCart] = useState<number>(30);
  const [applyCode, setApplyCode] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(countdownTime());

  const moneyForFreeship = 150;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cartState?.cartArray) {
      const total = cartState.cartArray.reduce((acc, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return acc + (price * item.quantity);
      }, 0);
      setTotalCart(total);

      // Update shipping cost based on total
      if (total < moneyForFreeship) {
        setShipCart(30);
      } else {
        setShipCart(0);
      }

      // Reset discount if total is less than minimum
      if (total < applyCode) {
        setApplyCode(0);
        setDiscountCart(0);
      }
    }
  }, [cartState?.cartArray, applyCode]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const itemToUpdate = cartState.cartArray.find(
      (item) => item.id === productId
    );

    if (itemToUpdate) {
      updateCart(
        productId,
        newQuantity,
        itemToUpdate.selectedColor,
        itemToUpdate.selectedSize
      );
    }
  };

  const handleApplyCode = (minValue: number, discount: number) => {
    if (totalCart > minValue) {
      setApplyCode(minValue);
      setDiscountCart(discount);
    } else {
      alert(`Minimum order must be ${minValue}$`);
    }
  };

  const handleCheckout = () => {
    router.push(`/checkout?discount=${discountCart}&ship=${shipCart}`);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleContinueShopping = () => {
    router.push("/shop");
  };

  return (
    <>
      <TopNavOne props="bg-black" slogan={t('header.slogan')} />
      <MenuOne props="bg-white" />
      <Breadcrumb
        heading={t('cart.title')}
        subHeading={t('cart.title')}
      />
      <div className="container mx-auto px-4 py-8">
        {cartState.cartArray.length > 0 ? (
          <>
            <div className="mb-4 text-center">
              <p className="text-red-600">
                {t('cartPage.expireNotice')} {timeLeft.minutes}:
                {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds} {t('cartPage.minutes')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">{t('cartPage.products')}</h2>
                  </div>
                  <div className="space-y-4">
                    {cartState.cartArray.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex items-center justify-between border-b pb-4"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-600">
                              {item.selectedColor} {item.selectedSize}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${typeof item.price === 'string' ? parseFloat(item.price) : item.price}
                            </p>
                            <p className="text-gray-600">
                              {t('cart.total')}: ${(typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-6">{t('cartPage.orderSummary')}</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{t('cart.subtotal')}</span>
                      <span>${totalCart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('cart.shipping')}</span>
                      <span>{t('cartPage.freeShipping')}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>{t('cart.total')}</span>
                        <span>${totalCart}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      {t('cart.proceedToCheckout')}
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="w-full border border-black py-3 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {t('cart.continueShopping')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">{t('cart.empty')}</h2>
            <button
              onClick={handleContinueShopping}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
