"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import Product from "@/components/Product/Product";
import productData from "@/data/Product.json";
import useLoginPopup from "@/store/useLoginPopup";
import useSubMenuDepartment from "@/store/useSubMenuDepartment";
import useMenuMobile from "@/store/useMenuMobile";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useModalSearchContext } from "@/context/ModalSearchContext";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getOfferProducts } from "@/redux/slices/productSlice";

type Category = {
  id: number;
  icon?: {
    id: number;
    icon: string;
  };
  name: string;
};

type CategoryOfSub = {
  id: number;
  name: string;
};

type SubCategory = {
  id: number;

  category: CategoryOfSub;

  name: string;
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
  is_superuser?: boolean;
  // Add other expected properties here
}

const useAppDispatch = () => useDispatch<AppDispatch>();

const MenuEight = () => {
  const pathname = usePathname();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openSubMenuDepartment, handleSubMenuDepartment } =
    useSubMenuDepartment();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[] | null>([]);
  const { openModalCart } = useModalCartContext();
  const { cartState } = useCart();
  const { openModalWishlist } = useModalWishlistContext();
  const dispatch = useAppDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile>({});
  let shadowCat = "";
  const products = useSelector(
    (state: RootState) => state.products.offerProducts
  );

  const { t } = useTranslation();
  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const currentLanguage = useSelector((state: RootState) => state.language);
  const [status, setStatus] = useState("Opening dashboard...");

  const goDash = () => {
    let targetWindow: Window | null = null;
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Listen for ready signal from dashboard
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === "https://dashboard.malalshammobel.com" &&
        event.data.type === "DASHBOARD_READY"
      ) {
        setStatus("Dashboard ready - sending data...");
        sendData();
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    window.addEventListener("message", handleMessage);

    const sendData = () => {
      console.log("data");
      try {
        const data = { ...sessionStorage };
        if (targetWindow) {
          targetWindow.postMessage(
            {
              type: "CROSS_DOMAIN_STORAGE",
              payload: data,
              timestamp: Date.now(),
            },
            "https://dashboard.malalshammobel.com"
          );
          setStatus("Data sent successfully!");
        }
      } catch (error: any) {
        setStatus("Failed to send data: " + error.message);
      }
    };

    const openTargetWindow = () => {
      try {
        targetWindow = window.open("https://dashboard.malalshammobel.com/");
        if (!targetWindow) {
          setStatus("Error: Popup was blocked. Please allow popups.");
          return;
        }

        // Start checking for window readiness
        checkInterval = setInterval(() => {
          if (!targetWindow || targetWindow.closed) {
            setStatus("Error: Dashboard window was closed");
            cleanup();
            return;
          }

          try {
            if (targetWindow.location.href !== "about:blank") {
              setStatus("Dashboard loaded - waiting for ready signal...");
            }
          } catch (e) {
            // Still loading, ignore
          }
        }, 200);

        // Extended timeout (10 seconds)
        timeoutId = setTimeout(() => {
          setStatus("Error: Dashboard took too long to load");
          cleanup();
        }, 10000);
      } catch (error: any) {
        setStatus("Error: " + error.message);
      }
    };

    const cleanup = () => {
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("message", handleMessage);
    };

    openTargetWindow();

    return cleanup;
  };

  const handleLogout = () => {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.sessionStorage.removeItem("loggedIn");
    window.sessionStorage.removeItem("refreshToken");
    window.sessionStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          has_offer: true,
          lang: currentLanguage,
        };
        await dispatch(getOfferProducts({ params }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [dispatch, currentLanguage, t]);

  useEffect(() => {
    if (searchParams.get("uid") && searchParams.get("token")) {
      fetch("https://api.malalshammobel.com/auth/api/users/activation/", {
        method: "GET",
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
            console.log("okaaaaay", response);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    fetch(
      `https://api.malalshammobel.com/products/category/?lang=${currentLanguage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          // auth/api/users/me/
        } else {
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentLanguage]);

  useEffect(() => {
    const currentLang = localStorage.getItem("language") || "en";
    fetch(
      `https://api.malalshammobel.com/products/subcategory/?lang=${currentLanguage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log(response);
        } else {
          console.log(response);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSubCategories(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentLanguage]);

  useEffect(() => {
    if (window.sessionStorage.getItem("loggedIn") == "true") {
      setLoggedIn(true);
    } else if (
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken")
    ) {
      // auth/api/users/me/
      fetch("https://api.malalshammobel.com/auth/api/users/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken")
          }`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            // auth/api/users/me/
            fetch("https://api.malalshammobel.com/auth/api/token/refresh/", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh:
                  window.localStorage.getItem("refreshToken") ||
                  window.sessionStorage.getItem("refreshToken"),
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  setLoggedIn(false);
                }
                return response.json();
              })
              .then((data) => {
                console.log(data);
                setLoggedIn(true);
                window.localStorage.setItem("accessToken", data.access);
                window.sessionStorage.setItem("accessToken", data.access);
                window.localStorage.setItem("refreshToken", data.refresh);
                window.sessionStorage.setItem("refreshToken", data.refresh);
                window.sessionStorage.setItem("loggedIn", "true");
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            window.sessionStorage.setItem("loggedIn", "true");
            console.log(response);
            setLoggedIn(true);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken")
    ) {
      fetch("https://api.malalshammobel.com/auth/api/token/refresh/", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh:
            window.localStorage.getItem("refreshToken") ||
            window.sessionStorage.getItem("refreshToken"),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            setLoggedIn(false);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setLoggedIn(true);
          window.localStorage.setItem("accessToken", data.access);
          window.sessionStorage.setItem("accessToken", data.access);
          window.localStorage.setItem("refreshToken", data.refresh);
          window.sessionStorage.setItem("refreshToken", data.refresh);
          window.sessionStorage.setItem("loggedIn", "true");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  useEffect(() => {
    console.log("test");
    if (
      loggedIn ||
      window.sessionStorage.getItem("loggedIn") == "true" ||
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken")
    ) {
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
              window.sessionStorage.removeItem("loggedIn");
            }
          }

          const data = await response.json();
          console.log(data);
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
    console.log(profile);
  }, []);

  const handleSearch = (value: string) => {
    router.push(`/shop?product_name=${value}`);
    setSearchKeyword("");
  };

  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
      setLastScrollPosition(scrollPosition);
    };

    // Gắn sự kiện cuộn khi component được mount
    window.addEventListener("scroll", handleScroll);

    // Hủy sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPosition]);

  const handleSubCategoryClick = (category: string) => {
    router.push(`/shop?sub_category=${category}`);
  };

  const handleTypeClick = (type: string) => {
    router.push(`/shop?type=${type}`);
  };

  return (
    <>
      <div
        className={`header-menu style-eight ${
          fixedHeader ? " fixed" : "relative"
        } bg-white w-full md:h-[74px] h-[56px]`}
      >
        <div className="container mx-auto h-full">
          <div className="header-main flex items-center justify-between h-full">
            <div
              className="menu-mobile-icon lg:hidden flex items-center"
              onClick={handleMenuMobile}
            >
              <i className="icon-category text-2xl"></i>
            </div>
            <Link href={"/"} className="flex items-center">
              <div className="heading4">
                <img src="/images/logo.png" className="h-16" alt="" />
              </div>
            </Link>
            <div className="form-search w-2/3 ps-8 flex items-center h-[44px] max-lg:hidden">
              <div className="w-full flex items-center h-full">
                <input
                  type="text"
                  className="search-input h-full px-4 w-full border border-line"
                  placeholder={t("menu.searchPlaceholder")}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchKeyword)
                  }
                />
                <button
                  className="search-button button-main bg-black h-full flex items-center px-7 rounded-none ltr:rounded-r rtl:rounded-l"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearch(searchKeyword);
                  }}
                >
                  {t("menu.search")}
                </button>
              </div>
            </div>
            <div className="right flex gap-12">
              <div className="list-action flex items-center gap-4">
                <div className="user-icon flex items-center justify-center cursor-pointer">
                  {!loggedIn ||
                  window.sessionStorage.getItem("loggedIn") != "true" ? (
                    <>
                      <Icon.User
                        size={24}
                        color="black"
                        onClick={handleLoginPopup}
                      />
                      <div
                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm 
                                                        ${
                                                          openLoginPopup
                                                            ? "open"
                                                            : ""
                                                        }`}
                      >
                        <Link
                          href={"/login"}
                          className="button-main w-full text-center mt-4"
                        >
                          {t("menu.login")}
                        </Link>
                        <div className="text-secondary text-center mt-3">
                          {t("menu.noAccount")}
                          <Link
                            href={"/register"}
                            className="text-black ps-1 hover:underline"
                          >
                            {t("menu.register")}
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : profile.is_superuser ? (
                    <>
                      <Icon.User
                        size={24}
                        color="black"
                        onClick={handleLoginPopup}
                      />
                      <div
                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm 
                                                        ${
                                                          openLoginPopup
                                                            ? "open"
                                                            : ""
                                                        }`}
                      >
                        <Link
                          href={"/"}
                          onClick={(e) => {
                            e.preventDefault();
                            goDash();
                          }}
                          className="button-main w-full text-center mt-4"
                        >
                          {t("dashboard")}
                        </Link>
                        <div className="text-secondary text-center mt-3">
                          <Link
                            href={"/my-account"}
                            className="text-black ps-1 hover:underline"
                          >
                            {t("account")}
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Icon.User
                        size={24}
                        color="black"
                        onClick={handleLoginPopup}
                      />
                      <div
                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm 
                                                        ${
                                                          openLoginPopup
                                                            ? "open"
                                                            : ""
                                                        }`}
                      >
                        <Link
                          href={"/my-account"}
                          className="button-main w-full text-center"
                        >
                          {t("menu.profile")}
                        </Link>
                        <div className="text-secondary text-center mt-3">
                          <Link
                            href={"/login"}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLogout();
                            }}
                            className="text-black ps-1 hover:underline"
                          >
                            {t("menu.account.logout")}
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div
                  className="max-md:hidden wishlist-icon flex items-center cursor-pointer"
                  onClick={openModalWishlist}
                >
                  <Icon.Heart size={24} color="black" />
                </div>
                <div
                  className="cart-icon flex items-center relative cursor-pointer"
                  onClick={openModalCart}
                >
                  <Icon.Handbag size={24} color="black" />
                  <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartState.cartArray.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="top-nav-menu relative bg-white border-t border-b border-line h-[44px] max-lg:hidden z-10">
        <div className="container h-full">
          <div className="top-nav-menu-main flex items-center justify-between h-full">
            <div className="left flex items-center h-full">
              <div className="menu-department-block relative h-full">
                <div
                  className="menu-department-btn bg-black relative min-w-[212px] flex items-center justify-between sm:gap-16 gap-4 px-4 h-full w-fit cursor-pointer"
                  onClick={handleSubMenuDepartment}
                >
                  <div className="text-button-uppercase text-white whitespace-nowrap">
                    {t("menu.department")}
                  </div>
                  <Icon.CaretDown
                    color="#ffffff"
                    className="text-xl max-sm:text-base"
                  />
                </div>
                <div
                  className={`sub-menu-department absolute top-[44px] left-0 right-0 h-max bg-white rounded-b-2xl ${
                    openSubMenuDepartment ? "open" : ""
                  }`}
                >
                  {categories?.map((cat) => {
                    return (
                      <div key={cat.id} className="item block">
                        <Link
                          href={"/shop/?category=" + cat.name}
                          className="py-1.5 inline-block"
                        >
                          {cat.name}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="menu-main style-eight h-full ps-12 max-lg:hidden">
                <ul className="flex items-center gap-8 h-full">
                  <li className="h-full relative">
                    <Link
                      href="#!"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 
                                            ${
                                              pathname.includes("/")
                                                ? "active"
                                                : ""
                                            }`}
                    >
                      {t("menu.home")}
                    </Link>
                  </li>
                  <li className="h-full">
                    <Link
                      href="#!"
                      className="text-button-uppercase duration-300 h-full flex items-center justify-center"
                    >
                      {t("menu.mobile.features")}
                    </Link>
                    <div className="mega-menu absolute top-[44px] left-0 bg-white w-screen">
                      <div className="container">
                        <div className="flex justify-between py-8">
                          <div className="nav-link basis-2/3 grid grid-cols-4 gap-y-8">
                            {subCategories?.map((subCat) => {
                              let i = 0;
                              let show = shadowCat != subCat.category.name;
                              let onTime = true;
                              shadowCat =
                                shadowCat == subCat.category.name
                                  ? shadowCat
                                  : subCat.category.name;
                              return (
                                show && (
                                  <div className="nav-item" key={subCat.id}>
                                    <div className="text-button-uppercase pb-2">
                                      {subCat.category.name}
                                    </div>
                                    <ul>
                                      {subCategories.map((subCatName, k) => {
                                        if (
                                          subCatName.category.name ==
                                            shadowCat &&
                                          i <= 4
                                        ) {
                                          i++;
                                          return (
                                            <li key={subCatName.id}>
                                              <div
                                                onClick={() =>
                                                  handleSubCategoryClick(
                                                    subCatName.name
                                                  )
                                                }
                                                className={`link text-secondary duration-300 cursor-pointer`}
                                              >
                                                {subCatName.name}
                                              </div>
                                            </li>
                                          );
                                        } else if (i == 5) {
                                          i++;
                                          return (
                                            <li key={subCatName.id}>
                                              <div
                                                onClick={() => {
                                                  window.location.href = "";
                                                }}
                                                className={`link text-secondary duration-300 cursor-pointer`}
                                              >
                                                view more
                                              </div>
                                            </li>
                                          );
                                        }
                                      })}
                                    </ul>
                                  </div>
                                )
                              );
                            })}
                          </div>
                          <div className="banner-ads-block ps-2.5 basis-1/3">
                            {products.length > 0 &&
                              products.slice(0, 2).map((prod, i) => {
                                return (
                                  <div
                                    key={i}
                                    className={
                                      "banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer " +
                                      (i == 1 ? "mt-4" : "")
                                    }
                                    onClick={() => {
                                      router.push(
                                        "/product/variable?id=" + prod.id
                                      );
                                    }}
                                  >
                                    <div className="text-content py-14 ps-8 relative z-[1] max-w-[50%]">
                                      <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                        {t("Save")} ${prod.offer_value}
                                      </div>
                                      <div className="heading6 mt-2">
                                        {prod.name}
                                      </div>
                                      <div className="body1 mt-3 text-secondary">
                                        {t("StartingAt")}{" "}
                                        <span className="text-red">
                                          ${prod.new_price}
                                        </span>
                                      </div>
                                    </div>
                                    <Image
                                      src={prod.images[0].img}
                                      width={200}
                                      height={100}
                                      alt={prod.name}
                                      className="basis-1/3 absolute ltr:right-0 rtl:left-0 top-0 duration-700"
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="h-full">
                    <Link
                      href="/shop"
                      className="text-button-uppercase duration-300 h-full flex items-center justify-center"
                    >
                      {t("menu.mobile.shop")}
                    </Link>
                  </li>
                  <li className="h-full">
                    <Link
                      href="/blog"
                      className="text-button-uppercase duration-300 h-full flex items-center justify-center"
                    >
                      {t("menu.menuEight.blog")}
                    </Link>
                  </li>
                  {/* <li className="h-full relative">
                    <Link
                      href="#!"
                      className="text-button-uppercase duration-300 h-full flex items-center justify-center"
                    >
                      Blog
                    </Link>
                    <div className="sub-menu py-3 px-5 -left-10 absolute bg-white rounded-b-xl">
                      <ul className="w-full">
                        <li>
                          <Link
                            href="/blog/default"
                            className={`text-secondary duration-300 ${pathname === "/blog/default" ? "active" : ""
                              }`}
                          >
                            Blog Default
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/blog/list"
                            className={`text-secondary duration-300 ${pathname === "/blog/list" ? "active" : ""
                              }`}
                          >
                            Blog List
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/blog/grid"
                            className={`text-secondary duration-300 ${pathname === "/blog/grid" ? "active" : ""
                              }`}
                          >
                            Blog Grid
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/blog/detail2"
                            className={`text-secondary duration-300 ${pathname === "/blog/detail2" ? "active" : ""
                              }`}
                          >
                            Blog Detail 1
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/blog/detail2"
                            className={`text-secondary duration-300 ${pathname === "/blog/detail2" ? "active" : ""
                              }`}
                          >
                            Blog Detail 2
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li> */}
                  <li className="h-full relative">
                    <Link
                      href="#!"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/pages") ? "active" : ""
                      }`}
                    >
                      {t("menu.mobile.aboutUs")}
                    </Link>
                    <div className="sub-menu py-3 px-5 -left-10 absolute bg-white rounded-b-xl">
                      <ul className="w-full">
                        <li>
                          <Link
                            href="/pages/about"
                            className={`text-secondary duration-300 ${
                              pathname === "/pages/about" ? "active" : ""
                            }`}
                          >
                            {t("menu.mobile.aboutUs")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/contact"
                            className={`text-secondary duration-300 ${
                              pathname === "/pages/contact" ? "active" : ""
                            }`}
                          >
                            {t("menu.mobile.contactUs")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/store-list"
                            className={`text-secondary duration-300 ${
                              pathname === "/pages/store-list" ? "active" : ""
                            }`}
                          >
                            {t("menu.mobile.storeList")}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/faqs"
                            className={`text-secondary duration-300 ${
                              pathname === "/pages/faqs" ? "active" : ""
                            }`}
                          >
                            {t("menu.mobile.faqs")}
                          </Link>
                        </li>
                        {/* <li>
                          <Link
                            href="/pages/customer-feedbacks"
                            className={`text-secondary duration-300 ${pathname === "/pages/customer-feedbacks"
                              ? "active"
                              : ""
                              }`}
                          >
                            Customer Feedbacks
                          </Link>
                        </li> */}
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="right flex items-center gap-1">
              <div className="caption1">{t("menu.menuEight.hotline")}:</div>
              <div className="text-button-uppercase">+01 1234 8888</div>
            </div>
          </div>
        </div>
      </div>

      <div id="menu-mobile" className={`${openMenuMobile ? "open" : ""}`}>
        <div className="menu-container bg-white h-full">
          <div className="container h-full">
            <div className="menu-main h-full overflow-hidden">
              <div className="heading py-2 relative flex items-center justify-center">
                <div
                  className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                  onClick={handleMenuMobile}
                >
                  <Icon.X size={14} />
                </div>
                <Link
                  href={"/"}
                  className="logo text-3xl font-semibold text-center"
                >
                  <img src="/images/logo.png" className="h-16" alt="" />
                </Link>
              </div>
              <div className="form-search relative mt-2">
                <Icon.MagnifyingGlass
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder={t("Search products")}
                  className=" h-12 rounded-lg border border-line text-sm w-full ps-10 pe-4"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchKeyword)
                  }
                />
              </div>
              <div className="list-nav mt-6">
                <ul>
                  <li
                    className={`${openSubNavMobile === 1 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(1)}
                  >
                    <a
                      href={"#!"}
                      className={`text-xl font-semibold flex items-center justify-between`}
                    >
                      {t("menu.home")}
                    </a>
                  </li>
                  <li
                    className={`${openSubNavMobile === 2 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(2)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      {t("menu.mobile.features")}
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(2)}
                      >
                        <Icon.CaretLeft />
                        {t("menu.mobile.back")}
                      </div>
                      <div className="list-nav-item w-full pt-3 pb-12">
                        <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
                          {subCategories?.map((subCat) => {
                            let i = 0;
                            let show = shadowCat != subCat.category.name;
                            let onTime = true;
                            shadowCat =
                              shadowCat == subCat.category.name
                                ? shadowCat
                                : subCat.category.name;
                            return (
                              show && (
                                <div className="nav-item" key={subCat.id}>
                                  <div className="text-button-uppercase pb-1">
                                    {subCat.category.name}
                                  </div>
                                  <ul>
                                    {subCategories.map((subCatName) => {
                                      if (
                                        subCatName.category.name == shadowCat &&
                                        i <= 4
                                      ) {
                                        i++;
                                        return (
                                          <li key={subCatName.id}>
                                            <div
                                              className={`link text-secondary duration-300 cursor-pointer`}
                                            >
                                              {subCatName.name}
                                            </div>
                                          </li>
                                        );
                                      } else if (i == 5) {
                                        i++;
                                        return (
                                          <li key={subCatName.id}>
                                            <div
                                              className={`link text-secondary duration-300 cursor-pointer`}
                                            >
                                              {t("viewMore")}
                                            </div>
                                          </li>
                                        );
                                      }
                                    })}
                                  </ul>
                                </div>
                              )
                            );
                          })}
                        </div>
                        <div className="banner-ads-block ps-2.5 basis-1/3">
                          {products.length > 0 &&
                            products.slice(0, 2).map((prod, i) => {
                              return (
                                <div
                                  key={i}
                                  className={
                                    "banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer " +
                                    (i == 1 ? "mt-4" : "")
                                  }
                                >
                                  <div className="text-content py-14 ps-8 relative z-[1]">
                                    <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                      {t("Save")} ${prod.offer_value}
                                    </div>
                                    <div className="heading6 mt-2">
                                      {prod.name}
                                    </div>
                                    <div className="body1 mt-3 text-secondary">
                                      {t("StartingAt")}{" "}
                                      <span className="text-red">
                                        ${prod.new_price}
                                      </span>
                                    </div>
                                  </div>
                                  <Image
                                    src={prod.images[0].img}
                                    width={200}
                                    height={100}
                                    alt={prod.name}
                                    className="basis-1/3 absolute ltr:right-0 rtl:left-0 top-0 duration-700"
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${openSubNavMobile === 3 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(3)}
                  >
                    <a
                      href={"/shop"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      {t("menu.shop")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={"/blog"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      {t("menu.menuEight.blog")}
                    </a>
                  </li>
                  {/* <li
                    className={`${openSubNavMobile === 4 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(4)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      {t('menu.product')}
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(4)}
                      >
                        <Icon.CaretLeft />
                        {t("menu.mobile.back")}
                      </div>
                      <div className="list-nav-item w-full pt-3 pb-12">
                        <div className="">
                          <div className="nav-link grid grid-cols-2 gap-5 gap-y-6 justify-between">
                            <div className="nav-item">
                              <div className="text-button-uppercase pb-1">
                                {t('menu.productsFeatures')}
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/default"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/default"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Defaults
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/sale"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/sale"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Sale
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/countdown-timer"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/countdown-timer"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Countdown Timer
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/grouped"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/grouped"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Grouped
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/bought-together"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/bought-together"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Frequently Bought Together
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/out-of-stock"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/out-of-stock"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Out Of Stock
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/variable"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/variable"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Variable
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="nav-item">
                              <div className="text-button-uppercase pb-1">
                                {t('menu.productsFeatures')}
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/external"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/external"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products External
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/on-sale"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/on-sale"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products On Sale
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/discount"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/discount"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products With Discount
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/sidebar"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/sidebar"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products With Sidebar
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/fixed-price"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/fixed-price"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Fixed Price
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="nav-item col-span-2">
                              <div className="text-button-uppercase pb-1">
                                {t('menu.productsLayout')}
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/thumbnail-left"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/thumbnail-left"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Thumbnails Left
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/thumbnail-bottom"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/thumbnail-bottom"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Thumbnails Bottom
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/one-scrolling"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/one-scrolling"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Grid 1 Scrolling
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/two-scrolling"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/two-scrolling"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Grid 2 Scrolling
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/combined-one"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/combined-one"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Combined 1
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/combined-two"}
                                    className={`link text-secondary duration-300 ${pathname === "/product/combined-two"
                                      ? "active"
                                      : ""
                                      }`}
                                  >
                                    Products Combined 2
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li> */}
                  {/* <li
                    className={`${openSubNavMobile === 5 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(5)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      {t("Blog")}
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(5)}
                      >
                        <Icon.CaretLeft />
                        {t("menu.mobile.back")}
                      </div>
                      <div className="list-nav-item w-full pt-2 pb-6">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/blog/default"
                              className={`link text-secondary duration-300 ${pathname === "/blog/default" ? "active" : ""
                                }`}
                            >
                              {t("menu.blog.default")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/list"
                              className={`link text-secondary duration-300 ${pathname === "/blog/list" ? "active" : ""
                                }`}
                            >
                              {t("menu.blog.list")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/grid"
                              className={`link text-secondary duration-300 ${pathname === "/blog/grid" ? "active" : ""
                                }`}
                            >
                              {t("menu.blog.grid")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail1"
                              className={`link text-secondary duration-300 ${pathname === "/blog/detail1" ? "active" : ""
                                }`}
                            >
                              {t("menu.blog.detail1")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail2"
                              className={`link text-secondary duration-300 ${pathname === "/blog/detail2" ? "active" : ""
                                }`}
                            >
                              {t("menu.blog.detail2")}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li> */}
                  <li
                    className={`${openSubNavMobile === 6 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(6)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      {t("menu.mobile.aboutUs")}
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(6)}
                      >
                        <Icon.CaretLeft />
                        {t("menu.mobile.back")}
                      </div>
                      <div className="list-nav-item w-full pt-2 pb-6">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/pages/about"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/about" ? "active" : ""
                              }`}
                            >
                              {t("menu.mobile.aboutUs")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/contact"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/contact" ? "active" : ""
                              }`}
                            >
                              {t("menu.mobile.contactUs")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/store-list"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/store-list" ? "active" : ""
                              }`}
                            >
                              {t("menu.mobile.storeList")}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/faqs"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/faqs" ? "active" : ""
                              }`}
                            >
                              {t("menu.mobile.faqs")}
                            </Link>
                          </li>
                          {/* <li>
                            <Link
                              href="/pages/customer-feedbacks"
                              className={`link text-secondary duration-300 ${pathname === "/pages/customer-feedbacks"
                                ? "active"
                                : ""
                                }`}
                            >
                              Customer Feedbacks
                            </Link>
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="menu_bar fixed bg-white bottom-0 left-0 w-full h-[70px] sm:hidden z-[101]">
        <div className="menu_bar-inner grid grid-cols-4 items-center h-full">
          <Link
            href={"/"}
            className="menu_bar-link flex flex-col items-center gap-1"
          >
            <Icon.House weight="bold" className="text-2xl" />
            <span className="menu_bar-title caption2 font-semibold">Home</span>
          </Link>
          <Link
            href={"/shop"}
            className="menu_bar-link flex flex-col items-center gap-1"
          >
            <Icon.List weight="bold" className="text-2xl" />
            <span className="menu_bar-title caption2 font-semibold">
              Category
            </span>
          </Link>
          <Link
            href={"/shop"}
            className="menu_bar-link flex flex-col items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Icon.MagnifyingGlass weight="bold" className="text-2xl" />
            <span
              className="menu_bar-title caption2 font-semibold"
              onClick={() => {
                handleSearch(searchKeyword);
              }}
            >
              {t("menu.menuEight.search")}
            </span>
          </Link>
          <Link
            href={"/cart"}
            className="menu_bar-link flex flex-col items-center gap-1"
          >
            <div className="icon relative">
              <Icon.Handbag weight="bold" className="text-2xl" />
              <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                {cartState.cartArray.length}
              </span>
            </div>
            <span className="menu_bar-title caption2 font-semibold">Cart</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MenuEight;
