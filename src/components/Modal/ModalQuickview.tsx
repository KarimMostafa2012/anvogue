"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import Rate from "../Other/Rate";
import ModalSizeguide from "./ModalSizeguide";
import { useTranslation } from "react-i18next";

const ModalQuickview = () => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [openSizeGuide, setOpenSizeGuide] = useState<boolean>(false);
  const { selectedProduct, closeQuickview } = useModalQuickviewContext();
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<number | undefined>(undefined);
  const [quantity, setQuantity] = useState(1); // Local quantity state
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const percentSale =
    selectedProduct?.new_price &&
    Math.floor(
      100 - (selectedProduct.new_price / Number(selectedProduct.price)) * 100
    );
  const { t } = useTranslation();

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setActiveColor("");
    setActiveSize(undefined);
    console.log(selectedProduct)
  }, [selectedProduct]);

  const handleOpenSizeGuide = () => {
    setOpenSizeGuide(true);
  };

  const handleCloseSizeGuide = () => {
    setOpenSizeGuide(false);
  };

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleActiveSize = (item: number | undefined) => {
    setActiveSize(item);
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      console.log(`product page: ${selectedProduct}`);
      if (!cartState.cartArray.find((item) => item.id === selectedProduct.id)) {
        addToCart(
          selectedProduct,
          activeColor ? activeColor : selectedProduct.colors[0].color,
          quantity
        );
        updateCart(selectedProduct.id, quantity, activeColor);
      } else {
        updateCart(selectedProduct.id, quantity, activeColor);
      }

      openModalCart();
      closeQuickview();
    }
  };

  const handleAddToWishlist = () => {
    if (selectedProduct) {
      if (
        wishlistState.wishlistArray.some(
          (item) => item.id === Number(selectedProduct.id)
        )
      ) {
        removeFromWishlist(Number(selectedProduct.id));
      } else {
        addToWishlist(selectedProduct);
      }
    }
    openModalWishlist();
  };

  const handleAddToCompare = () => {
    if (selectedProduct) {
      if (compareState.compareArray.length < 3) {
        if (
          compareState.compareArray.some(
            (item) => item.id === selectedProduct.id
          )
        ) {
          removeFromCompare(selectedProduct.id);
        } else {
          addToCompare(selectedProduct);
        }
      } else {
        alert("Compare up to 3 products");
      }
    }
    openModalCompare();
  };

  if (!selectedProduct) return null;

  return (
    <>
      <div className={`modal-quickview-block`} onClick={closeQuickview}>
        <div
          className={`modal-quickview-main py-6 ${
            selectedProduct !== null ? "open" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex h-full max-md:flex-col-reverse gap-y-6">
            <div className="left lg:w-[388px] md:w-[300px] flex-shrink-0 px-6">
              <div className="list-img max-md:flex items-center gap-4">
                {selectedProduct?.images.map((item, index) => (
                  <div
                    className="bg-img w-full aspect-[3/4] max-md:w-[150px] max-md:flex-shrink-0 rounded-[20px] overflow-hidden md:mt-6"
                    key={index}
                  >
                    <Image
                      src={item.img}
                      width={1500}
                      height={2000}
                      alt={item.img}
                      priority={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="right w-full px-4">
              <div className="heading pb-6 px-4 flex items-center justify-between relative">
                <div className="heading5">Quick View</div>
                <div
                  className="close-btn absolute right-0 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                  onClick={closeQuickview}
                >
                  <Icon.X size={14} />
                </div>
              </div>
              <div className="product-infor px-4">
                <div className="flex justify-between">
                  <div>
                    <div className="caption2 text-secondary font-semibold uppercase">
                      {selectedProduct?.type}
                    </div>
                    <div className="heading4 mt-1">{selectedProduct?.name}</div>
                  </div>
                  <div
                    className={`add-wishlist-btn w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-lg duration-300 flex-shrink-0 hover:bg-black hover:text-white ${
                      wishlistState.wishlistArray.some(
                        (item) => item.id === Number(selectedProduct.id)
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={handleAddToWishlist}
                  >
                    {wishlistState.wishlistArray.some(
                      (item) => item.id === Number(selectedProduct.id)
                    ) ? (
                      <>
                        <Icon.Heart
                          size={20}
                          weight="fill"
                          className="text-red"
                        />
                      </>
                    ) : (
                      <>
                        <Icon.Heart size={20} />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Rate currentRate={selectedProduct?.average_rate} size={14} />
                  <span className="caption1 text-secondary">
                    ({selectedProduct?.rates != undefined ? selectedProduct?.rates?.length : 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                  <div className="product-price heading5">
                    ${selectedProduct?.price}
                  </div>
                  <div className="w-px h-4 bg-line"></div>
                  <div className="product-origin-price font-normal text-secondary2">
                    <del>${selectedProduct?.price}</del>
                  </div>
                  {selectedProduct?.new_price && (
                    <div className="product-sale caption2 font-semibold bg-green px-3 py-0.5 inline-block rounded-full">
                      -{percentSale}%
                    </div>
                  )}
                  <div className="desc text-secondary mt-3">
                    {selectedProduct?.description}
                  </div>
                </div>
                <div className="list-action mt-6">
                  <div className="choose-color">
                    <div className="text-title">
                      Colors:{" "}
                      <span className="text-title color">{activeColor}</span>
                    </div>
                    <div className="list-color flex items-center gap-2 flex-wrap mt-3">
                      {selectedProduct?.colors?.map((item, index) => (
                        <div
                          className={`color-item w-12 h-12 rounded-xl duration-300 relative ${
                            activeColor === item.color ? "active" : ""
                          }`}
                          key={index}
                          datatype={item.color}
                          style={{
                            backgroundColor: item.color,
                          }}
                          onClick={() => {
                            handleActiveColor(item.color);
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                            {item.color}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="choose-size mt-5">
                    <div className="heading flex items-center justify-between">
                      <div className="text-title">
                        Size:{" "}
                        <span className="text-title size">{activeSize}</span>
                      </div>
                    </div>
                    <div className="list-size flex items-center gap-2 flex-wrap mt-3">
                      <div
                        className={`size-item w-12 h-12 flex items-center justify-center text-button rounded-full bg-white border border-line`}
                      >
                        {selectedProduct.size}
                      </div>
                    </div>
                  </div>
                  <div className="text-title mt-5">Quantity:</div>
                  <div className="choose-quantity flex items-center max-xl:flex-wrap lg:justify-between gap-5 mt-3">
                    <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                      {/* Example of changed quantity handlers */}
                      <Icon.Minus
                        onClick={handleDecreaseQuantity}
                        className={`${
                          quantity === 1 ? "disabled" : ""
                        } cursor-pointer body1`}
                      />
                      <div className="body1 font-semibold">{quantity}</div>
                      <Icon.Plus
                        onClick={handleIncreaseQuantity}
                        className="cursor-pointer body1"
                      />
                    </div>
                    <div
                      onClick={handleAddToCart}
                      className="button-main w-full text-center bg-white text-black border border-black"
                    >
                      Add To Cart
                    </div>
                  </div>
                  <div className="button-block mt-5">
                    <div className="button-main w-full text-center">
                      Buy It Now
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap lg:gap-20 gap-8 gap-y-4 mt-5">
                    <div
                      className="compare flex items-center gap-3 cursor-pointer"
                      onClick={handleAddToCompare}
                    >
                      <div className="compare-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                        <Icon.ArrowsCounterClockwise className="heading6" />
                      </div>
                      <span>Compare</span>
                    </div>
                    <div className="share flex items-center gap-3 cursor-pointer">
                      <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                        <Icon.ShareNetwork weight="fill" className="heading6" />
                      </div>
                      <span>Share Products</span>
                    </div>
                  </div>
                  <div className="more-infor mt-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Icon.ArrowClockwise className="body1" />
                        <div className="text-title">
                          {t("Delivery & Return")}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon.Question className="body1" />
                        <div className="text-title">{t("Ask A Question")}</div>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-1 mt-3">
                      <Icon.Timer className="body1" />
                      <span className="text-title">
                        {t("Estimated Delivery:")}
                      </span>
                      <span className="text-secondary">
                        14 January - 18 January
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-1 mt-3">
                      <Icon.Eye className="body1" />
                      <span className="text-title">38</span>
                      <span className="text-secondary">
                        {t("people viewing this product right now!")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="text-title">{t("SKU:")}</div>
                      <div className="text-secondary">53453412</div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="text-title">{t("Categories:")}</div>
                      <div className="text-secondary">
                        {selectedProduct?.category}, {selectedProduct?.gender}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="text-title">Tag:</div>
                      <div className="text-secondary">
                        {selectedProduct?.type}
                      </div>
                    </div>
                  </div>
                  <div className="list-payment mt-7">
                    <div className="main-content lg:pt-8 pt-6 lg:pb-6 pb-4 sm:px-4 px-3 border border-line rounded-xl relative max-md:w-2/3 max-sm:w-full">
                      <div className="heading6 px-5 bg-white absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap">
                        Guranteed safe checkout
                      </div>
                      <div className="list grid grid-cols-6">
                        <div className="item flex items-center justify-center lg:px-3 px-1">
                          <Image
                            src={"/images/payment/Frame-0.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center lg:px-3 px-1">
                          <Image
                            src={"/images/payment/Frame-1.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center lg:px-3 px-1">
                          <Image
                            src={"/images/payment/Frame-2.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center lg:px-3 px-1">
                          <Image
                            src={"/images/payment/Frame-3.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center lg:px-3 px-1">
                          <Image
                            src={"/images/payment/Frame-4.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center lg:px-3 px-1">
                          <Image
                            src={"/images/payment/Frame-5.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
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

export default ModalQuickview;
