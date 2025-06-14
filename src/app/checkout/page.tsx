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
import { useTranslation } from "react-i18next";

type Address = {
  street_name: string;
  city: string;
  house_num: string;
  zip_code: string;
  id: number;
};

interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
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

const Checkout = () => {
  const searchParams = useSearchParams();
  let discount = searchParams.get("discount");
  let ship = searchParams.get("ship");

  const { cartState } = useCart();
  let [totalCart, setTotalCart] = useState<number>(0);
  const [openDetail, setOpenDetail] = useState<boolean | undefined>(false);
  const [newForm, setNewForm] = useState<boolean | undefined>(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [activeAddress, setActiveAddress] = useState<string | null>(
    "mainShipping"
  );

  const { t } = useTranslation();

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

    fetch("https://api.malalshammobel.com/auth/api/users/me/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${
          window.localStorage.getItem("accessToken")
            ? window.localStorage.getItem("accessToken")
            : window.sessionStorage.getItem("accessToken")
        }`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: profile.phone_number,
        street_name: mainForm[0].value,
        house_num: mainForm[2].value,
        city: mainForm[1].value,
        zip_code: mainForm[3].value,
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
            Authorization: `Bearer ${
              window.localStorage.getItem("accessToken")
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
        Authorization: `Bearer ${
          window.localStorage.getItem("accessToken")
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

  cartState.cartArray.map(
    (item) =>
      (totalCart +=
        Number(item.new_price ? item.new_price : item.price) * item.quantity)
  );

  const pyamentEndPoint = (orderId: string) => {
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
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken") ||
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
              window.sessionStorage.removeItem("loggedIn");
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

  return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb
          heading={t("checkout.title")}
          subHeading={t("checkout.subtitle")}
        />
      </div>
      <div className="cart-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex justify-between">
            <div className="left w-1/2">
              {!window.sessionStorage.getItem("loggedIn") ? (
                <>
                  <div className="login bg-surface py-3 px-4 flex justify-between rounded-lg">
                    <div className="left flex items-center">
                      <span className="text-on-surface-variant1 pe-4">
                        {t("checkout.login.noAccount")}{" "}
                      </span>
                      <span className="text-button text-on-surface hover-underline cursor-pointer">
                        <a href="/register">{t("checkout.login.signup")}</a>
                      </span>
                    </div>
                    <div className="right">
                      <i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i>
                    </div>
                  </div>
                  <div className="form-login-block mt-3">
                    <form className="p-5 border border-line rounded-lg">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="email">
                          <input
                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                            id="username"
                            type="email"
                            placeholder={t(
                              "checkout.login.usernamePlaceholder"
                            )}
                            required
                          />
                        </div>
                        <div className="pass">
                          <input
                            className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                            id="password"
                            type="password"
                            placeholder={t(
                              "checkout.login.passwordPlaceholder"
                            )}
                            required
                          />
                        </div>
                      </div>
                      <div className="block-button mt-3">
                        <button className="button-main button-blue-hover">
                          {t("checkout.login.loginButton")}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : profile.verified ? (
                <>
                  <div className="tab_address text-content w-full p-7 border border-line rounded-xl block">
                    <div className="heading5 pb-3">
                      {t("checkout.address.title")}
                    </div>
                    <form id="mainForm" data-id="mainform">
                      <button
                        type="button"
                        className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${
                          activeAddress === "mainShipping" ? "active" : ""
                        }`}
                        onClick={() => handleActiveAddress("mainShipping")}
                      >
                        <strong className="heading6">
                          {t("checkout.address.mainAddress")}
                        </strong>
                        {activeAddress === "mainShipping" && (
                          <div className="ms-auto pe-2 text-success font-bold">
                            {t("checkout.address.chosenAddress")}
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
                        <Icon.CaretDown className="text-2xl ic_down duration-300" />
                      </button>

                      <div
                        className={`form_address ${
                          activeAddress === "mainShipping" ? "block" : "hidden"
                        }`}
                      >
                        <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                          <div className="street">
                            <label
                              htmlFor="shippingStreet"
                              className="caption1 capitalize"
                            >
                              {t("checkout.address.streetName")}{" "}
                              <span className="text-red">
                                {t("checkout.address.required")}
                              </span>
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
                              {t("checkout.address.city")}{" "}
                              <span className="text-red">
                                {t("checkout.address.required")}
                              </span>
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
                              {t("checkout.address.houseNumber")}{" "}
                              <span className="text-red">
                                {t("checkout.address.required")}
                              </span>
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
                              {t("checkout.address.zip")}{" "}
                              <span className="text-red">
                                {t("checkout.address.required")}
                              </span>
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
                    {profile.addresses?.map((address: Address, i) => (
                      <div key={i}>
                        <button
                          type="button"
                          className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${
                            activeAddress === "shipping" + i ? "active" : ""
                          }`}
                          onClick={() => handleActiveAddress("shipping" + i)}
                        >
                          <strong className="heading6">
                            {t("checkout.address.mainAddress")} {i + 2}
                          </strong>
                          {activeAddress === "shipping" + i && (
                            <div className="ms-auto pe-2 text-success font-bold">
                              {t("checkout.address.chosenAddress")}
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
                          <Icon.CaretDown className="text-2xl ic_down duration-300" />
                        </button>
                        <form
                          className="otherAddresses"
                          data-id={address.id}
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <div
                            className={`form_address ${
                              activeAddress === "shipping" + i
                                ? "block"
                                : "hidden"
                            }`}
                          >
                            <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                              <div className="street">
                                <label
                                  htmlFor={"shippingStreet" + i}
                                  className="caption1 capitalize"
                                >
                                  {t("checkout.address.streetName")}{" "}
                                  <span className="text-red">
                                    {t("checkout.address.required")}
                                  </span>
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
                                  {t("checkout.address.city")}{" "}
                                  <span className="text-red">
                                    {t("checkout.address.required")}
                                  </span>
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
                                  {t("checkout.address.houseNumber")}{" "}
                                  <span className="text-red">
                                    {t("checkout.address.required")}
                                  </span>
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
                                  {t("checkout.address.zip")}{" "}
                                  <span className="text-red">
                                    {t("checkout.address.required")}
                                  </span>
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
                    ))}
                    <div className="block-button lg:mt-10 mt-6">
                      <form
                        className="newAddress"
                        onSubmit={(e) => {
                          e.preventDefault();
                          addAddress(e.currentTarget);
                        }}
                      >
                        <div
                          className={`form_address ${
                            newForm ? "block" : "hidden"
                          }`}
                        >
                          <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                            <div className="street">
                              <label
                                htmlFor={"newshippingStreet"}
                                className="caption1 capitalize"
                              >
                                {t("checkout.address.streetName")}{" "}
                                <span className="text-red">
                                  {t("checkout.address.required")}
                                </span>
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
                                {t("checkout.address.city")}{" "}
                                <span className="text-red">
                                  {t("checkout.address.required")}
                                </span>
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
                                {t("checkout.address.houseNumber")}{" "}
                                <span className="text-red">
                                  {t("checkout.address.required")}
                                </span>
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
                                {t("checkout.address.zip")}{" "}
                                <span className="text-red">
                                  {t("checkout.address.required")}
                                </span>
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
                            {t("checkout.address.save")}
                          </button>
                        </div>
                      </form>
                      <button
                        onClick={() => {
                          changeAddress();
                        }}
                        className="button-main"
                      >
                        {t("checkout.address.updateAddress")}
                      </button>
                      <button
                        onClick={() => {
                          setNewForm(!newForm);
                        }}
                        className="ms-4 button-main"
                      >
                        {!newForm
                          ? t("checkout.address.addAddress")
                          : t("checkout.address.removeAddress")}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="left md:w-2/3 w-full ps-2.5 items-center flex flex-col mt-[15%]">
                  <div className="text-[24px] text-center font-medium">
                    {t("checkout.activation.title")}
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
                      {t("checkout.activation.activate")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="right w-5/12">
              <div className="checkout-block">
                <div className="heading5 pb-3">{t("checkout.order.title")}</div>
                <div className="list-product-checkout">
                  {cartState.cartArray.length < 1 ? (
                    <p className="text-button pt-3">
                      {t("checkout.order.noProducts")}
                    </p>
                  ) : (
                    cartState.cartArray.map((product) => (
                      <div
                        key={product.id}
                        className="item flex items-center justify-between w-full pb-5 border-b border-line gap-6 mt-5"
                      >
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
                            <span className="quantity">{product.quantity}</span>
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
                  <div className="text-title">
                    {t("checkout.order.discounts")}
                  </div>
                  <div className="text-title">
                    -$
                    <span className="discount">{discount ? discount : 0}</span>
                  </div>
                </div>
                <div className="ship-block py-5 flex justify-between border-b border-line">
                  <div className="text-title">
                    {t("checkout.order.shipping")}
                  </div>
                  <div className="text-title">
                    {Number(ship) === 0 ? "Free" : `$${ship}`}
                  </div>
                </div>
                <div className="total-cart-block pt-5 flex justify-between">
                  <div className="heading5">{t("checkout.order.total")}</div>
                  <div className="heading5 total-cart">
                    ${totalCart - Number(discount) + Number(ship)}
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
                {t("checkout.order.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
