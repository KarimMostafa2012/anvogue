"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/type/ProductType";
import { color } from "@/type/ProductType";
import { Offer } from "@/types/products";
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
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface Props {
  productId: string;
}

interface ProductImage {
  img: string;
  color: number; // This matches the color number in the colors array
  id: number;
}

const useAppDispatch = () => useDispatch<AppDispatch>();

const VariableProduct: React.FC<Props> = ({ productId }) => {
  const swiperRef = useRef<any>(null);
  const isInitialMount = useRef(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [moreColor, setMoreColor] = useState("white");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [openSizeGuide, setOpenSizeGuide] = useState(false);
  const [activeColor, setActiveColor] = useState<color | undefined>(undefined);
  const [selectedSubColor, setSelectedSubColor] = useState<{
    [productId: string]: string;
  }>({});
  const [quantity, setQuantity] = useState<{ [productId: string]: number }>({
    [productId]: 1,
  });
  const [filteredData, setFilteredData] = useState<ProductType[] | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewError, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Context hooks
  const { addToCart } = useCart();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const { addToCompare, removeFromCompare, compareState } = useCompare();
  const { openModalCompare } = useModalCompareContext();

  // Redux hooks
  const dispatch = useAppDispatch();
  const product = useSelector((state: RootState) => state.products.product);
  const loading = useSelector((state: RootState) => state.products.loading);
  const loadingOffer = useSelector((state: RootState) => state.offer.loading);
  const error = useSelector((state: RootState) => state.products.error);
  const errorOffer = useSelector((state: RootState) => state.offer.error);
  const offerElement = useSelector((state: RootState) => state.offer.offer);
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const relatedProducts = useSelector(
    (state: RootState) => state.products.products
  );

  // Memoized product data
  const productMain = useMemo(() => product, [product]);
  const percentSale = useMemo(() => {
    if (!productMain?.new_price || !productMain?.price) return 0;
    return Math.floor(
      100 - (productMain.new_price / Number(productMain.price)) * 100
    );
  }, [productMain]);

  // Filter images based on selected color
  const filteredImages = useMemo(() => {
    console.log(productMain);
    if (!productMain || !productMain.images || !activeColor) return [];

    // Find the index of the active color in the colors array
    const colorIndex: { color: string }[] = productMain.colors.filter(
      (color) => color.color === activeColor.color
    ); // +1 because color numbers in images are 1-based

    console.log(
      productMain.images.filter(
        (image) =>
          typeof image != "string" && image.color == colorIndex[0].color
      )
    );
    return productMain.images.filter(
      (image) => typeof image != "string" && image.color == colorIndex[0].color
    );
  }, [productMain, activeColor]);

  console.log(filteredImages);
  // Fetch product data
  useEffect(() => {
    if (productId) {
      dispatch(getProductById({ id: productId, lang: currentLanguage }));
    }
    return () => {
      dispatch(clearProduct());
      dispatch(clearOffer());
    };
  }, [productId, dispatch, currentLanguage]);

  // Fetch offer if product has one
  useEffect(() => {
    if (product?.has_offer && product.offer_id && !offer) {
      dispatch(getOfferById({ id: product.offer_id, lang: currentLanguage }));
    }
  }, [product?.has_offer, product?.offer_id, dispatch, currentLanguage, offer]);

  // Set offer once when received
  useEffect(() => {
    if (offerElement && !offer) {
      setOffer(offerElement);
    }
  }, [offerElement, offer]);

  // Set active color and fetch related products
  useEffect(() => {
    if (productMain && !activeColor) {
      setActiveColor(productMain.colors[0]);
      const params = {
        sub_category_id: productMain.sub_category,
        lang: currentLanguage,
      };
      dispatch(getAllProducts({ params }));
    }
  }, [productMain, dispatch, currentLanguage, activeColor]);

  // Countdown timer for offer
  useEffect(() => {
    if (!offer?.end_datetime) return;

    setTimeLeft(countdownTime(offer.end_datetime));
    const timer = setInterval(() => {
      setTimeLeft(countdownTime(offer.end_datetime));
    }, 1000);

    return () => clearInterval(timer);
  }, [offer?.end_datetime]);

  // Filter related products
  useEffect(() => {
    if (productMain) {
      setFilteredData(
        relatedProducts.filter((item) => String(item.id) !== String(productId))
      );
    }
  }, [productMain, productId, relatedProducts]);

  // Helper functions
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
      quantity: quantity[product.id] || 1,
    };
  };

  const handleActiveColor = (item: color) => {
    setActiveColor(item);
  };

  const handleSelectedSubColor = (item: string, productId: string) => {
    setSelectedSubColor((prev) => ({
      ...prev,
      [productId]: item,
    }));
  };

  const handleQuantityChange = (newQuantity: number, productId: string) => {
    setQuantity((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleAddToCart = async (
    item: ProductType,
    selectedColor: string,
    quantity?: number
  ) => {
    try {
      await addToCart(item, selectedColor, quantity);
      window.location.href = "/cart";
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const debounce = useCallback(
    <T extends (...args: any[]) => void>(func: T, delay: number) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
    []
  );

  const debouncedAddToCart = useMemo(
    () => debounce(addToCart, 300),
    [debounce, addToCart]
  );

  const debouncedCheckout = useMemo(
    () => debounce(handleAddToCart, 300),
    [debounce, handleAddToCart]
  );

  const handleAddToWishlist = () => {
    if (!productMain) return;

    const productToAdd = convertToProductType(productMain);
    const existingItem = wishlistState.wishlistArray.find(
      (item) => item.product.id === productToAdd.id
    );

    if (existingItem) {
      removeFromWishlist(Number(existingItem.id));
    } else {
      addToWishlist(productToAdd);
    }
    openModalWishlist();
  };

  const handleAddToCompare = () => {
    if (!productMain) return;

    const productToAdd = convertToProductType(productMain);

    if (
      compareState.compareArray.some(
        (item) => item.id === String(productMain.id)
      )
    ) {
      removeFromCompare(String(productMain.id));
    } else if (compareState.compareArray.length < 3) {
      addToCompare(productToAdd);
    }
    openModalCompare();
  };

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  const submitReview = (form: HTMLFormElement) => {
    const formData = {
      comment: (form.elements.namedItem("message") as HTMLInputElement).value,
      product: productId,
      rate: userRating || 1,
    };

    fetch(`https://api.malalshammobel.com/products/rate/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken")
        }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData[0] || "Something went wrong");
          throw new Error(errorData[0] || "Something went wrong");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const totalRatings = product?.rates.reduce(
    (acc: number, r: { comments: any[] }) => acc + r.comments.length,
    0
  );

  // Early return if product not found
  if (!productMain) {
    return <div className="container py-20">{t("product.notFound")}</div>;
  }

  // Loading and error states
  if (loading || loadingOffer) {
    return <div className="container py-20">{t("product.loading")}</div>;
  }

  if (error || errorOffer) {
    return (
      <div className="container py-20">
        {t("product.error")}: {error || errorOffer}
      </div>
    );
  }

  return (
    <>
      <div className="product-detail sale">
        {/* Product images section */}
        <div className="featured-product underwear md:py-20 py-10">
          <div className="container flex justify-between gap-y-6 flex-wrap">
            {/* Left column - product images */}
            <div className="list-img md:w-1/2 md:pe-[45px] w-full flex flex-col gap-5">
              {filteredImages[0] && (
                <Image
                  src={getImageUrl(filteredImages[0].img)}
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

              {/* Thumbnail images */}
              <div className="list-img-child flex gap-5 flex-wrap">
                {filteredImages.slice(1).map((item, index) => (
                  <Image
                    key={index}
                    src={getImageUrl(item.img)}
                    width={1000}
                    height={1000}
                    alt="prd-img"
                    className={`${
                      index === filteredImages.length - 2 && index % 2 === 0
                        ? "w-full"
                        : "w-[calc(50%-10px)]"
                    } aspect-[3/4] object-cover rounded-[20px] cursor-pointer`}
                    onClick={() => {
                      swiperRef.current?.slideTo(index + 1);
                      setOpenPopupImg(true);
                    }}
                  />
                ))}
              </div>

              {/* Image popup modal */}
              <div className={`popup-img ${openPopupImg ? "open" : ""}`}>
                <span
                  className="close-popup-btn absolute top-4 right-4 z-[2] cursor-pointer"
                  onClick={() => setOpenPopupImg(false)}
                >
                  <Icon.X className="text-3xl text-white" />
                </span>
                {filteredImages.length > 0 && (
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
                    {filteredImages.map((item, index) => (
                      <SwiperSlide key={index}>
                        <Image
                          src={getImageUrl(item.img)}
                          width={1000}
                          height={1000}
                          alt="prd-img"
                          className="w-full aspect-[3/4] object-cover rounded-xl"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </div>

            {/* Right column - product details */}
            <div className="md:w-1/2 w-full lg:ps-[15px] md:ps-2">
              {/* Product title and wishlist */}
              <div className="flex justify-between">
                <div>
                  <div className="caption2 text-secondary font-semibold uppercase">
                    {productMain.type}
                  </div>
                  <div className="heading4 mt-1">{productMain.name}</div>
                </div>
                <div
                  className={`add-wishlist-btn w-12 h-12 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white ${
                    wishlistState.wishlistArray.some(
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
                    <Icon.Heart
                      size={24}
                      weight="fill"
                      className="text-white"
                    />
                  ) : (
                    <Icon.Heart size={24} />
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mt-3">
                <Rate currentRate={productMain.average_rate} size={14} />
                <span className="ms-2 caption1 text-secondary">
                  {t("product.detail.reviews")}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 flex-wrap mt-5 pb-6 border-b border-line">
                <div className="product-price heading5">
                  ${productMain.new_price ?? productMain.price}
                </div>
                {productMain.new_price && (
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

              {/* Countdown timer for offer */}
              {offer?.active && (
                <div className="countdown-block flex items-center justify-between flex-wrap gap-y-4 mt-5">
                  <div className="text-title">
                    {t("product.detail.hurryUp")}
                    <br />
                    {t("product.detail.offerEndsIn")}
                  </div>
                  <div className="countdown-time flex items-center lg:gap-5 gap-3 max-[400px]:justify-between max-[400px]:w-full">
                    {Object.entries(timeLeft).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <div className="item w-[70px] h-[60px] flex flex-col items-center justify-center border border-red rounded-lg">
                          <div className="heading6 text-center">
                            {value < 10 ? `0${value}` : value}
                          </div>
                          <div className="caption1 text-center">
                            {t(`product.detail.${key}`)}
                          </div>
                        </div>
                        {key !== "seconds" && <div className="heading5">:</div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Related products */}
              <div className="list-group mt-1">
                {filteredData?.slice(0, 3).map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="item flex items-center justify-between mt-6 pb-6 border-b border-line"
                    >
                      <div className="left flex items-center gap-5">
                        <Image
                          src={item.images[0]?.img}
                          width={300}
                          height={400}
                          alt="img"
                          className="w-[95px] object-cover rounded-lg aspect-[3/4] flex-shrink-0"
                        />
                        <div className="infor">
                          <div className="text-title">{item.name}</div>
                          <div className="flex items-center">
                            <select
                              onChange={(e) => {
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
                                <option key={i} data-color-code={variate.color}>
                                  {variate.color}
                                </option>
                              ))}
                            </select>
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
                          className={`${
                            quantity[item.id] === 0 ? "disabled" : ""
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
                  );
                })}
              </div>

              {/* Color selection */}
              <div className="choose-color mt-5">
                <div className="text-title">
                  {t("product.detail.color")}:{" "}
                  <span className="color">{activeColor?.color}</span>
                </div>
                <div className="list-color flex items-center gap-2 flex-wrap mt-3">
                  {productMain.colors.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className={`color-item w-6 h-6 rounded-full !duration-0 relative ${
                        activeColor?.color === item.color ? "active" : ""
                      }`}
                      style={{ backgroundColor: item.color }}
                      onClick={() => handleActiveColor(item)}
                    >
                      <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                        {item.color}
                      </div>
                    </div>
                  ))}
                  {productMain.colors.length > 5 && (
                    <div className="relative">
                      <div
                        className="color-item w-6 h-6 rounded-full !duration-0 relative !border-[rgba(0,0,0,0.4)]"
                        style={{ backgroundColor: moreColor }}
                        onClick={() => setShowMoreColors(!showMoreColors)}
                      >
                        <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">
                          more
                        </div>
                      </div>
                      {showMoreColors && (
                        <div className="flex flex-wrap justify-between absolute bottom-full left-[32px] shadow-md bg-white rounded-[12px] w-[320px] p-[12px] gap-[8px]">
                          {productMain.colors.slice(5).map((item, index) => (
                            <div
                              key={index + 5}
                              className={`color-item w-6 h-6 rounded-full !duration-0 relative ${
                                activeColor?.color === item.color
                                  ? "active"
                                  : ""
                              }`}
                              style={{ backgroundColor: item.color }}
                              onClick={() => {
                                handleActiveColor(item);
                                setMoreColor(item.color);
                                setShowMoreColors(false);
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
                  )}
                </div>
              </div>

              {/* Quantity and add to cart */}
              <div className="text-title mt-5">
                {t("product.detail.quantity")}:
              </div>
              <div className="choose-quantity flex items-center lg:justify-between gap-5 gap-y-3 mt-3">
                <div className="quantity-block md:p-3 max-md:py-1.5 max-md:px-3 flex items-center justify-between rounded-lg border border-line sm:w-[180px] w-[120px] flex-shrink-0">
                  <Icon.Minus
                    size={20}
                    onClick={() =>
                      handleQuantityChange(
                        Math.max(1, quantity[productMain.id] - 1),
                        productMain.id
                      )
                    }
                    className={`${
                      quantity[productId] === 1 ? "disabled" : ""
                    } cursor-pointer`}
                  />
                  <div className="body1 font-semibold">
                    {quantity[productId] || 1}
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
                  onClick={() => {
                    debouncedAddToCart(
                      productMain,
                      String(activeColor),
                      quantity[productId]
                    );
                  }}
                  className="button-main w-full text-center bg-white text-black border border-black"
                >
                  {t("product.addToCart")}
                </div>
              </div>

              {/* Buy now button */}
              <div className="button-block mt-5">
                <div
                  className="button-main w-full text-center"
                  onClick={() => {
                    debouncedCheckout(
                      productMain,
                      String(activeColor),
                      quantity[productId]
                    );
                  }}
                >
                  {t("product.detail.buyNow")}
                </div>
              </div>

              {/* Compare and share */}
              <div className="flex items-center lg:gap-20 gap-8 mt-5 pb-6 border-b border-line">
                <div
                  className="compare flex items-center gap-3 cursor-pointer"
                  onClick={handleAddToCompare}
                >
                  <div className="compare-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                    <Icon.ArrowsCounterClockwise className="heading6" />
                  </div>
                  <span>{t("product.compare")}</span>
                </div>
                <div className="share flex items-center gap-3 cursor-pointer">
                  <div className="share-btn md:w-12 md:h-12 w-10 h-10 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white">
                    <Icon.ShareNetwork weight="fill" className="heading6" />
                  </div>
                  <span>{t("product.detail.share")}</span>
                </div>
              </div>

              {/* Additional info */}
              <div className="more-infor mt-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Icon.ArrowClockwise className="body1" />
                    <div className="text-title">
                      {t("product.detail.deliveryReturn")}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon.Question className="body1" />
                    <div className="text-title">
                      {t("product.detail.askQuestion")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <Icon.Timer className="body1" />
                  <div className="text-title">
                    {t("product.detail.estimatedDelivery")}:
                  </div>
                  <div className="text-secondary">14 January - 18 January</div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <Icon.Eye className="body1" />
                  <div className="text-title">38</div>
                  <div className="text-secondary">
                    {t("product.detail.peopleViewing")}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <div className="text-title">{t("product.detail.sku")}:</div>
                  <div className="text-secondary">53453412</div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <div className="text-title">
                    {t("product.detail.categories")}:
                  </div>
                  <div className="text-secondary">
                    {productMain.category}, {productMain.gender}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <div className="text-title">{t("product.detail.tag")}:</div>
                  <div className="text-secondary">{productMain.type}</div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="list-payment mt-7">
                <div className="main-content lg:pt-8 pt-6 lg:pb-6 pb-4 sm:px-4 px-3 border border-line rounded-xl relative max-md:w-2/3 max-sm:w-full">
                  <div className="heading6 px-5 bg-white absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {t("product.detail.guaranteedCheckout")}
                  </div>
                  <div className="list grid grid-cols-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="item flex items-center justify-center lg:px-3 px-1"
                      >
                        <Image
                          src={`/images/payment/Frame-${index}.png`}
                          width={500}
                          height={450}
                          alt="payment"
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="desc-tab">
          <div className="container">
            <div className="flex items-center justify-center w-full">
              <div className="menu-tab flex items-center md:gap-[60px] gap-8">
                <div
                  className="heading5 text-black duration-300"
                  onClick={() => handleActiveTab("review")}
                >
                  {t("product.detail.reviews")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`container desc-item review-block ${
            activeTab === "review" ? "open" : ""
          }`}
        >
          <div className="top-overview flex max-sm:flex-col items-center justify-between gap-12 gap-y-4">
            <div className="left flex max-sm:flex-col gap-y-4 items-center justify-between lg:w-1/2 sm:w-2/3 w-full sm:pr-5">
              <div className="rating black-start flex flex-col items-center">
                <div className="text-display">{product?.average_rate}</div>
                <Rate currentRate={Number(product?.average_rate)} size={18} />
                <div className="text-center whitespace-nowrap mt-1">
                  ({product?.rates.length} Ratings)
                </div>
              </div>
              <div className="list-rating w-2/3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const ratingData = product?.rates.find(
                    (r) => r.rate === star
                  );
                  const count = ratingData?.comments.length ?? 0;
                  const percent = totalRatings
                    ? Math.round((count / totalRatings) * 100)
                    : 0;

                  return (
                    <div
                      key={star}
                      className="item flex items-center justify-end gap-1.5"
                    >
                      <div className="flex items-center gap-1">
                        <div className="caption1">{star}</div>
                        <Icon.Star size={14} weight="fill" />
                      </div>
                      <div className="progress bg-line relative w-3/4 h-2 rounded overflow-hidden">
                        <div
                          className="progress-percent absolute bg-black h-full left-0 top-0"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="caption1 w-10 text-right">{percent}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="right">
              <Link
                href="#form-review"
                className="button-main bg-white text-black border border-black whitespace-nowrap"
              >
                Write Reviews
              </Link>
            </div>
          </div>

          <div className="mt-8 mb-16">
            <div className="heading flex items-center justify-between flex-wrap gap-4">
              <div className="heading4">{product?.rates.length} comments</div>
            </div>
            <div className="list-review mt-6">
              {product?.rates.map((rate) => (
                <div key={rate.id} className="item mb-6">
                  <div className="heading flex items-center justify-between">
                    <div className="user-infor flex gap-4">
                      <Image
                        src={rate.profile_img || "/images/avatar/1.png"}
                        width={52}
                        height={52}
                        alt="avatar"
                        className="w-[52px] aspect-square rounded-full"
                      />
                      <div className="user">
                        <div className="flex items-center gap-2">
                          <div className="text-title">
                            {rate.first_name} {rate.last_name}
                          </div>
                          <div className="span text-line">-</div>
                          <Rate currentRate={rate.rate} size={12} />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-secondary2">
                            {dayjs(rate.comments[0].created_at).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">{rate.comments[0].comment}</div>
                </div>
              ))}
            </div>

            {/* Review form */}
            <div id="form-review" className="form-review pt-6">
              <div className="heading4">Leave A comment</div>
              <form
                className="grid sm:grid-cols-2 gap-4 gap-y-5 md:mt-6 mt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitReview(e.currentTarget);
                }}
              >
                <div className="col-span-full flex items-start -mt-2 gap-2">
                  Rate The Product:
                  <Rate
                    currentRate={userRating}
                    size={24}
                    onRateSelect={setUserRating}
                  />
                </div>
                <div className="col-span-full message">
                  <textarea
                    className="border border-line px-4 py-3 rounded-lg md:w-[50%] w-full"
                    id="message"
                    name="message"
                    placeholder="Your message *"
                    required
                  ></textarea>
                </div>
                {reviewError && <div className="text-red">{reviewError}</div>}
                <div className="col-span-full sm:pt-3">
                  <button
                    type="submit"
                    className="button-main bg-white text-black border border-black"
                  >
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
