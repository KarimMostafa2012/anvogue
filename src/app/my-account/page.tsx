"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Console } from "console";
import { ProductType } from "@/type/ProductType";
import { tree } from "next/dist/build/templates/app-page";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  zip_code?: string;
  addresses?: [];
  profile_img?: string;
  // Add other expected properties here
}

type Order = {
  id: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: {
      street_name: string;
      house_num: string;
      city: string;
      zip_code: string;
    };
  };
  order_items: [
    {
      id: number;
      order: string;
      color: string;
      product: ProductType;
    }
  ];
  notes: string;
  total: string;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
};

const MyAccount = () => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string | undefined>("dashboard");
  const [activeAddress, setActiveAddress] = useState<string | null>("billing");
  const [activeOrders, setActiveOrders] = useState<string | undefined>("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openDetail, setOpenDetail] = useState<boolean | undefined>(false);
  const [newForm, setNewForm] = useState<boolean | undefined>(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [cancel, setCancel] = useState<{
    state: boolean;
    id: null | string | number;
  }>({ state: false, id: null });
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  //   const router = useRouter();
  const searchParams = useSearchParams();
  let numConf = 0;
  const handleActiveAddress = (order: string) => {
    setActiveAddress((prevOrder) => (prevOrder === order ? null : order));
  };

  const handleActiveOrders = (order: string) => {
    setActiveOrders(order);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.sessionStorage.removeItem("loggedIn");
    window.sessionStorage.removeItem("refreshToken");
    window.sessionStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const currentLanguage = useSelector((state: RootState) => state.language);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `https://api.malalshammobel.com/auth/api/users/me/`,
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

  useEffect(() => {
    fetchProfile();
  }, [currentLanguage]);

  useEffect(() => {
    if (searchParams.get("uid") && searchParams.get("token")) {
      fetch("https://api.malalshammobel.com/auth/api/users/activation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: searchParams.get("uid"),
          token: searchParams.get("token"),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
          } else {
            fetch(`https://api.malalshammobel.com/order/`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${
                  window.localStorage.getItem("accessToken")
                    ? window.localStorage.getItem("accessToken")
                    : window.sessionStorage.getItem("accessToken")
                }`,
                "Content-Type": "application/json",
              },
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
                return response.json();
              })
              .then((data) => {
                setOrders(data);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (profile.verified) {
      const currentLang = localStorage.getItem("language") || "en";
      fetch(`https://api.malalshammobel.com/order/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken")
              ? window.localStorage.getItem("accessToken")
              : window.sessionStorage.getItem("accessToken")
          }`,
          "Content-Type": "application/json",
        },
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
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    console.log(orders)
  }, []);

  useEffect(() => {
    if (profile.verified) {
      fetch(`https://api.malalshammobel.com/order/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken")
              ? window.localStorage.getItem("accessToken")
              : window.sessionStorage.getItem("accessToken")
          }`,
          "Content-Type": "application/json",
        },
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
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setOrders(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [profile.verified]);

  useEffect(() => {
    if (activeOrders != "") {
      const filtered = orders.filter((order) => order.status === activeOrders);
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [activeOrders, orders]);

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

  const deleteAddress = (ev: HTMLFormElement) => {
    fetch(
      `https://api.malalshammobel.com/auth/api/addresses/${ev.getAttribute(
        "data-id"
      )}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken")
              ? window.localStorage.getItem("accessToken")
              : window.sessionStorage.getItem("accessToken")
          }`,
          "Content-Type": "application/json",
        },
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
          fetchProfile();
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

  const updateProfile = (e: HTMLFormElement) => {
    const form = e.querySelectorAll("input");
    const formData = new FormData(e);

    // Handle password match
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (password && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!password) {
      formData.delete("password");
      formData.delete("confirm_password");
      formData.delete("old_password");
    }

    const file = formData.get("profile_img");

    if (file && file instanceof File && file.name) {
      console.log(`✅ Image selected: ${file.name}`);
    } else {
      formData.delete("profile_img"); // Optionally clean it up
    }

    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: [File] name="${value.name}", type="${value.type}"`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    fetch("https://api.malalshammobel.com/auth/api/users/me/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${
          window.localStorage.getItem("accessToken")
            ? window.localStorage.getItem("accessToken")
            : window.sessionStorage.getItem("accessToken")
        }`,
      },
      body: formData,
      // admin123!
      // admin1234!
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
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleOpenDetail = (id: string) => {
    setOpenDetail(true);
    orders.forEach((order) => {
      if (order.id == id) {
        setDetailOrder(order);
      }
    });

    // Calculate total offer value
    const totalOfferValue = orders.reduce((total, order) => {
      return order.order_items.reduce((orderTotal, item) => {
        if (item.product.has_offer && item.product.offer_value) {
          // Multiply offer_value by quantity to get total discount for this item
          return orderTotal + item.product.offer_value * item.product.quantity;
        }
        return orderTotal;
      }, total);
    }, 0);

    setTotalDiscount(totalOfferValue);
  };

  const handleSetCancel = (id: string | number) => {
    setCancel({ state: true, id: id });
  };

  const cancelOrder = async () => {
    if (!cancel.id) {
      console.warn("No order ID to cancel.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.malalshammobel.com/order/${cancel.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${
              window.localStorage.getItem("accessToken") ||
              window.sessionStorage.getItem("accessToken")
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({status: "Retroactive"})
        }
      );

      if (!response.ok) {
        if (Number(response.status) == 401) {
          window.localStorage.removeItem("accessToken");
          window.sessionStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          window.sessionStorage.removeItem("refreshToken");
          window.location.href = "/login";
        } else {
          const errorText = await response.text();
          console.error("Failed response:", response.status, errorText);
          throw new Error("Failed to cancel order");
        }
      } else {
        fetch(`https://api.malalshammobel.com/order/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              window.localStorage.getItem("accessToken")
                ? window.localStorage.getItem("accessToken")
                : window.sessionStorage.getItem("accessToken")
            }`,
            "Content-Type": "application/json",
          },
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
            return response.json();
          })
          .then((data) => {
            console.log(data);
            setOrders(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        setCancel((prev) => ({ ...prev, state: false }));
        fetchProfile()
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="My Account" subHeading="My Account" />
      </div>
      <div className="profile-block md:py-20 py-10">
        <div className="container">
          <div className="content-main flex gap-y-8 max-md:flex-col w-full">
            <div className="left md:w-1/3 w-full xl:pe-[3.125rem] lg:pe-[28px] md:pe-[16px]">
              <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                <div className="heading flex flex-col items-center justify-center">
                  <div className="avatar">
                    <Image
                      src={
                        profile.profile_img
                          ? profile.profile_img
                          : "/images/avatar/avatar.png"
                      }
                      width={300}
                      height={300}
                      alt="avatar"
                      className="md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full object-cover"
                    />
                  </div>
                  <div className="name heading6 mt-4 text-center">
                    {profile.first_name} {profile.last_name}
                  </div>
                  <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">
                    {profile.email}
                  </div>
                  <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">
                    {profile.phone_number}
                  </div>
                  <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">
                    Balance: €{profile.balance}
                  </div>
                </div>
                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${
                      activeTab === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <Icon.HouseLine size={20} />
                    <strong className="heading6">Dashboard</strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${
                      activeTab === "orders" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <Icon.Package size={20} />
                    <strong className="heading6">History Orders</strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${
                      activeTab === "address" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("address")}
                  >
                    <Icon.Tag size={20} />
                    <strong className="heading6">My Address</strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${
                      activeTab === "setting" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("setting")}
                  >
                    <Icon.GearSix size={20} />
                    <strong className="heading6">Update Profile</strong>
                  </Link>
                  <Link
                    href={"/login"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5"
                  >
                    <Icon.SignOut size={20} />
                    <strong className="heading6">Logout</strong>
                  </Link>
                </div>
              </div>
            </div>
            {profile.verified ? (
              <div className="right md:w-2/3 w-full ps-2.5">
                <div
                  className={`tab text-content w-full ${
                    activeTab === "dashboard" ? "block" : "hidden"
                  }`}
                >
                  <div className="overview grid sm:grid-cols-3 gap-5">
                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                      <div className="counter">
                        <span className="text-secondary">Awaiting Pickup</span>
                        <h5 className="heading5 mt-1">
                          {orders.length > 0
                            ? orders.map((retro, i) => {
                                if (i == 0) {
                                  numConf = 0;
                                }
                                if (retro.status == "Confirmed") {
                                  numConf++;
                                }
                                if (i == orders.length - 1) {
                                  return numConf;
                                }
                              })
                            : 0}
                        </h5>
                      </div>
                      <Icon.HourglassMedium className="text-4xl" />
                    </div>
                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                      <div className="counter">
                        <span className="text-secondary">
                          Retroactive Order
                        </span>
                        <h5 className="heading5 mt-1">
                          {orders.length > 0
                            ? orders.map((retro, i) => {
                                if (i == 0) {
                                  numConf = 0;
                                }
                                if (retro.status == "Retroactive") {
                                  numConf++;
                                }
                                if (i == orders.length - 1) {
                                  return numConf;
                                }
                              })
                            : 0}
                        </h5>
                      </div>
                      <Icon.ReceiptX className="text-4xl" />
                    </div>
                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                      <div className="counter">
                        <span className="text-secondary">
                          Total Number of Orders
                        </span>
                        <h5 className="heading5 mt-1">{orders.length}</h5>
                      </div>
                      <Icon.Package className="text-4xl" />
                    </div>
                  </div>
                  <div className="recent_order pt-5 px-5 pb-2 mt-7 border border-line rounded-xl">
                    <h6 className="heading6">Recent Orders</h6>
                    <div className="list overflow-x-auto w-full mt-5">
                      <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px]">
                        <thead className="border-b border-line">
                          <tr>
                            <th
                              scope="col"
                              className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap"
                            >
                              Payment Status
                            </th>
                            <th
                              scope="col"
                              className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap"
                            >
                              Pricing
                            </th>
                            <th
                              scope="col"
                              className="pb-3 text-right text-sm font-bold uppercase text-secondary whitespace-nowrap"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        {filteredOrders.length > 0 ? (
                          <tbody>
                            {filteredOrders.map((order, i) => {
                              if (i > 4) {
                                return;
                              }
                              return (
                                <tr
                                  key={i}
                                  className={
                                    "item duration-300 " +
                                    (filteredOrders.length - 1 == i
                                      ? ""
                                      : "border-b border-line")
                                  }
                                >
                                  <td className="py-3">
                                    <div className="info flex flex-col">
                                      <strong className="product_name text-button">
                                        {order.payment_status}
                                      </strong>
                                    </div>
                                  </td>
                                  <td className="py-3 price">{order.total}</td>
                                  <td className="py-3 text-right">
                                    <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-yellow text-yellow caption1 font-semibold">
                                      {order.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        ) : (
                          <div>No Orders Found</div>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
                <div
                  className={`tab text-content overflow-hidden w-full p-7 border border-line rounded-xl ${
                    activeTab === "orders" ? "block" : "hidden"
                  }`}
                >
                  <h6 className="heading6">Your Orders</h6>
                  <div className="w-full overflow-x-auto">
                    <div className="menu-tab grid grid-cols-4 max-lg:w-[500px] border-b border-line mt-3">
                      {["all", "Confirmed", "Delivered", "Retroactive"].map(
                        (item, index) => (
                          <button
                            key={index}
                            className={`item relative px-3 py-2.5 text-secondary text-center duration-300 hover:text-black border-b-2 ${
                              (activeOrders == "" ? "all" : activeOrders) ===
                              item
                                ? "active border-black"
                                : "border-transparent"
                            }`}
                            onClick={() =>
                              handleActiveOrders(item == "all" ? "" : item)
                            }
                          >
                            <span className="relative text-button z-[1]">
                              {item}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div className="list_order">
                    {filteredOrders.map((order) => {
                      return (
                        <div
                          key={order.id}
                          className="order_item mt-5 border border-line rounded-lg box-shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                            <div className="flex items-center gap-2">
                              <strong className="text-title">
                                Payment Status:
                              </strong>
                              <strong className="order_number text-button uppercase">
                                {order.payment_status}
                              </strong>
                            </div>
                            <div className="flex items-center gap-2">
                              <strong className="text-title">
                                Order status:
                              </strong>
                              <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-purple text-purple caption1 font-semibold">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="list_prd px-5">
                            {order.order_items.map((item) => {
                              return (
                                <div
                                  key={item.id}
                                  className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line"
                                >
                                  <Link
                                    href={
                                      "/product/variable?id=" + item.product.id
                                    }
                                    className="flex items-center gap-5"
                                  >
                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                      <Image
                                        src={item.product.images[0].img}
                                        width={1000}
                                        height={1000}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="prd_name text-title">
                                        {item.product.name}
                                      </div>
                                      <div className="caption1 text-secondary mt-2">
                                        {item.product.size && (
                                          <>
                                            <span className="prd_size uppercase">
                                              {item.product.size}
                                            </span>
                                            <span> / </span>
                                          </>
                                        )}
                                        <span className="prd_color capitalize">
                                          {item.color}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                  <div className="text-title">
                                    <span className="prd_quantity">
                                      {item.product.quantity}
                                    </span>
                                    <span> X </span>
                                    <span className="prd_price">
                                      $
                                      {item.product.new_price
                                        ? item.product.new_price
                                        : item.product.price}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap gap-4 p-5">
                            <button
                              className="button-main"
                              onClick={() => handleOpenDetail(order.id)}
                            >
                              Order Details
                            </button>
                            {order?.status.toLowerCase() != "retroactive" && (
                              <button
                                className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white"
                                onClick={() => {
                                  handleSetCancel(order.id);
                                }}
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div
                  className={`tab_address text-content w-full p-7 border border-line rounded-xl ${
                    activeTab === "address" ? "block" : "hidden"
                  }`}
                >
                  <form id="mainForm">
                    <button
                      type="button"
                      className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${
                        activeAddress === "mainShipping" ? "active" : ""
                      }`}
                      onClick={() => handleActiveAddress("mainShipping")}
                    >
                      <strong className="heading6">Main address</strong>
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
                      <>
                        <button
                          key={i}
                          type="button"
                          className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${
                            activeAddress === "shipping" + i ? "active" : ""
                          }`}
                          onClick={() => handleActiveAddress("shipping" + i)}
                        >
                          <strong className="heading6">
                            Shipping address {i + 2}
                          </strong>
                          <Icon.CaretDown className="text-2xl ic_down duration-300" />
                        </button>
                        <form
                          className="otherAddresses"
                          data-id={address.id}
                          onSubmit={(e) => {
                            e.preventDefault();
                            deleteAddress(e.currentTarget);
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
                            <button
                              className="bg-red p-[8px] rounded-[4px] mt-[12px] ms-auto block cursor-pointer"
                              data-id={address.id}
                              type="submit"
                            >
                              <svg
                                className="fill-white w-[12px]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                              >
                                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                              </svg>
                            </button>
                          </div>
                        </form>
                      </>
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
                <div
                  className={`tab text-content w-full p-7 border border-line rounded-xl ${
                    activeTab === "setting" ? "block" : "hidden"
                  }`}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateProfile(e.currentTarget);
                    }}
                  >
                    <div className="heading5 pb-4">Information</div>
                    <div className="upload_image col-span-full">
                      <label htmlFor="uploadImage">
                        Upload Avatar: <span className="text-red">*</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-5 mt-3">
                        <div className="bg_img flex-shrink-0 rounded-full relative w-[7.5rem] h-[7.5rem] overflow-hidden bg-surface">
                          <span className="ph ph-image text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary"></span>
                          <label
                            htmlFor="uploadImage"
                            className="cursor-pointer"
                          >
                            <Image
                              src={
                                profile.profile_img
                                  ? profile.profile_img
                                  : "/images/avatar/avatar.png"
                              }
                              width={300}
                              height={300}
                              alt="avatar"
                              className="upload_img relative z-[1] w-full h-full object-cover"
                            />
                          </label>
                        </div>
                        <div>
                          <strong className="text-button">Upload File:</strong>
                          <p className="caption1 text-secondary mt-1">
                            JPG or PNG 300x300px
                          </p>
                          <div className="upload_file flex items-center gap-3 w-[220px] mt-3 px-3 py-2 border border-line rounded">
                            <label
                              htmlFor="uploadImage"
                              className="caption2 py-1 px-3 rounded bg-line whitespace-nowrap cursor-pointer"
                            >
                              Choose File
                            </label>
                            <input
                              type="file"
                              name="profile_img"
                              accept="image/*"
                              className="caption2 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 gap-y-5 mt-5">
                      <div className="first-name">
                        <label
                          htmlFor="firstName"
                          className="caption1 capitalize"
                        >
                          First Name <span className="text-red">*</span>
                        </label>
                        <input
                          className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                          id="firstName"
                          name="first_name"
                          type="text"
                          defaultValue={profile.first_name}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="last-name">
                        <label
                          htmlFor="lastName"
                          className="caption1 capitalize"
                        >
                          Last Name <span className="text-red">*</span>
                        </label>
                        <input
                          className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                          id="lastName"
                          name="last_name"
                          type="text"
                          defaultValue={profile.last_name}
                          placeholder="Last name"
                          required
                        />
                      </div>
                      <div className="phone-number">
                        <label
                          htmlFor="phoneNumber"
                          className="caption1 capitalize"
                        >
                          Phone Number <span className="text-red">*</span>
                        </label>
                        <input
                          className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                          id="phoneNumber"
                          name="phone_number"
                          type="text"
                          defaultValue={profile.phone_number}
                          placeholder="Phone number"
                          required
                        />
                      </div>
                      <div className="email">
                        <label htmlFor="email" className="caption1 capitalize">
                          Email Address <span className="text-red">*</span>
                        </label>
                        <input
                          className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={profile.email}
                          placeholder="Email address"
                          required
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="heading5 pb-4 lg:mt-10 mt-6">
                      Change Password
                    </div>
                    <div className="pass">
                      <label htmlFor="password" className="caption1">
                        Current password <span className="text-red">*</span>
                      </label>
                      <input
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                        id="password"
                        name="old_password"
                        type="password"
                        placeholder="Password *"
                      />
                    </div>
                    <div className="new-pass mt-5">
                      <label htmlFor="newPassword" className="caption1">
                        New password
                      </label>
                      <input
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                        id="newPassword"
                        name="password"
                        type="password"
                        placeholder="New Password"
                      />
                    </div>
                    <div className="confirm-pass mt-5">
                      <label htmlFor="confirmPassword" className="caption1">
                        Confirm new password
                      </label>
                      <input
                        className="border-line mt-2 px-4 py-3 w-full rounded-lg"
                        id="confirmPassword"
                        name="confirm_password"
                        type="password"
                        placeholder="Confirm Password"
                      />
                    </div>
                    <div className="block-button lg:mt-10 mt-6">
                      <button className="button-main">Save Change</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="right md:w-2/3 w-full ps-2.5 items-center flex flex-col mt-[15%]">
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
        </div>
      </div>
      <Footer />
      <div
        className={`modal-order-detail-block flex items-center justify-center`}
        onClick={() => setOpenDetail(false)}
      >
        <div
          className={`modal-order-detail-main grid grid-cols-2 w-[1160px] bg-white rounded-2xl ${
            openDetail ? "open" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="info p-10 border-r border-line">
            <h5 className="heading5">Order Details</h5>
            <div className="list_info grid grid-cols-2 gap-10 gap-y-8 mt-5">
              <div className="info_item">
                <strong className="text-button-uppercase text-secondary">
                  Contact Information
                </strong>
                <h6 className="heading6 order_name mt-2">
                  {detailOrder?.user.first_name} {detailOrder?.user.last_name}
                </h6>
                <h6 className="heading6 order_phone mt-2">
                  {detailOrder?.user.phone_number}
                </h6>
                <h6 className="heading6 normal-case order_email mt-2">
                  {detailOrder?.user.email}
                </h6>
              </div>
              {/* <div className="info_item">
                <strong className="text-button-uppercase text-secondary">
                  Payment method
                </strong>
                <h6 className="heading6 order_payment mt-2">{detailOrder?.user}</h6>
              </div> */}
              <div className="info_item">
                <strong className="text-button-uppercase text-secondary">
                  Billing address
                </strong>
                <h6 className="heading6 order_billing_address mt-2">
                  {detailOrder?.user.address.house_num}{" "}
                  {detailOrder?.user.address.street_name} Rd <br />
                  {detailOrder?.user.address.city},{" "}
                  {detailOrder?.user.address.zip_code}
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-button-uppercase text-secondary">
                  Payment Status
                </strong>
                <h6 className="heading6 order_shipping_address mt-2">
                  {detailOrder?.payment_status}
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-button-uppercase text-secondary">
                  Delivery
                </strong>
                <h6 className="heading6 order_company mt-2">
                  {detailOrder?.status}
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-button-uppercase text-secondary">
                  Order Date
                </strong>
                <h6 className="heading6 order_company mt-2">
                  {detailOrder?.created_at}
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-button-uppercase text-secondary">
                  order Note
                </strong>
                <h6 className="heading6 order_company mt-2">
                  {detailOrder?.notes ? detailOrder?.notes : "no notes writen"}
                </h6>
              </div>
            </div>
          </div>
          <div className="list p-10">
            <h5 className="heading5">Items</h5>
            <div className="list_prd">
              {detailOrder?.order_items.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line"
                  >
                    <Link
                      href={"/product/variable?id=" + item.product.id}
                      className="flex items-center gap-5"
                    >
                      <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={item.product.images[0].img}
                          width={1000}
                          height={1000}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="prd_name text-title">
                          {item.product.name}
                        </div>
                        <div className="caption1 text-secondary mt-2">
                          {item.product.size && (
                            <>
                              <span className="prd_size uppercase">
                                {item.product.size}
                              </span>
                              <span> / </span>
                            </>
                          )}
                          <span className="prd_color capitalize">
                            {item.color}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="text-title">
                      <span className="prd_quantity">
                        {item.product.quantity}
                      </span>
                      <span> X </span>
                      <span className="prd_price">${item.product.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-5">
              <strong className="text-title">Shipping</strong>
              <strong className="order_ship text-title">Free</strong>
            </div>
            <div className="flex items-center justify-between mt-4">
              <strong className="text-title">Discounts</strong>
              <strong className="order_discounts text-title">
                -${totalDiscount}
              </strong>
            </div>
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-line">
              <h5 className="heading5">Subtotal</h5>
              <h5 className="order_total heading5">${detailOrder?.total}</h5>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal-order-detail-block flex items-center justify-center`}
        onClick={() => setCancel((prev) => ({ ...prev, state: false }))}
      >
        <div
          className={`modal-order-detail-main w-fit max-w-[460px] bg-white rounded-2xl ${
            cancel.state == true ? "open" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="info p-10 text-center">
            <h5 className="heading5">Order Details</h5>
            <div className="list_info gap-10 gap-y-8 mt-5">
              <div className="info_item">
                <h6 className="heading6 order_name mt-2">
                  Are you sure, You want to cancel this order ?
                </h6>
                <h6 className="heading6 order_name mt-2">
                  This operation is not reversable and you will get your money
                  back.
                </h6>
                <button
                  onClick={() => {
                    cancelOrder();
                  }}
                  className="button-main mt-6"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
