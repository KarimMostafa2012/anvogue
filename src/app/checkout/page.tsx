"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import { ProductType } from "@/type/ProductType";
import productData from "@/data/Product.json";
import Product from "@/components/Product/Product";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

type Address = {
  street_name: string;
  city: string;
  house_num: string;
  zip_code: string;
  id: number;
};

interface CartItem {
  id: string;
  price: number | string;
  new_price?: number;
  quantity: number;
  name: string;
  images: Array<{ img: string }>;
  size?: number;
  color?: string;
  selectedSize?: number;
  selectedColor?: string;
  cartItemId: string;
  image: string;
}

interface CartState {
  cartArray: CartItem[];
  isLoading: boolean;
  error: string | null;
}

interface UserProfile {
  id?: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  balance?: string;
  email?: string;
  verified?: boolean;
  city?: string;
  house_num?: string;
  street_name?: string;
  zip_code?: string;
  addresses?: Address[];
  profile_img?: string;
}

const Checkout = () => {
  const searchParams = useSearchParams();
  const discount = searchParams.get("discount") || "0";
  const ship = searchParams.get("ship") || "0";

  const { cartState, loadCart } = useCart();
  const [totalCart, setTotalCart] = useState<number>(0);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<boolean>(false);
  const [balancePay, setBalancePay] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [activeAddress, setActiveAddress] = useState<string | null>("mainShipping");

  useEffect(() => {
    if (cartState?.cartArray) {
      const total = cartState.cartArray.reduce<number>((acc, item) => {
        const price = item.new_price ? item.new_price : Number(item.price);
        return acc + (price * item.quantity);
      }, 0);
      setTotalCart(total);
    }
  }, [cartState?.cartArray]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "https://api.malalshammobel.com/auth/api/users/me/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("accessToken")
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
      console.log(data);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const changeAddress = () => {
    const mainForm = document.querySelectorAll(
      "#mainForm input"
    ) as NodeListOf<HTMLInputElement>;
    const adressForms = document.querySelectorAll(".otherAddresses");

    if (!mainForm.length) return;

    fetch("https://api.malalshammobel.com/auth/api/users/me/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accessToken") ||
          window.sessionStorage.getItem("accessToken")
          }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: profile.phone_number,
        street_name: mainForm[0]?.value || "",
        house_num: mainForm[2]?.value || "",
        city: mainForm[1]?.value || "",
        zip_code: mainForm[3]?.value || "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (Number(response.status) == 401) {
            window.localStorage.removeItem("accessToken");
            window.sessionStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
            window.sessionStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } else {
          console.log(response, "ok");
          // window.location.href = "https://mail.google.com/";
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    adressForms.forEach((form) => {
      const formElements = form.querySelectorAll(
        "input"
      ) as NodeListOf<HTMLInputElement>;
      console.log({
        street_name: formElements[0].value,
        house_num: formElements[2].value,
        city: formElements[1].value,
        zip_code: formElements[3].value,
      });
      // more addresses ================================
      fetch(
        `https://api.malalshammobel.com/auth/api/addresses/${form.getAttribute(
          "data-id"
        )}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("accessToken")
              ? window.localStorage.getItem("accessToken")
              : window.sessionStorage.getItem("accessToken")
              }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            street_name: formElements[0].value,
            house_num: formElements[2].value,
            city: formElements[1].value,
            zip_code: formElements[3].value,
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            if (Number(response.status) == 401) {
              window.localStorage.removeItem("accessToken");
              window.sessionStorage.removeItem("accessToken");
              window.localStorage.removeItem("refreshToken");
              window.sessionStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }
          } else {
            console.log(response, "ok");
            // window.location.href = "https://mail.google.com/";
            return;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
    fetchProfile();
  };

  const activate = () => {
    fetch("https://api.malalshammobel.com/auth/activation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: profile.email,
        platform: "web",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
        } else {
          window.location.href = "https://mail.google.com/";
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addAddress = (ev: HTMLFormElement) => {
    const form = ev.querySelectorAll("input");
    fetch("https://api.malalshammobel.com/auth/api/addresses/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accessToken")
          ? window.localStorage.getItem("accessToken")
          : window.sessionStorage.getItem("accessToken")
          }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        street_name: form[0].value,
        house_num: form[2].value,
        city: form[1].value,
        zip_code: form[3].value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          if (Number(response.status) == 401) {
            window.localStorage.removeItem("accessToken");
            window.sessionStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
            window.sessionStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } else {
          fetchProfile();
          form.forEach((element) => {
            element.value = "";
          });
          setNewForm(false);
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleActiveAddress = (order: string) => {
    setActiveAddress((prevOrder) => (prevOrder === order ? null : order));
  };

  const pyamentEndPoint = (orderId: string) => {
    console.log(orderId)
    fetch("https://api.malalshammobel.com/payment/stripe/process/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: orderId,
        platform: "web",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to submit order");
        } else if (response.ok) {
          console.log(response);
          return response.json(); // <-- important fix here
        }
      })
      .then((data) => {
        window.location.href = data.stripe_payment_url;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const payment = () => {
    const notes: HTMLInputElement | null = document.querySelector("#notes");

    if (document.querySelector("#address")) {
      const FormId = document
        .querySelector("#address")
        ?.getAttribute("data-id");
      const forms = document.querySelectorAll("form");
      let selectedForm;
      forms.forEach((form) => {
        console.log(form.getAttribute("data-id"));
        if (form.getAttribute("data-id") == FormId) {
          selectedForm = form;
        }
      });
      const selectedFormChilds = document.querySelectorAll(
        "#mainForm input"
      ) as NodeListOf<HTMLInputElement>;

      fetch("https://api.malalshammobel.com/order/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken")
            }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: notes?.value == null ? "" : notes?.value,
          street_name: selectedFormChilds[0].value,
          house_num: selectedFormChilds[2].value,
          city: selectedFormChilds[1].value,
          zip_code: selectedFormChilds[3].value,
          user: profile.id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (Number(response.status) == 401) {
              window.localStorage.removeItem("accessToken");
              window.sessionStorage.removeItem("accessToken");
              window.localStorage.removeItem("refreshToken");
              window.sessionStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }
          }
          return response.json(); // <-- important fix here
        })
        .then((data) => {
          console.log("Response data:", data);
          if (data.payment_status == "Pending") {
            pyamentEndPoint(data.id);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const refetch = () => {
    loadCart();
    setBalancePay(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      phone_number: formData.get("phone_number"),
      street_name: formData.get("street_name"),
      house_num: formData.get("house_num"),
      city: formData.get("city"),
      zip_code: formData.get("zip_code"),
    };

    try {
      const response = await fetch("https://api.malalshammobel.com/auth/api/users/me/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken")
            }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setNewForm(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
      </div>
      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex justify-between">
            <div className="left w-1/2">
              {!window.sessionStorage.getItem("loggedIn") ? (
                <>
                  <div className="login bg-surface py-3 px-4 flex justify-between rounded-lg">
                    <div className="left flex items-center">
                      <span className="text-on-surface-variant1 pr-4">
                        don&apos;t have an account?{" "}
                      </span>
                      <span className="text-button text-on-surface hover-underline cursor-pointer">
                        <a href="/register">Signup</a>
                      </span>
                    </div>
                    <div className="right">
                      <i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i>
                    </div>
                  </div>
                  <div className="form-login-block mt-3">
                    <form className="p-5 border border-line rounded-lg">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="email ">
                          <input
                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                            id="username"
                            type="email"
                            placeholder="Username or email"
                            required
                          />
                        </div>
                        <div className="pass ">
                          <input
                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                            id="password"
                            type="password"
                            placeholder="Password"
                            required
                          />
                        </div>
                      </div>
                      <div className="block-button mt-3">
                        <button className="button-main button-blue-hover">
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : profile.verified ? (
                <>
                  <div
                    className={`tab_address text-content w-full p-7 border border-line rounded-xl block`}
                  >
                    <div className="heading5 pb-3">Choose Order Address</div>
                    <form id="mainForm" data-id="mainform">
                      <button
                        type="button"
                        className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${activeAddress === "mainShipping" ? "active" : ""
                          }`}
                        onClick={() => handleActiveAddress("mainShipping")}
                      >
                        <strong className="heading6">Main address</strong>
                        {activeAddress === "mainShipping" && (
                          <div className="ms-auto pe-2 text-success font-bold">
                            Choosen Address
                            <input
                              data-id="mainform"
                              className="hidden"
                              type="checkbox"
                              name="address"
                              id="address"
                              defaultChecked
                            />
                          </div>
                        )}
                        <CaretDown className="text-2xl ic_down duration-300" />
                      </button>

                      <div
                        className={`form_address ${activeAddress === "mainShipping" ? "block" : "hidden"
                          }`}
                      >
                        <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                          <div className="street">
                            <label
                              htmlFor="shippingStreet"
                              className="caption1 capitalize"
                            >
                              street Name <span className="text-red">*</span>
                            </label>
                            <input
                              className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                              id="shippingStreet"
                              type="text"
                              defaultValue={profile.street_name}
                              required
                            />
                          </div>
                          <div className="city">
                            <label
                              htmlFor="shippingCity"
                              className="caption1 capitalize"
                            >
                              Town / city <span className="text-red">*</span>
                            </label>
                            <input
                              className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                              id="shippingCity"
                              type="text"
                              defaultValue={profile.city}
                              required
                            />
                          </div>
                          <div className="state">
                            <label
                              htmlFor="house_num"
                              className="caption1 capitalize"
                            >
                              House Number <span className="text-red">*</span>
                            </label>
                            <input
                              className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                              id="house_num"
                              type="text"
                              defaultValue={profile.house_num}
                              required
                            />
                          </div>
                          <div className="zip">
                            <label
                              htmlFor="shippingZip"
                              className="caption1 capitalize"
                            >
                              ZIP <span className="text-red">*</span>
                            </label>
                            <input
                              className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                              id="shippingZip"
                              type="text"
                              defaultValue={profile.zip_code}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                    {profile.addresses?.map((address: Address, i) => {
                      return (
                        <div key={address.id}>
                          <button
                            type="button"
                            className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${activeAddress === "shipping" + i ? "active" : ""
                              }`}
                            onClick={() => handleActiveAddress("shipping" + i)}
                          >
                            <strong className="heading6">
                              Shipping address {i + 2}
                            </strong>
                            {activeAddress === "shipping" + i && (
                              <div className="ms-auto pe-2 text-success font-bold">
                                Choosen Address
                                <input
                                  data-id={address.id}
                                  className="hidden"
                                  type="checkbox"
                                  name="address"
                                  id="address"
                                  defaultChecked
                                />
                              </div>
                            )}
                            <CaretDown className="text-2xl ic_down duration-300" />
                          </button>
                          <form
                            className="otherAddresses"
                            data-id={address.id}
                            onSubmit={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <div
                              className={`form_address ${activeAddress === "shipping" + i ? "block" : "hidden"
                                }`}
                            >
                              <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                                <div className="street">
                                  <label
                                    htmlFor={"shippingStreet" + i}
                                    className="caption1 capitalize"
                                  >
                                    street Name{" "}
                                    <span className="text-red">*</span>
                                  </label>
                                  <input
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                    id={"shippingStreet" + i}
                                    type="text"
                                    defaultValue={address.street_name}
                                    required
                                  />
                                </div>
                                <div className="city">
                                  <label
                                    htmlFor={"shippingCity" + i}
                                    className="caption1 capitalize"
                                  >
                                    Town / city{" "}
                                    <span className="text-red">*</span>
                                  </label>
                                  <input
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                    id={"shippingCity" + i}
                                    type="text"
                                    defaultValue={address.city}
                                    required
                                  />
                                </div>
                                <div className="state">
                                  <label
                                    htmlFor={"house_num" + i}
                                    className="caption1 capitalize"
                                  >
                                    House Number{" "}
                                    <span className="text-red">*</span>
                                  </label>
                                  <input
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                    id={"house_num" + i}
                                    type="text"
                                    defaultValue={address.house_num}
                                    required
                                  />
                                </div>
                                <div className="zip">
                                  <label
                                    htmlFor={"shippingZip" + i}
                                    className="caption1 capitalize"
                                  >
                                    ZIP <span className="text-red">*</span>
                                  </label>
                                  <input
                                    className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                    id={"shippingZip" + i}
                                    type="text"
                                    defaultValue={address.zip_code}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      );
                    })}
                    <div className="block-button lg:mt-10 mt-6">
                      <form
                        className="newAddress"
                        onSubmit={(e) => {
                          e.preventDefault();
                          addAddress(e.currentTarget);
                        }}
                      >
                        <div
                          className={`form_address ${newForm ? "block" : "hidden"
                            }`}
                        >
                          <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                            <div className="street">
                              <label
                                htmlFor={"newshippingStreet"}
                                className="caption1 capitalize"
                              >
                                street Name <span className="text-red">*</span>
                              </label>
                              <input
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                id={"newshippingStreet"}
                                type="text"
                                required
                              />
                            </div>
                            <div className="city">
                              <label
                                htmlFor={"newshippingCity"}
                                className="caption1 capitalize"
                              >
                                Town / city <span className="text-red">*</span>
                              </label>
                              <input
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                id={"newshippingCity"}
                                type="text"
                                required
                              />
                            </div>
                            <div className="state">
                              <label
                                htmlFor={"newhouse_num"}
                                className="caption1 capitalize"
                              >
                                House Number <span className="text-red">*</span>
                              </label>
                              <input
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                id={"newhouse_num"}
                                type="text"
                                required
                              />
                            </div>
                            <div className="zip">
                              <label
                                htmlFor={"newshippingZip"}
                                className="caption1 capitalize"
                              >
                                ZIP <span className="text-red">*</span>
                              </label>
                              <input
                                className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                                id={"newshippingZip"}
                                type="text"
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="py-[8px] px-[32px] !border-success rounded-lg !border-[1px] my-[12px] ms-auto block bg-success hover:bg-white text-white font-medium hover:text-success duration-300"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                      <button
                        onClick={() => {
                          changeAddress();
                        }}
                        className="button-main"
                      >
                        Update Address
                      </button>
                      <button
                        onClick={() => {
                          setNewForm(!newForm);
                        }}
                        className="ms-4 button-main"
                      >
                        {!newForm ? "Add Address" : "Remove Address"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="left md:w-2/3 w-full pl-2.5 items-center flex flex-col mt-[15%]">
                  <div className="text-[24px] text-center font-medium">
                    Please Activate Your Email
                  </div>
                  <div className="flex justify-center items-center mt-[32px]">
                    <Link
                      href={"https://mail.google.com/"}
                      className="button-main bg-white text-black border border-black w-full text-center"
                      onClick={(e) => {
                        e.preventDefault();
                        activate();
                      }}
                    >
                      ACTIVATE
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="right w-5/12">
              <div className="checkout-block">
                <div className="heading5 pb-3">Your Order</div>
                <div className="list-product-checkout">
                  {cartState.cartArray.length < 1 ? (
                    <p className="text-button pt-3">No product in cart</p>
                  ) : (
                    cartState.cartArray.map((product) => (
                      <div key={product.id} className="item flex items-center justify-between w-full pb-5 border-b border-line gap-6 mt-5">
                        <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={product.images[0].img}
                            width={500}
                            height={500}
                            alt="img"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="name text-title">
                              {product.name}
                            </div>
                            <div className="caption1 text-secondary mt-2">
                              <span className="color capitalize">
                                {product.selectedColor}
                              </span>
                            </div>
                          </div>
                          <div className="text-title">
                            <span className="quantity">
                              {product.quantity}
                            </span>
                            <span className="px-1">x</span>
                            <span>
                              $
                              {product.new_price
                                ? product.new_price
                                : product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="discount-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Discounts</div>
                  <div className="text-title">
                    -$
                    <span className="discount">{discount}</span>
                  </div>
                </div>
                <div className="ship-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Shipping</div>
                  <div className="text-title">
                    {Number(ship) === 0 ? "Free" : `$${ship}`}
                  </div>
                </div>
                <div className="total-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">Total</div>
                  <div className="text-title">
                    ${(totalCart + Number(ship) - Number(discount)).toFixed(2)}
                  </div>
                </div>
                <textarea
                  className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                  name="notes"
                  id="notes"
                ></textarea>
              </div>
              <button
                onClick={() => {
                  payment();
                }}
                className="button-main mt-6"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {balancePay && (
        <div
          className={`modal-order-detail-block flex items-center justify-center`}
          onClick={() => setBalancePay(false)}
        >
          <div
            className={`modal-order-detail-main w-fit max-w-[460px] bg-white rounded-2xl ${balancePay == true ? "open" : ""
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="info p-10 text-center">
              <h5 className="heading5">Order Details</h5>
              <div className="list_info gap-10 gap-y-8 mt-5">
                <div className="info_item">
                  <h6 className="heading6 order_name mt-2">
                    The value of the wallet is {profile.balance}, {totalCart - Number(discount) + Number(ship)} has been
                    deducted.
                  </h6>
                  <button
                    onClick={() => {
                      setBalancePay(false);
                      refetch()
                    }}
                    className="button-main mt-6"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
