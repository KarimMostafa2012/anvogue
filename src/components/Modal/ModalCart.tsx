"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from "@/data/Product.json";
import { ProductType } from "@/type/ProductType";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useCart } from "@/context/CartContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { countdownTime } from "@/store/countdownTime";
import CountdownTimeType from "@/type/CountdownType";
import { useTranslation } from 'next-i18next';

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
        // Only update if time actually changed
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
  }, [loadCart]);

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
  // Calculate total in useEffect
  const [totalCart, setTotalCart] = useState<number>(0);

  useEffect(() => {
    const newTotal = cartState.cartArray.reduce(
      (sum, item) => sum + Number(item.new_price ? item.new_price : item.price) * item.quantity,
      0
    );
    setTotalCart(newTotal);
  }, [cartState.cartArray]); // Only recalculate when cart changes

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
                console.log(product);
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
                            {t('modal.cart.removeItem')}
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
                <div
                  className="item flex items-center gap-3 cursor-pointer"
                  onClick={() => handleActiveTab("note")}
                >
                  <Icon.NotePencil className="text-xl" />
                  <div className="caption1">{t('modal.cart.note')}</div>
                </div>
                <div
                  className="item flex items-center gap-3 cursor-pointer"
                  onClick={() => handleActiveTab("shipping")}
                >
                  <Icon.Truck className="text-xl" />
                  <div className="caption1">{t('modal.cart.shipping')}</div>
                </div>
                <div
                  className="item flex items-center gap-3 cursor-pointer"
                  onClick={() => handleActiveTab("coupon")}
                >
                  <Icon.Tag className="text-xl" />
                  <div className="caption1">{t('modal.cart.coupon')}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 px-6">
                <div className="heading5">{t('modal.cart.subtotal')}</div>
                <div className="heading5">${totalCart}</div>
              </div>
              <div className="block-button text-center p-6">
                <div className="flex items-center gap-4">
                  <Link
                    href={"/cart"}
                    className="button-main basis-1/2 bg-white border border-black text-black text-center uppercase"
                    onClick={closeModalCart}
                  >
                    {t('modal.cart.viewCart')}
                  </Link>
                  <Link
                    href={"/checkout"}
                    className="button-main basis-1/2 text-center uppercase"
                    onClick={closeModalCart}
                  >
                    {t('modal.cart.checkout')}
                  </Link>
                </div>
                <div
                  onClick={closeModalCart}
                  className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                >
                  {t('modal.cart.continueShopping')}
                </div>
              </div>
              <div
                className={`tab-item note-block ${
                  activeTab === "note" ? "active" : ""
                }`}
              >
                <div className="px-6 py-4 border-b border-line">
                  <div className="item flex items-center gap-3 cursor-pointer">
                    <Icon.NotePencil className="text-xl" />
                    <div className="caption1">{t('modal.cart.note')}</div>
                  </div>
                </div>
                <div className="form pt-4 px-6">
                  <textarea
                    name="form-note"
                    id="form-note"
                    rows={4}
                    placeholder={t('modal.cart.addSpecialInstructions')}
                    className="caption1 py-3 px-4 bg-surface border-line rounded-md w-full"
                  ></textarea>
                </div>
                <div className="block-button text-center pt-4 px-6 pb-6">
                  <div
                    className="button-main w-full text-center"
                    onClick={() => setActiveTab("")}
                  >
                    {t('modal.cart.save')}
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                  >
                    {t('modal.cart.cancel')}
                  </div>
                </div>
              </div>
              <div
                className={`tab-item note-block ${
                  activeTab === "shipping" ? "active" : ""
                }`}
              >
                <div className="px-6 py-4 border-b border-line">
                  <div className="item flex items-center gap-3 cursor-pointer">
                    <Icon.Truck className="text-xl" />
                    <div className="caption1">{t('modal.cart.estimateShipping')}</div>
                  </div>
                </div>
                <div className="form pt-4 px-6">
                  <div className="">
                    <label
                      htmlFor="select-country"
                      className="caption1 text-secondary"
                    >
                      {t('modal.cart.countryRegion')}
                    </label>
                    <div className="select-block relative mt-2">
                      <select
                        id="select-country"
                        name="select-country"
                        className="w-full py-3 pl-5 rounded-xl bg-white border border-line"
                        defaultValue={"Country/region"}
                      >
                        <option value="Country/region" disabled>
                          {t('modal.cart.countryRegion')}
                        </option>
                        <option value="France">{t('modal.cart.countries.france')}</option>
                        <option value="Spain">{t('modal.cart.countries.spain')}</option>
                        <option value="UK">{t('modal.cart.countries.uk')}</option>
                        <option value="USA">{t('modal.cart.countries.usa')}</option>
                      </select>
                      <Icon.CaretDown
                        size={12}
                        className="absolute top-1/2 -translate-y-1/2 md:right-5 right-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="select-state"
                      className="caption1 text-secondary"
                    >
                      {t('modal.cart.state')}
                    </label>
                    <div className="select-block relative mt-2">
                      <select
                        id="select-state"
                        name="select-state"
                        className="w-full py-3 pl-5 rounded-xl bg-white border border-line"
                        defaultValue={"State"}
                      >
                        <option value="State" disabled>
                          {t('modal.cart.state')}
                        </option>
                        <option value="Paris">{t('modal.cart.states.paris')}</option>
                        <option value="Madrid">{t('modal.cart.states.madrid')}</option>
                        <option value="London">{t('modal.cart.states.london')}</option>
                        <option value="New York">{t('modal.cart.states.newYork')}</option>
                      </select>
                      <Icon.CaretDown
                        size={12}
                        className="absolute top-1/2 -translate-y-1/2 md:right-5 right-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="select-code"
                      className="caption1 text-secondary"
                    >
                      {t('modal.cart.postalZipCode')}
                    </label>
                    <input
                      className="border-line px-5 py-3 w-full rounded-xl mt-3"
                      id="select-code"
                      type="text"
                      placeholder={t('modal.cart.postalZipCode')}
                    />
                  </div>
                </div>
                <div className="block-button text-center pt-4 px-6 pb-6">
                  <div
                    className="button-main w-full text-center"
                    onClick={() => setActiveTab("")}
                  >
                    {t('modal.cart.calculate')}
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                  >
                    {t('modal.cart.cancel')}
                  </div>
                </div>
              </div>
              <div
                className={`tab-item note-block ${
                  activeTab === "coupon" ? "active" : ""
                }`}
              >
                <div className="px-6 py-4 border-b border-line">
                  <div className="item flex items-center gap-3 cursor-pointer">
                    <Icon.Tag className="text-xl" />
                    <div className="caption1">{t('modal.cart.addCouponCode')}</div>
                  </div>
                </div>
                <div className="form pt-4 px-6">
                  <div className="">
                    <label
                      htmlFor="select-discount"
                      className="caption1 text-secondary"
                    >
                      {t('modal.cart.enterCode')}
                    </label>
                    <input
                      className="border-line px-5 py-3 w-full rounded-xl mt-3"
                      id="select-discount"
                      type="text"
                      placeholder={t('modal.cart.discountCode')}
                    />
                  </div>
                </div>
                <div className="block-button text-center pt-4 px-6 pb-6">
                  <div
                    className="button-main w-full text-center"
                    onClick={() => setActiveTab("")}
                  >
                    {t('modal.cart.apply')}
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block"
                  >
                    {t('modal.cart.cancel')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCart;
