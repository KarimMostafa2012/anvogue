"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/type/ProductType";
import { Offer } from "@/types/products";
import Product from "../Product";
import Rate from "@/components/Other/Rate";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Scrollbar } from "swiper/modules";
import {
  getProductById,
  clearProduct,
  getAllProducts,
} from "@/redux/slices/productSlice";
import "swiper/css/bundle";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useCompare } from "@/context/CompareContext";
import { useModalCompareContext } from "@/context/ModalCompareContext";
import { countdownTime } from "@/store/countdownTime";
import { clearOffer, getOfferById } from "@/redux/slices/offers";
import { useTranslation } from 'react-i18next';

interface Props {
  productId: string;
}

interface ProductImage {
  img: string;
  id: number;
}

const useAppDispatch = () => useDispatch<AppDispatch>();

const VariableProduct: React.FC<Props> = ({ productId }) => {
  const swiperRef: any = useRef();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [moreColor, setMoreColor] = useState("white");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [openSizeGuide, setOpenSizeGuide] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<string | undefined>("");
  const [selectedSubColor, setSelectedSubColor] = useState<{
    [productId: string]: string;
  }>({});
  const [activeMaterial, setActiveMaterial] = useState<string | null>();
  const [filteredData, setFilteredData] = useState<ProductType[] | null>(null);
  const [activeTab, setActiveTab] = useState<string | undefined>("description");
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();
  const [quantity, setQuantity] = useState<{ [productId: string]: number }>({
    [productId]: 1,
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.products.products);
  const product = useSelector((state: RootState) => state.products.product);
  const loading = useSelector((state: RootState) => state.products.loading);
  const loadingOffer = useSelector((state: RootState) => state.offer.loading);
  const error = useSelector((state: RootState) => state.products.error);
  const errorOffer = useSelector((state: RootState) => state.offer.error);
  const offerElement = useSelector((state: RootState) => state.offer.offer);
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language);


  // Fetch product data
  useEffect(() => {
    if (productId) {
      dispatch(getProductById({ id: productId, lang: currentLanguage }));
    }
    return () => {
      dispatch(clearProduct());
      dispatch(clearOffer());
    };
  }, [productId, dispatch, t, currentLanguage]);

  useEffect(() => {
    if (product?.has_offer && product.id) {
      dispatch(getOfferById({ id: product.id, lang: currentLanguage }));
    }
  }, [product?.has_offer, product?.id, dispatch, t, currentLanguage]);

  useEffect(() => {
    setActiveColor(product?.colors[0].color);
    if (product) {
      const params = {
        sub_category_id: product.sub_category,
        lang: currentLanguage,
      };
      dispatch(getAllProducts({ params }));
    }
  }, [product, dispatch, t, currentLanguage]);

  // Set offer once when received
  useEffect(() => {
    if (offerElement) {
      setOffer(offerElement);
      console.log("Offer received:", offerElement);
    }
  }, [offerElement]);
  const filterById = (data: any[], targetId: string | number) => {
    return data.filter((item) => String(item.id) !== String(targetId));
  };

  useEffect(() => {
    if (!offer?.end_datetime) return;

    // Set initial time
    setTimeLeft(countdownTime(offer.end_datetime));

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(countdownTime(offer.end_datetime));
    }, 1000);

    return () => clearInterval(timer);
  }, [offer?.end_datetime]);

  const productMain: ProductType | undefined =
    product || data?.find((p) => p.id === productId);

  useEffect(() => {
    console.log(productMain)
    if (data) {
      console.log(data);
      setFilteredData(filterById(data, productId));
    }
  }, [data, productId]);


  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  const debouncedAddToCart = debounce(addToCart, 300);

  // Add early return if productMain is undefined
  if (!productMain) {
    return <div className="container py-20">{t('product.notFound')}</div>;
  }

  const percentSale =
    productMain.new_price && productMain.price
      ? Math.floor(
        100 - (productMain.new_price / Number(productMain.price)) * 100
      )
      : 0;

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleSelectedSubColor = (item: string, productId: string) => {
    setSelectedSubColor((prevQuantity) => ({
      ...prevQuantity,
      [productId]: item,
    }));
  };

  const handleQuantityChange = (newQuantity: number, productId: string) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: newQuantity,
    }));
  };

  const getImageUrl = (image: string | ProductImage | undefined): string => {
    if (!image) return "/images/placeholder.png";
    return typeof image === "string" ? image : image.img;
  };

  const convertToProductType = (product: any): ProductType => {
    return {
      ...product,
      id: String(product.id),
      images: Array.isArray(product.images)
        ? product.images.map((img: string | ProductImage, index: number) =>
          typeof img === "string"
            ? { img, id: index }
            : { img: img.img, id: index }
        )
        : [],
      quantity: quantity || 1,
    };
  };

  const handleAddToCart = async (
    item: ProductType,
    selectedColor: string,
    quantity?: number
  ) => {
    try {
      await addToCart(item, selectedColor, quantity); // Wait for success
      window.location.href = "/cart"; // Redirect only if successful
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // Optionally show an error message instead of redirecting
    }
  };

  const debouncedCheckout = debounce(handleAddToCart, 300);


  const handleAddToWishlist = () => {
    if (!productMain) return;

    const productToAdd = convertToProductType(productMain);
    let itemToRemove;
    if (
      wishlistState.wishlistArray.some((item) => {
        if (item.product.id == productToAdd.id) {
          itemToRemove = item.id;
          console.log(itemToRemove);
          return true;
        }
      })
    ) {
      console.log(itemToRemove);
      removeFromWishlist(Number(itemToRemove));
    } else {
      // else, add to wishlist and set state to true
      addToWishlist(productToAdd);
    }
    openModalWishlist();
  };

  const handleAddToCompare = () => {
    if (!productMain) return;

    const productToAdd = convertToProductType(productMain);

    if (compareState.compareArray.length < 3) {
      if (
        compareState.compareArray.some(
          (item) => item.id === String(productMain.id)
        )
      ) {
        removeFromCompare(String(productMain.id));
      } else {
        addToCompare(productToAdd);
      }
    }
    openModalCompare();
  };

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Add loading and error states
  if (loading || loadingOffer) {
    return <div className="container py-20">{t('product.loading')}</div>;
  }

  if (error || errorOffer) {
    return (
      <div className="container py-20">
        {t('product.error')}: {error ? error : errorOffer}
      </div>
    );
  }

  return (
    <>
      <div className="product-detail sale">
        <div className="featured-product underwear md:py-20 py-10">
          <div className="container flex justify-between gap-y-6 flex-wrap">
            <div className="list-img md:w-1/2 md:pe-[45px] w-full flex flex-col gap-5">
              {productMain.images && productMain.images[0] && (
                <Image
                  src={getImageUrl(productMain.images[0])}
                  width={1000}
                  height={1000}
                  alt="prd-img"
                  className="w-full aspect-[3/4] object-cover rounded-[20px] cursor-pointer"
                  onClick={() => {
                    swiperRef.current?.slideTo(0);
                    setOpenPopupImg(true);
                  }}
                />
              )}
              <div className="list-img-child flex gap-5 flex-wrap">
                {productMain.images && productMain.images.length >= 3
                  ? productMain.images.slice(1).map((item, index) => {
                    if (
                      index == productMain.images.length - 2 &&
                      index % 2 == 0
                    ) {
                      return (
                        <Image
                          key={index}
                          src={getImageUrl(item)}
                          width={1000}
                          height={1000}
                          alt="prd-img"
                          className="w-full aspect-[3/4] object-cover rounded-[20px] cursor-pointer"
                          onClick={() => {
                            swiperRef.current?.slideTo(index + 1);
                            setOpenPopupImg(true);
                          }}
                        />
                      );
                    } else {
                      return (
                        <Image
                          key={index}
                          src={getImageUrl(item)}
                          width={1000}
                          height={1000}
                          alt="prd-img"
                          className="w-[calc(50%-10px)] aspect-[3/4] object-cover rounded-[20px] cursor-pointer"
                          onClick={() => {
                            swiperRef.current?.slideTo(index + 1);
                            setOpenPopupImg(true);
                          }}
                        />
                      );
                    }
                  })
                  : productMain.images &&
                  productMain.images.length == 2 && (
                    <>
                      <Image
                        src={getImageUrl(productMain.images[1])}
                        width={1000}
                        height={1000}
                        alt="prd-img"
                        className="w-full aspect-[3/4] object-cover rounded-[20px] cursor-pointer"
                        onClick={() => {
                          swiperRef.current?.slideTo(2);
                          setOpenPopupImg(true);
                        }}
                      />
                    </>
                  )}
              </div>
              <div className={`popup-img ${openPopupImg ? "open" : ""}`}>
                <span
                  className="close-popup-btn absolute top-4 right-4 z-[2] cursor-pointer"
                  onClick={() => {
                    setOpenPopupImg(false);
                  }}
                >
                  <Icon.X className="text-3xl text-white" />
                </span>
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  modules={[Navigation, Thumbs]}
                  navigation={true}
                  loop={true}
                  className="popupSwiper"
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                >
                  {productMain.images &&
                    productMain.images.map((item, index) => (
                      <SwiperSlide
                        key={index}
                        onClick={() => {
                          setOpenPopupImg(false);
                        }}
                      >
                        <Image
                          src={getImageUrl(item)}
                          width={1000}
                          height={1000}
                          alt="prd-img"
                          className="w-full aspect-[3/4] object-cover rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
            <div className="     md:w-1/2 w-full lg:ps-[15px] md:ps-2">
              <div className="flex justify-between">
                <div>
                  <div className="caption2 text-secondary font-semibold uppercase">
                    {productMain.type}
                  </div>
                  <div className="heading4 mt-1">{productMain.name}</div>
                </div>
                <div
                  className={`add-wishlist-btn w-12 h-12 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some(
                    (item) => item.product.id === productMain.id
                  )
                    ? "active"
                    : ""
                    }`}
                  onClick={handleAddToWishlist}
                >
                  {wishlistState.wishlistArray.some(
                    (item) => item.product.id === productMain.id
                  ) ? (
                    <>
                      <Icon.Heart
                        size={24}
                        weight="fill"
                        className="text-white"
                      />
                    </>
                  ) : (
                    <>
                      <Icon.Heart size={24} />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center mt-3">
                <Rate currentRate={productMain.average_rate} size={14} />
                <span className="caption1 text-secondary">{t('product.detail.reviews')}</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                <div className="product-price heading5">
                  $
                  {productMain.new_price != undefined
                    ? productMain.new_price
                    : productMain.price}
                </div>
                {(productMain.new_price != undefined) && (
                  <>
                    <div className="w-px h-4 bg-line"></div>
                    <div className="product-origin-price font-normal text-secondary2">
                      <del>${productMain.price}</del>
                    </div>
                    <div className="product-sale caption2 font-semibold bg-green px-3 py-0.5 inline-block rounded-full">
                      -{percentSale}%
                    </div>
                  </>
                )}
                <div className="desc text-secondary mt-3">
                  {productMain.description}
                </div>
              </div>
              {offer?.active && (
                <>
                  <div className="countdown-block flex items-center justify-between flex-wrap gap-y-4 mt-5">
                    <div className="text-title">
                      {t('product.detail.hurryUp')}
                      <br />
                      {t('product.detail.offerEndsIn')}
                    </div>
                    <div className="countdown-time flex items-center lg:gap-5 gap-3 max-[400px]:justify-between max-[400px]:w-full">
                      <div className="item w-[70px] h-[60px] flex flex-col items-center justify-center border border-red rounded-lg">
                        <div className="days heading6 text-center">
                          {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
                        </div>
                        <div className="caption1 text-center">{t('product.detail.days')}</div>
                      </div>
                      <div className="heading5">:</div>
                      <div className="item w-[70px] h-[60px] flex flex-col items-center justify-center border border-red rounded-lg">
                        <div className="hours heading6 text-center">
                          {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                        </div>
                        <div className="caption1 text-center">{t('product.detail.hours')}</div>
                      </div>
                      <div className="heading5">:</div>
                      <div className="item w-[70px] h-[60px] flex flex-col items-center justify-center border border-red rounded-lg">
                        <div className="mins heading6 text-center">
                          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                        </div>
                        <div className="caption1 text-center">{t('product.detail.minutes')}</div>
                      </div>
                      <div className="heading5">:</div>
                      <div className="item w-[70px] h-[60px] flex flex-col items-center justify-center border border-red rounded-lg">
                        <div className="secs heading6 text-center">
                          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                        </div>
                        <div className="caption1 text-center">{t('product.detail.seconds')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-line mt-5"></div>
                </>
              )}
              <div className="list-group mt-1">
                {filteredData
                  ?.slice(0, filteredData.length >= 3 ? 3 : filteredData.length)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="item flex items-center justify-between mt-6 pb-6 border-b border-line"
                    >
                      <div className="left flex items-center gap-5">
                        <div className="bg-img">
                          <Image
                            src={item.images[0].img}
                            width={300}
                            height={400}
                            alt="img"
                            className="w-[95px] object-cover rounded-lg aspect-[3/4] flex-shrink-0"
                          />
                        </div>
                        <div className="infor">
                          <div className="text-title">{item.name}</div>
                          <div className="flex items-center">
                            <div className="select-block relative w-fit mt-2">
                              <select
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  const selectedOption =
                                    e.target.options[e.target.selectedIndex];
                                  const colorCode =
                                    selectedOption.getAttribute(
                                      "data-color-code"
                                    ) || "";
                                  handleSelectedSubColor(colorCode, item.id);
                                }}
                                className="text-button py-2 ps-3 pe-8 rounded-lg bg-white border border-line"
                              >
                                {item.colors.map((variate, i) => (
                                  <option
                                    key={i}
                                    data-color-code={variate.color}
                                  >
                                    {variate.color}
                                  </option>
                                ))}
                              </select>
                              <Icon.CaretDown
                                size={12}
                                className="absolute top-1/2 -translate-y-1/2 ltr:md:right-4 ltr:right-2 rtl:left-2 rtl:md:left-4"
                              />
                            </div>
                            <span
                              className="h-4 w-4 rounded-3xl border-1 inline-block ms-2"
                              style={{
                                backgroundColor:
                                  selectedSubColor[item.id] ||
                                  item.colors[0].color,
                              }}
                            ></span>
                          </div>
                          <div className="text-title mt-2">${item.price}</div>
                        </div>
                      </div>
                      <div className="right">
                        <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[140px] w-[120px] flex-shrink-0">
                          <Icon.Minus
                            size={20}
                            onClick={() => {
                              if (quantity[item.id] > 0) {
                                handleQuantityChange(
                                  quantity[item.id] - 1,
                                  item.id
                                );
                              }
                            }}
                            className={`${quantity[item.id] === 0 ? "disabled" : ""
                              } cursor-pointer`}
                          />
                          <div className="body1 font-semibold">
                            {quantity[item.id] || 0}
                          </div>
                          <Icon.Plus
                            size={20}
                            onClick={() =>
                              handleQuantityChange(
                                (quantity[item.id] || 0) + 1,
                                item.id
                              )
                            }
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="list-action mt-6">
                <div className="choose-color mt-5">
                  <div className="text-title">
                    {t('product.detail.color')}:{" "}
                    <span className="text-title color">{activeColor}</span>
                  </div>
                  <div className="list-color flex items-center gap-2 flex-wrap mt-3">
                    {productMain.colors.map(
                      (item: { color: string }, index: number) => {
                        if (index > 4) {
                          return;
                        } else {
                          return (
                            <div
                              key={index}
                              className={`color-item w-6 h-6 rounded-full !duration-0 relative ${activeColor === item.color ? "active" : ""
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
                          );
                        }
                      }
                    )}
                    {productMain.colors.length > 4 && (
                      <div className="relative">
                        <div
                          className={`color-item w-6 h-6 rounded-full !duration-0 relative !border-[rgba(0,0,0,0.4)]`}
                          style={{ backgroundColor: moreColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoreColors(!showMoreColors);
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                            more
                          </div>
                        </div>
                        {showMoreColors && productMain.colors.length > 4 && (
                          <div className="flex flex-wrap justify-between absolute bottom-full left-[32px] shadow-md bg-white rounded-[12px] w-[320px] p-[12px] gap-[8px]">
                            {productMain.colors.map(
                              (item: { color: string }, index: number) => {
                                if (index > 4) {
                                  return (
                                    <div
                                      key={index}
                                      className={`color-item w-6 h-6 rounded-full !duration-0 relative ${activeColor === item.color
                                        ? "active"
                                        : ""
                                        }`}
                                      style={{
                                        backgroundColor: `${item.color}`,
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleActiveColor(item.color);
                                        setMoreColor(item.color);
                                        setShowMoreColors(false);
                                      }}
                                    >
                                      <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                                        {item.color}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return;
                                }
                              }
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-title mt-5">{t('product.detail.quantity')}:</div>
                <div className="choose-quantity flex items-center lg:justify-between gap-5 gap-y-3 mt-3">
                  <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                    <Icon.Minus
                      size={20}
                      onClick={() =>
                        handleQuantityChange(
                          quantity[productMain.id] > 1
                            ? quantity[productMain.id] - 1
                            : 1,
                          productMain.id
                        )
                      }
                      className={`${quantity[productId] === 1 ? "disabled" : ""
                        } cursor-pointer`}
                    />
                    <div className="body1 font-semibold">
                      {quantity[productId]}
                    </div>
                    <Icon.Plus
                      size={20}
                      onClick={() =>
                        handleQuantityChange(
                          (quantity[productMain.id] || 1) + 1,
                          productMain.id
                        )
                      }
                      className="cursor-pointer"
                    />
                  </div>
                  <div
                    onClick={() => { debouncedAddToCart(productMain, String(activeColor), quantity[productId]) }}
                    className="button-main w-full text-center bg-white text-black border border-black"
                  >
                    {t('product.addToCart')}
                  </div>
                </div>
                <div className="button-block mt-5">
                  <div className="button-main w-full text-center" onClick={() => { debouncedCheckout(productMain, String(activeColor), quantity[productId]) }}>
                    {t('product.detail.buyNow')}
                  </div>
                </div>
                <div className="flex items-center lg:gap-20 gap-8 mt-5 pb-6 border-b border-line">
                  <div
                    className="compare flex items-center gap-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCompare();
                    }}
                  >
                    <div className="compare-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                      <Icon.ArrowsCounterClockwise className="heading6" />
                    </div>
                    <span>{t('product.compare')}</span>
                  </div>
                  <div className="share flex items-center gap-3 cursor-pointer">
                    <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                      <Icon.ShareNetwork weight="fill" className="heading6" />
                    </div>
                    <span>{t('product.detail.share')}</span>
                  </div>
                </div>
                <div className="more-infor mt-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Icon.ArrowClockwise className="body1" />
                      <div className="text-title">{t('product.detail.deliveryReturn')}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon.Question className="body1" />
                      <div className="text-title">{t('product.detail.askQuestion')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <Icon.Timer className="body1" />
                    <div className="text-title">{t('product.detail.estimatedDelivery')}:</div>
                    <div className="text-secondary">
                      14 January - 18 January
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <Icon.Eye className="body1" />
                    <div className="text-title">38</div>
                    <div className="text-secondary">
                      {t('product.detail.peopleViewing')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="text-title">{t('product.detail.sku')}:</div>
                    <div className="text-secondary">53453412</div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="text-title">{t('product.detail.categories')}:</div>
                    <div className="text-secondary">
                      {productMain.category}, {productMain.gender}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="text-title">{t('product.detail.tag')}:</div>
                    <div className="text-secondary">{productMain.type}</div>
                  </div>
                </div>
                <div className="list-payment mt-7">
                  <div className="main-content lg:pt-8 pt-6 lg:pb-6 pb-4 sm:px-4 px-3 border border-line rounded-xl relative max-md:w-2/3 max-sm:w-full">
                    <div className="heading6 px-5 bg-white absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap">
                      {t('product.detail.guaranteedCheckout')}
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
              <div className="get-it mt-6">
                <div className="heading5">{t('product.detail.getItToday')}</div>
                <div className="item flex items-center gap-3 mt-4">
                  <div className="icon-delivery-truck text-4xl"></div>
                  <div>
                    <div className="text-title">{t('product.detail.freeShipping')}</div>
                    <div className="caption1 text-secondary mt-1">
                      {t('product.detail.freeShippingDesc')}
                    </div>
                  </div>
                </div>
                <div className="item flex items-center gap-3 mt-4">
                  <div className="icon-phone-call text-4xl"></div>
                  <div>
                    <div className="text-title">{t('product.detail.supportEveryday')}</div>
                    <div className="caption1 text-secondary mt-1">
                      {t('product.detail.supportHours')}
                    </div>
                  </div>
                </div>
                <div className="item flex items-center gap-3 mt-4">
                  <div className="icon-return text-4xl"></div>
                  <div>
                    <div className="text-title">{t('product.detail.returns')}</div>
                    <div className="caption1 text-secondary mt-1">
                      {t('product.detail.returnsDesc')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="desc-tab">
          <div className="container">
            <div className="flex items-center justify-center w-full">
              <div className="menu-tab flex items-center md:gap-[60px] gap-8">
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 hover:text-black duration-300 ${activeTab === "description" ? "active" : ""
                    }`}
                  onClick={() => handleActiveTab("description")}
                >
                  {t('product.detail.description')}
                </div>
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 hover:text-black duration-300 ${activeTab === "specifications" ? "active" : ""
                    }`}
                  onClick={() => handleActiveTab("specifications")}
                >
                  {t('product.detail.specifications')}
                </div>
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 hover:text-black duration-300 ${activeTab === "review" ? "active" : ""
                    }`}
                  onClick={() => handleActiveTab("review")}
                >
                  {t('product.detail.reviews')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`container desc-item review-block ${activeTab === "review" ? "open" : ""}`}>
          <div className="top-overview flex max-sm:flex-col items-center justify-between gap-12 gap-y-4">
            <div className="left flex max-sm:flex-col gap-y-4 items-center justify-between lg:w-1/2 sm:w-2/3 w-full sm:pr-5">
              <div className="rating black-start flex flex-col items-center">
                <div className="text-display">4.6</div>
                <Rate currentRate={5} size={18} />
                <div className="text-center whitespace-nowrap mt-1">
                  (1,968 Ratings)
                </div>
              </div>
              <div className="list-rating w-2/3">
                <div className="item flex items-center justify-end gap-1.5">
                  <div className="flex items-center gap-1">
                    <div className="caption1">5</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress bg-line relative w-3/4 h-2">
                    <div className="progress-percent absolute bg-black w-[50%] h-full left-0 top-0"></div>
                  </div>
                  <div className="caption1">50%</div>
                </div>
                <div className="item flex items-center justify-end gap-1.5 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="caption1">4</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress bg-line relative w-3/4 h-2">
                    <div className="progress-percent absolute bg-black w-[20%] h-full left-0 top-0"></div>
                  </div>
                  <div className="caption1">20%</div>
                </div>
                <div className="item flex items-center justify-end gap-1.5 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="caption1">3</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress bg-line relative w-3/4 h-2">
                    <div className="progress-percent absolute bg-black w-[10%] h-full left-0 top-0"></div>
                  </div>
                  <div className="caption1">10%</div>
                </div>
                <div className="item flex items-center justify-end gap-1.5 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="caption1">2</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress bg-line relative w-3/4 h-2">
                    <div className="progress-percent absolute bg-black w-[10%] h-full left-0 top-0"></div>
                  </div>
                  <div className="caption1">10%</div>
                </div>
                <div className="item flex items-center justify-end gap-1.5 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="caption1">1</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress bg-line relative w-3/4 h-2">
                    <div className="progress-percent absolute bg-black w-[10%] h-full left-0 top-0"></div>
                  </div>
                  <div className="caption1">10%</div>
                </div>
              </div>
            </div>
            <div className="right">
              <Link
                href={"#form-review"}
                className="button-main bg-white text-black border border-black whitespace-nowrap"
              >
                Write Reviews
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <div className="heading flex items-center justify-between flex-wrap gap-4">
              <div className="heading4">03 Comments</div>
              <div className="right flex items-center gap-3">
                <label htmlFor="select-filter" className="uppercase">
                  Sort by:
                </label>
                <div className="select-block relative">
                  <select
                    id="select-filter"
                    name="select-filter"
                    className="text-button py-2 pl-3 md:pr-14 pr-10 rounded-lg bg-white border border-line"
                    defaultValue={"Sorting"}
                  >
                    <option value="Sorting" disabled>
                      Sorting
                    </option>
                    <option value="newest">Newest</option>
                    <option value="5star">5 Star</option>
                    <option value="4star">4 Star</option>
                    <option value="3star">3 Star</option>
                    <option value="2star">2 Star</option>
                    <option value="1star">1 Star</option>
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                  />
                </div>
              </div>
            </div>
            <div className="list-review mt-6">
              <div className="item">
                <div className="heading flex items-center justify-between">
                  <div className="user-infor flex gap-4">
                    <div className="avatar">
                      <Image
                        src={"/images/avatar/1.png"}
                        width={200}
                        height={200}
                        alt="img"
                        className="w-[52px] aspect-square rounded-full"
                      />
                    </div>
                    <div className="user">
                      <div className="flex items-center gap-2">
                        <div className="text-title">Tony Nguyen</div>
                        <div className="span text-line">-</div>
                        <Rate currentRate={5} size={12} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-secondary2">1 days ago</div>
                        <div className="text-secondary2">-</div>
                        <div className="text-secondary2">
                          <span>Yellow</span> / <span>XL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="more-action cursor-pointer">
                    <Icon.DotsThree size={24} weight="bold" />
                  </div>
                </div>
                <div className="mt-3">
                  I can{String.raw`'t`} get enough of the fashion pieces
                  from this brand. They have a great selection for every
                  occasion and the prices are reasonable. The shipping is
                  fast and the items always arrive in perfect condition.
                </div>
                <div className="action mt-3">
                  <div className="flex items-center gap-4">
                    <div className="like-btn flex items-center gap-1 cursor-pointer">
                      <Icon.HandsClapping size={18} />
                      <div className="text-button">20</div>
                    </div>
                    <Link
                      href={"#form-review"}
                      className="reply-btn text-button text-secondary cursor-pointer hover:text-black"
                    >
                      Reply
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item mt-8">
                <div className="heading flex items-center justify-between">
                  <div className="user-infor flex gap-4">
                    <div className="avatar">
                      <Image
                        src={"/images/avatar/2.png"}
                        width={200}
                        height={200}
                        alt="img"
                        className="w-[52px] aspect-square rounded-full"
                      />
                    </div>
                    <div className="user">
                      <div className="flex items-center gap-2">
                        <div className="text-title">Guy Hawkins</div>
                        <div className="span text-line">-</div>
                        <Rate currentRate={4} size={12} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-secondary2">1 days ago</div>
                        <div className="text-secondary2">-</div>
                        <div className="text-secondary2">
                          <span>Yellow</span> / <span>XL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="more-action cursor-pointer">
                    <Icon.DotsThree size={24} weight="bold" />
                  </div>
                </div>
                <div className="mt-3">
                  I can{String.raw`'t`} get enough of the fashion pieces
                  from this brand. They have a great selection for every
                  occasion and the prices are reasonable. The shipping is
                  fast and the items always arrive in perfect condition.
                </div>
                <div className="action mt-3">
                  <div className="flex items-center gap-4">
                    <div className="like-btn flex items-center gap-1 cursor-pointer">
                      <Icon.HandsClapping size={18} />
                      <div className="text-button">20</div>
                    </div>
                    <Link
                      href={"#form-review"}
                      className="reply-btn text-button text-secondary cursor-pointer hover:text-black"
                    >
                      Reply
                    </Link>
                  </div>
                </div>
              </div>
              <div className="item mt-8">
                <div className="heading flex items-center justify-between">
                  <div className="user-infor flex gap-4">
                    <div className="avatar">
                      <Image
                        src={"/images/avatar/3.png"}
                        width={200}
                        height={200}
                        alt="img"
                        className="w-[52px] aspect-square rounded-full"
                      />
                    </div>
                    <div className="user">
                      <div className="flex items-center gap-2">
                        <div className="text-title">John Smith</div>
                        <div className="span text-line">-</div>
                        <Rate currentRate={5} size={12} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-secondary2">1 days ago</div>
                        <div className="text-secondary2">-</div>
                        <div className="text-secondary2">
                          <span>Yellow</span> / <span>XL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="more-action cursor-pointer">
                    <Icon.DotsThree size={24} weight="bold" />
                  </div>
                </div>
                <div className="mt-3">
                  I can{String.raw`'t`} get enough of the fashion pieces
                  from this brand. They have a great selection for every
                  occasion and the prices are reasonable. The shipping is
                  fast and the items always arrive in perfect condition.
                </div>
                <div className="action mt-3">
                  <div className="flex items-center gap-4">
                    <div className="like-btn flex items-center gap-1 cursor-pointer">
                      <Icon.HandsClapping size={18} />
                      <div className="text-button">20</div>
                    </div>
                    <Link
                      href={"#form-review"}
                      className="reply-btn text-button text-secondary cursor-pointer hover:text-black"
                    >
                      Reply
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div id="form-review" className="form-review pt-6">
              <div className="heading4">Leave A comment</div>
              <form className="grid sm:grid-cols-2 gap-4 gap-y-5 md:mt-6 mt-3">
                <div className="name ">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="username"
                    type="text"
                    placeholder="Your Name *"
                    required
                  />
                </div>
                <div className="mail ">
                  <input
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                    id="email"
                    type="email"
                    placeholder="Your Email *"
                    required
                  />
                </div>
                <div className="col-span-full message">
                  <textarea
                    className="border border-line px-4 py-3 w-full rounded-lg"
                    id="message"
                    name="message"
                    placeholder="Your message *"
                    required
                  ></textarea>
                </div>
                <div className="col-span-full flex items-start -mt-2 gap-2">
                  <input
                    type="checkbox"
                    id="saveAccount"
                    name="saveAccount"
                    className="mt-1.5"
                  />
                  <label className="" htmlFor="saveAccount">
                    Save my name, email, and website in this browser for
                    the next time I comment.
                  </label>
                </div>
                <div className="col-span-full sm:pt-3">
                  <button className="button-main bg-white text-black border border-black">
                    Submit Reviews
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VariableProduct;
