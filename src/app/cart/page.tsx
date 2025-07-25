"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import { useTranslation } from "react-i18next";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  distance?: number | null;
  balance?: string;
  email?: string;
  verified?: boolean;
  city?: string;
  house_num?: string;
  street_name?: string;
  id?: number | string;
  zip_code?: string;
  addresses?: [];
  profile_img?: string;
  // Add other expected properties here
}

const Cart = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({});
  const [shipping, setShipping] = useState<{
    shipping_cost: number;
    total_order: number;
  }>({ total_order: 0, shipping_cost: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { cartState, updateCart, removeFromCart } = useCart();

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "https://api.malalshammobel.com/auth/api/users/me/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              window.localStorage.getItem("accessToken")
                ? window.localStorage.getItem("accessToken")
                : window.sessionStorage.getItem("accessToken")
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (Number(response.status) == 401) {
          window.localStorage.removeItem("accessToken");
          window.sessionStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          window.sessionStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const getShipping = async () => {
    if (!profile) return;
    console.log(profile);

    const response = await fetch(
      `https://api.malalshammobel.com/order/data/precheckout/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken")
          }`,
        },
        body: JSON.stringify({
          street_name: profile.street_name || "",
          house_num: profile.house_num || "",
          city: profile.city || "",
          zip_code: profile.zip_code || "",
        }),
      }
    );

    const data = await response.json();
    setShipping(data)
    return data;
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    console.log(profile);
    getShipping();
  }, [profile.street_name]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    // Tìm sản phẩm trong giỏ hàng
    const itemToUpdate = cartState.cartArray.find(
      (item) => item.id === productId
    );

    // Kiểm tra xem sản phẩm có tồn tại không
    if (itemToUpdate) {
      // Truyền giá trị hiện tại của selectedSize và selectedColor
      updateCart(
        productId,
        newQuantity,
        itemToUpdate.selectedColor,
        itemToUpdate.selectedSize
      );
    }
  };

  const redirectToCheckout = () => {
    router.push(`/checkout?discount=${0}&ship=${shipping.shipping_cost}`);
  };

  return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
      </div>
      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex justify-between max-xl:flex-col gap-y-8">
            <div className="xl:w-2/3 xl:pe-3 w-full">
              {/* <div className="time bg-green py-3 px-5 flex items-center rounded-lg">
                <div className="heding5">🔥</div>
                <div className="caption1 ps-2">
                  Your cart will expire in
                  <span className="min text-red text-button fw-700">
                    {" "}
                    {timeLeft.minutes}:
                    {timeLeft.seconds < 10
                      ? `0${timeLeft.seconds}`
                      : timeLeft.seconds}
                  </span>
                  <span>
                    {" "}
                    minutes! Please checkout now before your items sell out!
                  </span>
                </div>
              </div> */}
              {/* <div className="heading banner mt-5">
                <div className="text">
                  Buy
                  <span className="text-button">
                    {" "}
                    $
                    <span className="more-price">
                      {moneyForFreeship - totalCart > 0 ? (
                        <>{moneyForFreeship - totalCart}</>
                      ) : (
                        0
                      )}
                    </span>
                    {" "}
                  </span>
                  <span>more to get </span>
                  <span className="text-button">freeship</span>
                </div>
                <div className="tow-bar-block mt-4">
                  <div
                    className="progress-line"
                    style={{
                      width:
                        totalCart <= moneyForFreeship
                          ? `${(totalCart / moneyForFreeship) * 100}%`
                          : `100%`,
                    }}
                  ></div>
                </div>
              </div> */}
              <div className="list-product w-full">
                <div className="w-full">
                  <div className="heading bg-surface bora-4 pt-4 pb-4">
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="text-button text-center">Products</div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-button text-center">Price</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">Quantity</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">
                          Total Price
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-product-main w-full mt-3">
                    {cartState.cartArray.length < 1 ? (
                      <p className="text-button pt-3">No product in cart</p>
                    ) : (
                      cartState.cartArray.map((product) => (
                        <div
                          className="item flex md:mt-7 md:pb-7 mt-5 pb-5 border-b border-line w-full"
                          key={product.cartItemId}
                        >
                          <div className="w-1/2">
                            <div className="flex items-center gap-6">
                              <div className="bg-img md:w-[100px] w-20 aspect-[3/4]">
                                <Image
                                  src={product.images[0].img}
                                  width={1000}
                                  height={1000}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div>
                                <div className="text-title">{product.name}</div>
                                <div className="list-select mt-3"></div>
                              </div>
                            </div>
                          </div>
                          <div className="w-1/12 price flex items-center justify-center">
                            <div className="text-title text-center">
                              ${product.new_price ? product.new_price : product.price}
                            </div>
                          </div>
                          <div className="w-1/6 flex items-center justify-center">
                            <div className="quantity-block bg-surface md:p-3 p-2 flex items-center justify-between rounded-lg border border-line md:w-[100px] flex-shrink-0 w-20">
                              <Icon.Minus
                                onClick={() => {
                                  if (product.quantity > 1) {
                                    handleQuantityChange(
                                      product.id,
                                      product.quantity - 1
                                    );
                                  }
                                }}
                                className={`text-base max-md:text-sm ${
                                  product.quantity === 1 ? "disabled" : ""
                                }`}
                              />
                              <div className="text-button quantity">
                                {product.quantity}
                              </div>
                              <Icon.Plus
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    product.quantity + 1
                                  )
                                }
                                className="text-base max-md:text-sm"
                              />
                            </div>
                          </div>
                          <div className="w-1/6 flex total-price items-center justify-center">
                            <div className="text-title text-center">
                              ${product.quantity * Number(product.new_price ? product.new_price : product.price)}
                            </div>
                          </div>
                          <div className="w-1/12 flex items-center justify-center">
                            <Icon.XCircle
                              className="text-xl max-md:text-base text-red cursor-pointer hover:text-black duration-500"
                              onClick={() => {
                                removeFromCart(product.cartItemId);
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="input-block discount-code w-full h-12 sm:mt-7 mt-5">
                <form className="w-full h-full relative">
                  <input
                    type="text"
                    placeholder="Add voucher discount"
                    className="w-full h-full bg-surface ps-4 pe-14 rounded-lg border border-line"
                    required
                  />
                  <button className="button-main absolute top-1 bottom-1 right-1 px-5 rounded-lg flex items-center justify-center">
                    Apply Code
                  </button>
                </form>
              </div> */}
              {/* <div className="list-voucher flex items-center gap-5 flex-wrap sm:mt-7 mt-5">
                <div
                  className={`item ${
                    applyCode === 200 ? "bg-green" : ""
                  } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">10% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from 200$
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main py-1 px-2.5 capitalize text-xs"
                      onClick={() =>
                        handleApplyCode(200, Math.floor((totalCart / 100) * 10))
                      }
                    >
                      {applyCode === 200 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
                <div
                  className={`item ${
                    applyCode === 300 ? "bg-green" : ""
                  } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">15% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from 300$
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main py-1 px-2.5 capitalize text-xs"
                      onClick={() =>
                        handleApplyCode(300, Math.floor((totalCart / 100) * 15))
                      }
                    >
                      {applyCode === 300 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
                <div
                  className={`item ${
                    applyCode === 400 ? "bg-green" : ""
                  } border border-line rounded-lg py-2`}
                >
                  <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">20% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from 400$
                      </div>
                    </div>
                  </div>
                  <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main py-1 px-2.5 capitalize text-xs"
                      onClick={() =>
                        handleApplyCode(400, Math.floor((totalCart / 100) * 20))
                      }
                    >
                      {applyCode === 400 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="xl:w-1/3 xl:ps-12 w-full">
              <div className="checkout-block bg-surface p-6 rounded-2xl">
                <div className="heading5">Order Summary</div>
                <div className="total-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Subtotal</div>
                  <div className="text-title">
                    $<span className="total-product">{shipping.total_order}</span>
                    <span></span>
                  </div>
                </div>
                <div className="ship-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Shipping</div>
                  <div className="choose-type flex gap-12">
                    <div className="right">
                      <div className="ship">${shipping.shipping_cost}</div>
                    </div>
                  </div>
                </div>
                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                  <div className="heading5">Total</div>
                  <div className="heading5">
                    $
                    <span className="total-cart heading5">
                      {shipping.total_order + shipping.shipping_cost}
                    </span>
                    <span className="heading5"></span>
                  </div>
                </div>
                <div className="block-button flex flex-col items-center gap-y-4 mt-5">
                  <div
                    className="checkout-btn button-main text-center w-full"
                    onClick={redirectToCheckout}
                  >
                    Process To Checkout
                  </div>
                  <Link className="text-button hover-underline" href={"/shop"}>
                    {t("Continue Shopping")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
