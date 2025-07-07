"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Marquee from "react-fast-marquee";
import Rate from "../Other/Rate";
import { useTranslation } from "react-i18next";

interface ProductProps {
  data: ProductType;
  type: string;
}
interface img {
  img: string;
  color: string;
  id: number;
}

const Product: React.FC<ProductProps> = ({ data, type = "grid" }) => {
  const { t } = useTranslation();
  let style = "style-2";
  const [activeColor, setActiveColor] = useState<string>(data.colors[0].color);
  const [openQuickShop, setOpenQuickShop] = useState<boolean>(false);
  const [quantityPurchase, setQuantityPurchase] = useState<number>(1);
  const [desiredImages, setDesiredImages] = useState<img[]>([]);
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const { openQuickview } = useModalQuickviewContext();
  const router = useRouter();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const [direction, setDirection] = useState<"left" | "right">("left");

  useEffect(() => {
    console.log(currentLanguage);
    currentLanguage == "ar" || currentLanguage == "ckb"
      ? setDirection("right")
      : setDirection("left");
  }, [currentLanguage]);

  
  useEffect(() => {
    if (!data?.images?.length) return;

    const filteredImages = data.images.filter(
      (image) => image.color === activeColor
    );
    setDesiredImages(filteredImages);
  }, [activeColor, data.images]);

  const handleActiveColor = (item: string) => {
    console.log(desiredImages);
    setActiveColor(item);
    console.log(item);
  };

  const handleAddToCart = () => {
    console.log(`product page: ${data}`);
    if (!cartState.cartArray.find((item) => item.id === data.id)) {
      addToCart(
        { ...data },
        activeColor ? activeColor : data.colors[0].color,
        1
      );
      updateCart(data.id, quantityPurchase, activeColor);
    } else {
      updateCart(data.id, data.quantityPurchase, activeColor);
    }
    openModalCart();
  };

  const handleAddToWishlist = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (
      wishlistState.wishlistArray.some((item) => item.id === Number(data.id))
    ) {
      removeFromWishlist(Number(data.id));
    } else {
      // else, add to wishlist and set state to true
      addToWishlist(data);
    }
    openModalWishlist();
  };

  const handleAddToCompare = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (compareState.compareArray.length < 3) {
      if (compareState.compareArray.some((item) => item.id === data.id)) {
        removeFromCompare(data.id);
      } else {
        // else, add to wishlist and set state to true
        addToCompare(data);
      }
    } else {
      alert("Compare up to 3 products");
    }

    openModalCompare();
  };

  const handleQuickviewOpen = () => {
    openQuickview(data);
  };

  const handleDetailProduct = (productId: string) => {
    // redirect to shop with category selected
    router.push(`/product/variable?id=${productId}`);
  };

  let percentSale = Math.floor(
    100 -
      (data.new_price
        ? data.new_price
        : Number(data.price) / Number(data.price)) *
        100
  );

  return (
    <>
      {type === "grid" ? (
        <div className={`product-item group grid-type ${style}`}>
          <div
            onClick={() => handleDetailProduct(data.id)}
            className="product-main cursor-pointer block"
          >
            <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
              {data.new && (
                <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                  {t("New")}
                </div>
              )}
              {data.has_offer && (
                <div className="product-tag text-button-uppercase text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                  {t("Sale")}
                </div>
              )}
              {style === "style-1" ||
              style === "style-3" ||
              style === "style-4" ? (
                <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                  {style === "style-4" && (
                    <div
                      className={`add-cart-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative mb-2 ${
                        compareState.compareArray.some(
                          (item) => item.id === data.id
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                    >
                      <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                        {t("Add To Cart")}
                      </div>
                      <Icon.ShoppingBagOpen size={20} />
                    </div>
                  )}
                  <div
                    className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${
                      wishlistState.wishlistArray.some(
                        (item) => item.id === Number(data.id)
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist();
                    }}
                  >
                    <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                      {t("Add To Wishlist")}
                    </div>
                    {wishlistState.wishlistArray.some(
                      (item) => item.id === Number(data.id)
                    ) ? (
                      <>
                        <Icon.Heart
                          size={18}
                          weight="fill"
                          className="text-white"
                        />
                      </>
                    ) : (
                      <>
                        <Icon.Heart size={18} />
                      </>
                    )}
                  </div>
                  <div
                    className={`compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative mt-2 ${
                      compareState.compareArray.some(
                        (item) => item.id === data.id
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCompare();
                    }}
                  >
                    <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                      {t("Compare Product")}
                    </div>
                    <Icon.Repeat size={18} className="compare-icon" />
                    <Icon.CheckCircle size={20} className="checked-icon" />
                  </div>
                  {style === "style-3" || style === "style-4" ? (
                    <div
                      className={`quick-view-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative mt-2 ${
                        compareState.compareArray.some(
                          (item) => item.id === data.id
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickviewOpen();
                      }}
                    >
                      <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                        {t("Quick View")}
                      </div>
                      <Icon.Eye size={18} />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="product-img w-full h-full aspect-[3/4]">
                {desiredImages.length > 0 && (<Image
                  src={desiredImages[0]?.img || "/"}
                  width={500}
                  height={500}
                  priority={true}
                  alt={data.name}
                  className="w-full h-full object-cover duration-700"
                />)}
                {(desiredImages[1] != undefined ||
                  desiredImages[1] != null) && (
                  <Image
                    src={desiredImages[1].img}
                    width={500}
                    height={500}
                    priority={true}
                    alt={data.name}
                    className="w-full h-full object-cover duration-700"
                  />
                )}
              </div>
              {data.has_offer && (
                <>
                  <Marquee
                    direction={direction}
                    className="banner-sale-auto bg-black absolute bottom-0 left-0 w-full py-1.5"
                  >
                    <div
                      className={`caption2 font-semibold uppercase text-white px-2.5`}
                    >
                      {t("hotSale")} {percentSale}% {t("OFF")}
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 font-semibold uppercase text-white px-2.5`}
                    >
                      {t("hotSale")} {percentSale}% {t("OFF")}
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 font-semibold uppercase text-white px-2.5`}
                    >
                      {t("hotSale")} {percentSale}% {t("OFF")}
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 font-semibold uppercase text-white px-2.5`}
                    >
                      {t("hotSale")} {percentSale}% {t("OFF")}
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 font-semibold uppercase text-white px-2.5`}
                    >
                      {t("hotSale")} {percentSale}% {t("OFF")}
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                  </Marquee>
                </>
              )}
              {style === "style-2" || style === "style-4" ? (
                // data.colors.length > 0 && (
                <div className="list-size-block flex items-center justify-center gap-4 absolute bottom-0 left-0 w-full h-8">
                  {/* <strong
                      className="size-item text-xs font-bold uppercase"
                    >
                      {data.size}
                    </strong> */}
                  {data.colors?.length > 0 && ( //sizo
                    <div className="list-color py-2 max-md:hidden flex items-center gap-2 flex-wrap">
                      {data.colors.map((item, index) => (
                        <div
                          key={index}
                          className={`color-item w-6 h-6 rounded-full !duration-0 relative ${
                            activeColor === item.color ? "active" : ""
                          }`}
                          style={{ backgroundColor: `${item.color}` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActiveColor(item.color);
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                            {item.color}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // )
                <></>
              )}
              {style === "style-1" || style === "style-3" ? (
                <div
                  className={`list-action ${
                    style === "style-1" ? "grid grid-cols-2 gap-3" : ""
                  } px-5 absolute w-full bottom-5 max-lg:hidden`}
                >
                  {style === "style-1" && (
                    <div
                      className="quick-view-btn w-full text-button-uppercase py-2 text-center rounded-full duration-300 bg-white hover:bg-black hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickviewOpen();
                      }}
                    >
                      Quick View
                    </div>
                  )}
                  {data.action === "add to cart" ? (
                    <div
                      className="add-cart-btn w-full text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                    >
                      Add To Cart
                    </div>
                  ) : (
                    <>
                      <div
                        className="quick-shop-btn text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenQuickShop(!openQuickShop);
                        }}
                      >
                        Quick Shop
                      </div>
                      <div
                        className={`quick-shop-block absolute left-5 right-5 bg-white p-5 rounded-[20px] ${
                          openQuickShop ? "open" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="list-size flex items-center justify-center flex-wrap gap-2">
                          <div
                            className={`size-item w-10 h-10 rounded-full flex items-center justify-center text-button bg-white border border-line ${
                              data.size ? "active" : ""
                            }`}
                          >
                            {data.size}
                          </div>
                        </div>
                        <div
                          className="button-main w-full text-center rounded-full py-3 mt-4"
                          onClick={() => {
                            handleAddToCart();
                            setOpenQuickShop(false);
                          }}
                        >
                          Add To cart
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <></>
              )}
              {style === "style-2" || style === "style-5" ? (
                <>
                  <div
                    className={`list-action flex items-center justify-center gap-3 px-5 absolute w-full ${
                      style === "style-2" ? "bottom-12" : "bottom-5"
                    } max-lg:hidden`}
                  >
                    {style === "style-2" && (
                      <div
                        className={`add-cart-btn w-9 h-9 flex items-center justify-center rounded-full bg-white duration-300 relative ${
                          compareState.compareArray.some(
                            (item) => item.id === data.id
                          )
                            ? "active"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart();
                        }}
                      >
                        <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                          Add To Cart
                        </div>
                        <Icon.ShoppingBagOpen size={20} />
                      </div>
                    )}
                    <div
                      className={`add-wishlist-btn w-9 h-9 flex items-center justify-center rounded-full bg-white duration-300 relative ${
                        wishlistState.wishlistArray.some(
                          (item) => item.id === Number(data.id)
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist();
                      }}
                    >
                      <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                        Add To Wishlist
                      </div>
                      {wishlistState.wishlistArray.some(
                        (item) => item.id === Number(data.id)
                      ) ? (
                        <>
                          <Icon.Heart
                            size={18}
                            weight="fill"
                            className="text-white"
                          />
                        </>
                      ) : (
                        <>
                          <Icon.Heart size={18} />
                        </>
                      )}
                    </div>
                    <div
                      className={`compare-btn w-9 h-9 flex items-center justify-center rounded-full bg-white duration-300 relative ${
                        compareState.compareArray.some(
                          (item) => item.id === data.id
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCompare();
                      }}
                    >
                      <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                        Compare Product
                      </div>
                      <Icon.Repeat size={18} className="compare-icon" />
                      <Icon.CheckCircle size={20} className="checked-icon" />
                    </div>
                    <div
                      className={`quick-view-btn w-9 h-9 flex items-center justify-center rounded-full bg-white duration-300 relative ${
                        compareState.compareArray.some(
                          (item) => item.id === data.id
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickviewOpen();
                      }}
                    >
                      <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                        Quick View
                      </div>
                      <Icon.Eye size={20} />
                    </div>
                    {style === "style-5" && data.action !== "add to cart" && (
                      <div
                        className={`quick-shop-block absolute left-5 right-5 bg-white p-5 rounded-[20px] ${
                          openQuickShop ? "open" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {/* <div className="list-size flex items-center justify-center flex-wrap gap-2">
                          <div
                            className={`size-item w-10 h-10 rounded-full flex items-center justify-center text-button bg-white border border-line ${
                              data.size ? "active" : ""
                            }`}
                          >
                            {data.size}
                          </div>
                        </div> */}
                        <div
                          className="button-main w-full text-center rounded-full py-3 mt-4"
                          onClick={() => {
                            handleAddToCart();
                            setOpenQuickShop(false);
                          }}
                        >
                          Add To cart
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="list-action-icon flex items-center justify-center gap-2 absolute w-full bottom-3 z-[1] lg:hidden">
                <div
                  className="quick-view-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickviewOpen();
                  }}
                >
                  <Icon.Eye className="text-lg" />
                </div>
                <div
                  className="add-cart-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  <Icon.ShoppingBagOpen className="text-lg" />
                </div>
              </div>
            </div>
            <div className="product-infor mt-4 lg:mb-7">
              {/* <div className="product-sold sm:pb-4 pb-2">
                <div className="progress bg-line h-1.5 w-full rounded-full overflow-hidden relative">
                  <div
                    className={`progress-sold bg-red absolute left-0 top-0 h-full`}
                    style={{ width: `${percentSold}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
                  <div className="text-button-uppercase">
                    <span className="text-secondary2 max-sm:text-xs">
                      Sold:{" "}
                    </span>
                    <span className="max-sm:text-xs">{data.sold}</span>
                  </div>
                  <div className="text-button-uppercase">
                    <span className="text-secondary2 max-sm:text-xs">Available: </span><span className="max-sm:text-xs">On Order</span>
                  </div>
                </div>
              </div> */}
              <div className="product-name text-title duration-300">
                {data.name}
              </div>
              <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
                <div className="product-price text-title">
                  ${data.new_price == undefined ? data.price : data.new_price}
                </div>
                {percentSale > 0 && (
                  <>
                    <div className="product-origin-price caption1 text-secondary2">
                      <del>${data.price}</del>
                    </div>
                    <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                      -{percentSale}%
                    </div>
                  </>
                )}
              </div>

              {style === "style-5" && (
                <>
                  {data.action === "add to cart" ? (
                    <div
                      className="add-cart-btn w-full text-button-uppercase py-2.5 text-center mt-2 rounded-full duration-300 bg-white border border-black hover:bg-black hover:text-white max-lg:hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                    >
                      Add To Cart
                    </div>
                  ) : (
                    <div
                      className="quick-shop-btn text-button-uppercase py-2.5 text-center mt-2 rounded-full duration-300 bg-white border border-black hover:bg-black hover:text-white max-lg:hidden"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenQuickShop(!openQuickShop);
                      }}
                    >
                      Quick Shop
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {type === "list" ? (
            <>
              <div className="product-item list-type">
                <div className="product-main flex lg:items-center sm:justify-between gap-7 max-lg:gap-5">
                  <div
                    onClick={() => handleDetailProduct(data.id)}
                    className="product-thumb bg-white relative overflow-hidden rounded-2xl block max-sm:w-1/2 cursor-pointer"
                  >
                    {data.new && (
                      <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                        New
                      </div>
                    )}
                    {data.has_offer && (
                      <div className="product-tag text-button-uppercase text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                        Sale
                      </div>
                    )}
                    <div className="product-img w-full aspect-[3/4] rounded-2xl overflow-hidden">
                      <Image
                        src={desiredImages[0]?.img}
                        width={500}
                        height={500}
                        priority={true}
                        alt={data.name}
                        className="w-full h-full object-cover duration-700"
                      />

                      {desiredImages[1] && (
                        <Image
                          src={desiredImages[1].img}
                          width={500}
                          height={500}
                          priority={true}
                          alt={data.name}
                          className="w-full h-full object-cover duration-700"
                        />
                      )}
                    </div>
                    <div className="list-action px-5 absolute w-full bottom-5 max-lg:hidden">
                      <div
                        className={`quick-shop-block absolute left-5 right-5 bg-white p-5 rounded-[20px] ${
                          openQuickShop ? "open" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {/* <div className="list-size flex items-center justify-center flex-wrap gap-2">
                          <div
                            className={`size-item h-10 px-4
                              flex items-center justify-center text-button bg-white rounded-full border border-line ${
                                data.size ? "active" : ""
                              }`}
                          >
                            {data.size}
                          </div>
                        </div> */}
                        <div
                          className="button-main w-full text-center rounded-full py-3 mt-4"
                          onClick={() => {
                            handleAddToCart();
                            setOpenQuickShop(false);
                          }}
                        >
                          Add To cart
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:items-center gap-7 max-lg:gap-4 max-lg:flex-wrap max-lg:w-full max-sm:flex-col max-sm:w-1/2">
                    <div className="product-infor max-sm:w-full">
                      <div
                        onClick={() => handleDetailProduct(data.id)}
                        className="product-name heading6 inline-block duration-300 cursor-pointer"
                      >
                        {data.name}
                      </div>
                      <div className="product-price-block flex items-center gap-2 flex-wrap mt-2 duration-300 relative z-[1]">
                        <div className="product-price text-title">
                          $
                          {data.new_price == undefined
                            ? data.price
                            : data.new_price}
                        </div>
                        {data.new_price && (
                          <>
                            <div className="product-origin-price caption1 text-secondary2">
                              <del>${data.price}</del>
                            </div>
                            <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                              -{percentSale}%
                            </div>
                          </>
                        )}
                      </div>
                      {data.colors?.length > 0 && (
                        <div className="list-color max-md:hidden py-2 mt-5 mb-1 flex items-center gap-3 flex-wrap duration-300 !static">
                          {data.colors?.map((item, index) => (
                            <div
                              key={index}
                              className={`color-item w-8 h-8 rounded-full duration-300 relative !border-[1px] !border-[rgba(0,0,0,0.4)] ${
                                activeColor === item.color ? "active" : ""
                              }`}
                              style={{ backgroundColor: `${item.color}` }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActiveColor(item.color);
                              }}
                            >
                              <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                                {item.color}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-secondary desc mt-5 max-sm:hidden">
                        {data.description}
                      </div>
                    </div>
                    <div className="action w-fit flex flex-col items-center justify-center">
                      <div
                        className="quick-shop-btn button-main whitespace-nowrap py-2 px-9 max-lg:px-5 rounded-full bg-white text-black border border-black hover:bg-black hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenQuickShop(!openQuickShop);
                        }}
                      >
                        Quick Shop
                      </div>
                      <div className="list-action-right flex items-center justify-center gap-3 mt-4">
                        <div
                          className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${
                            wishlistState.wishlistArray.some(
                              (item) => item.id === Number(data.id)
                            )
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist();
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                            Add To Wishlist
                          </div>
                          {wishlistState.wishlistArray.some(
                            (item) => item.id === Number(data.id)
                          ) ? (
                            <>
                              <Icon.Heart
                                size={18}
                                weight="fill"
                                className="text-white"
                              />
                            </>
                          ) : (
                            <>
                              <Icon.Heart size={18} />
                            </>
                          )}
                        </div>
                        <div
                          className={`compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${
                            compareState.compareArray.some(
                              (item) => item.id === data.id
                            )
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCompare();
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                            Compare Product
                          </div>
                          <Icon.ArrowsCounterClockwise
                            size={18}
                            className="compare-icon"
                          />
                          <Icon.CheckCircle
                            size={20}
                            className="checked-icon"
                          />
                        </div>
                        <div
                          className="quick-view-btn-list w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickviewOpen();
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">
                            Quick View
                          </div>
                          <Icon.Eye size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}

      {type === "marketplace" ? (
        <div
          className="product-item style-marketplace p-4 border border-line rounded-2xl"
          onClick={() => handleDetailProduct(data.id)}
        >
          <div className="bg-img relative w-full">
            <Image
              className="w-full aspect-square"
              width={5000}
              height={5000}
              src={desiredImages[0]?.img}
              alt="img"
            />
            <div className="list-action flex flex-col gap-1 absolute top-0 right-0">
              <span
                className={`add-wishlist-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300 ${
                  wishlistState.wishlistArray.some(
                    (item) => item.id === Number(data.id)
                  )
                    ? "active"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
              >
                {wishlistState.wishlistArray.some(
                  (item) => item.id === Number(data.id)
                ) ? (
                  <>
                    <Icon.Heart
                      size={18}
                      weight="fill"
                      className="text-white"
                    />
                  </>
                ) : (
                  <>
                    <Icon.Heart size={18} />
                  </>
                )}
              </span>
              <span
                className={`compare-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300 ${
                  compareState.compareArray.some((item) => item.id === data.id)
                    ? "active"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCompare();
                }}
              >
                <Icon.Repeat size={18} className="compare-icon" />
                <Icon.CheckCircle size={20} className="checked-icon" />
              </span>
              <span
                className="quick-view-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickviewOpen();
                }}
              >
                <Icon.Eye />
              </span>
              <span
                className="add-cart-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-sm duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                <Icon.ShoppingBagOpen />
              </span>
            </div>
          </div>
          <div className="product-infor mt-4">
            <span className="text-title">{data.name}</span>
            <div className="flex gap-0.5 mt-1">
              <Rate currentRate={data.average_rate} size={16} />
            </div>
            <span className="text-title inline-block mt-1">${data.price}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Product;
