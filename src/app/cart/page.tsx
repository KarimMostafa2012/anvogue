"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { Minus, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import { useTranslation } from "next-i18next";
import { useModalCartContext } from "@/context/ModalCartContext";

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  new_price?: number;
  quantity: number;
  image: string;
  brand: string;
  selectedColor?: string;
  selectedSize?: string;
  cartItemId: string;
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
        const itemPrice = item.new_price || price;
        return acc + (itemPrice * item.quantity);
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
    if (newQuantity < 1) return;
    
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

  // Helper function to ensure string output
  const getTranslation = (key: string): string => {
    const translation = t(key);
    return typeof translation === 'string' ? translation : String(translation);
  };

  return (
    <>
      <TopNavOne className="bg-black" />
      <MenuOne className="bg-white" />
      <Breadcrumb
        heading={getTranslation('cart.title')}
        subHeading={getTranslation('cart.title')}
      />
      <div className="container mx-auto px-4 py-8">
        {cartState.cartArray.length > 0 ? (
          <>
            <div className="mb-4 text-center">
              <p className="text-red-600">
                {getTranslation('cartPage.expireNotice')} {timeLeft.minutes}:
                {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds} {getTranslation('cartPage.minutes')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">{getTranslation('cartPage.products')}</h2>
                  </div>
                  <div className="space-y-4">
                    {cartState.cartArray.map((item) => {
                      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                      const itemPrice = item.new_price || price;
                      const totalPrice = itemPrice * item.quantity;
                      
                      return (
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
                                disabled={item.quantity <= 1}
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
                                ${itemPrice.toFixed(2)}
                              </p>
                              <p className="text-gray-600">
                                {getTranslation('cart.total')}: ${totalPrice.toFixed(2)}
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
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-6">{getTranslation('cartPage.orderSummary')}</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{getTranslation('cart.subtotal')}</span>
                      <span>${totalCart.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{getTranslation('cart.shipping')}</span>
                      <span>{shipCart === 0 ? getTranslation('cartPage.freeShipping') : `$${shipCart.toFixed(2)}`}</span>
                    </div>
                    {discountCart > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>{getTranslation('cart.discount')}</span>
                        <span>-${discountCart.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>{getTranslation('cart.total')}</span>
                        <span>${(totalCart + shipCart - discountCart).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      {getTranslation('cart.proceedToCheckout')}
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="w-full border border-black py-3 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {getTranslation('cart.continueShopping')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">{getTranslation('cart.empty')}</h2>
            <button
              onClick={handleContinueShopping}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {getTranslation('cart.continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
