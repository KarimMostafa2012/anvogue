"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from "@/type/ProductType";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useCart } from "@/context/CartContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { countdownTime } from "@/store/countdownTime";
import CountdownTimeType from "@/type/CountdownType";
import { useTranslation } from 'react-i18next';

const useAppDispatch = () => useDispatch<AppDispatch>();

const ModalCart = ({
  serverTimeLeft,
}: {
  serverTimeLeft: CountdownTimeType;
}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(serverTimeLeft);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = countdownTime();
        return prev.minutes !== newTime.minutes ||
          prev.seconds !== newTime.seconds
          ? newTime
          : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<string | undefined>("");
  const { isModalOpen, closeModalCart } = useModalCartContext();
  const { cartState, addToCart, removeFromCart, updateCart, loadCart } =
    useCart();

  useEffect(() => {
    loadCart();
  }, []);

  const handleAddToCart = (productItem: ProductType) => {
    if (!cartState.cartArray.find((item) => item.id === productItem.id)) {
      addToCart({ ...productItem }, productItem.colors[0].color);
      updateCart(productItem.id, productItem.quantityPurchase, "", undefined);
    } else {
      updateCart(productItem.id, productItem.quantityPurchase, "", undefined);
    }
  };

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  let moneyForFreeship = 150;
 
  const [totalCart, setTotalCart] = useState<number>(0);

  useEffect(() => {
    const newTotal = cartState.cartArray.reduce((sum, item) => {
      const price = item.new_price || item.price;
      const quantity = item.quantity || 0;
      return sum + (Number(price) || 0) * quantity;
    }, 0);
    setTotalCart(newTotal);
  }, [cartState.cartArray]); 

  let [discountCart, setDiscountCart] = useState<number>(0);

  return (
    <>
      <div className={`modal-cart-block`} onClick={closeModalCart}>
        <div
          className={`modal-cart-main flex ${isModalOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="left w-1/2 border-r border-line py-6 max-md:hidden">
            <div className="heading5 px-6 pb-3">{t('modal.cart.youMayAlsoLike')}</div>
            <div className="list px-6">
              {cartState.cartArray.map((product, i) => (
                <div
                  key={i}
                  className="item py-5 flex items-center justify-between gap-3 border-b border-line"
                >
                  <div className="infor flex items-center gap-5">
                    <div className="bg-img">
                      <Image
                        src={
                          product?.images == undefined
                            ? ""
                            : product?.images[0].img
                        }
                        width={300}
                        height={300}
                        alt={product.name}
                        className="w-[100px] aspect-square flex-shrink-0 rounded-lg"
                      />
                    </div>
                    <div className="">
                      <div className="name text-button">{product.name}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="product-price text-title">
                          ${product.new_price ? product.new_price : product.price}
                        </div>
                        {product.new_price && (
                          <div className="product-origin-price text-title text-secondary2">
                            <del>${product.price}</del>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-xl bg-white w-10 h-10 rounded-xl border border-black flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <Icon.Handbag />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="right cart-block md:w-1/2 w-full py-6 relative overflow-hidden">
            <div className="heading px-6 pb-3 flex items-center justify-between relative">
              <div className="heading5">{t('modal.cart.title')}</div>
              <div
                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                onClick={closeModalCart}
              >
                <Icon.X size={14} />
              </div>
            </div>
            <div className="list-product px-6">
              {cartState.cartArray.map((product, i) => {
                return (
                  <div
                    key={i}
                    className="item py-5 flex items-center justify-between gap-3 border-b border-line"
                  >
                    <div className="infor flex items-center gap-3 w-full">
                      <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={
                            product?.images == undefined
                              ? ""
                              : product?.images[0].img
                          }
                          width={300}
                          height={300}
                          alt={product.name}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between w-full">
                          <div className="name text-button">{product.name}</div>
                          <div
                            className="remove-cart-btn caption1 font-semibold text-red underline cursor-pointer"
                            onClick={() => removeFromCart(product.cartItemId)}
                          >
                            {t('modal.cart.remove')}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3 w-full">
                          <div className="flex items-center text-secondary2 capitalize">
                            {product.selectedColor ||
                              (product.colors == undefined
                                ? ""
                                : product.colors[0].color)}
                          </div>
                          <div className="product-price text-title">
                            ${product.new_price ? product.new_price : product.price}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-3 w-full">
                          <div className="flex items-center text-secondary2 capitalize">
                            {product.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
              <div className="flex items-center justify-center lg:gap-14 gap-8 px-6 py-4 border-b border-line">
                <div className="flex items-center ">
                  {/* <div className="text-secondary2">{t('modal.cart.subtotal')}:</div> */}
                  {/* <div className="text-title">${totalCart}</div> */}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-secondary2">{t('modal.cart.total')}:</div>
                  <div className="text-title">
                    ${totalCart >= moneyForFreeship ? totalCart : totalCart + 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 px-6 py-4">
                <Link
                  href="/shop"
                  className="button-main bg-black text-white"
                  onClick={closeModalCart}
                >
                  {t('modal.cart.continueShopping')}
                </Link>
                <Link
                  href="/cart"
                  className="button-main bg-green text-white"
                  onClick={closeModalCart}
                >
                  {t('modal.cart.checkout')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCart;
