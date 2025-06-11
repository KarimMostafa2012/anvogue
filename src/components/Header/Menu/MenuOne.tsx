"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass, User, Heart, Handbag, X, CaretRight, CaretLeft, House, List } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import Product from "@/components/Product/Product";
import useSubMenuDepartment from "@/store/useSubMenuDepartment";
import productData from "@/data/Product.json";
import useLoginPopup from "@/store/useLoginPopup";
import useMenuMobile from "@/store/useMenuMobile";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import { useModalSearchContext } from "@/context/ModalSearchContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslation } from 'next-i18next';

interface Props {
  props: string;
}

type CategoryOfSub = {
  id: number;
  name: {
    en: string;
    ar: string;
    de: string;
    ckb: string;
    uk: string;
  };
};

type Category = {
  id: number;
  icon?: {
    id: number;
    icon: string;
  };
  translations: {
    en: {
      name: string;
    };
    ar: {
      name: string;
    };
    de: {
      name: string;
    };
    ckb: {
      name: string;
    };
    uk: {
      name: string;
    };
  };
};

type SubCategory = {
  id: number;

  category: CategoryOfSub;

  translations: {
    en: {
      name: string;
    };
    ar: {
      name: string;
    };
    de: {
      name: string;
    };
    ckb: {
      name: string;
    };
    uk: {
      name: string;
    };
  };
};

const MenuOne: React.FC<Props> = ({ props }) => {
  const { t } = useTranslation();
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

  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  let shadowCat = "";
  const { openModalSearch } = useModalSearchContext();

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
    fetch("https://api.malalshammobel.com/products/category/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
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
  }, []);

  useEffect(() => {
    fetch("https://api.malalshammobel.com/products/subcategory/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
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
  }, []);

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
                window.sessionStorage.setItem("loggedIn", "true");
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            window.sessionStorage.setItem("loggedIn", "true");
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
          window.sessionStorage.setItem("loggedIn", "true");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  const handleSearch = (value: string) => {
    router.push(`/shop?product_name=${value}`);
    setSearchKeyword("");
  };

  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

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
    router.push(`/shop/breadcrumb1?type=${type}`);
  };

  return (
    <>
      <div
        className={`header-menu style-one ${
          fixedHeader ? "fixed" : "absolute"
        } top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props}`}
      >
        <div className="container mx-auto h-full">
          <div className="header-main flex justify-between h-full">
            <div
              className="menu-mobile-icon lg:hidden flex items-center"
              onClick={handleMenuMobile}
            >
              <i className="icon-category text-2xl"></i>
            </div>
            <div className="left flex items-center gap-16">
              <Link
                href={"/"}
                className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
              >
                <div className="heading4">Anvogue</div>
              </Link>
              <div className="menu-main h-full max-lg:hidden">
                <ul className="flex items-center gap-8 h-full">
                  <li className="h-full relative">
                    <Link
                      href="/"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${
                        pathname === "/" ? "active" : ""
                      }`}
                    >
                      {t('header.home')}
                    </Link>
                  </li>
                  <li className="h-full">
                    <Link
                      href="#!"
                      className="text-button-uppercase duration-300 h-full flex items-center justify-center"
                    >
                      {t('header.features')}
                    </Link>
                    <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                      <div className="container">
                        <div className="flex justify-between py-8">
                          <div className="nav-link basis-2/3 grid grid-cols-4 gap-y-8">
                            {subCategories?.map((subCat) => {
                              let i = 0;
                              let show = shadowCat != subCat.category.name.en;
                              let onTime = true;
                              shadowCat =
                                shadowCat == subCat.category.name.en
                                  ? shadowCat
                                  : subCat.category.name.en;
                              return (
                                show && (
                                  <div className="nav-item" key={subCat.id}>
                                    <div className="text-button-uppercase pb-2">
                                      {subCat.category.name.en}
                                    </div>
                                    <ul>
                                      {subCategories.map((subCatName) => {
                                        if (
                                          subCatName.category.name.en ==
                                            shadowCat &&
                                          i <= 4
                                        ) {
                                          i++;
                                          return (
                                            <li key={subCatName.id}>
                                              <div
                                                onClick={() =>
                                                  handleSubCategoryClick(
                                                    subCatName.translations.en
                                                      .name
                                                  )
                                                }
                                                className={`link text-secondary duration-300 cursor-pointer`}
                                              >
                                                {
                                                  subCatName.translations.en
                                                    .name
                                                }
                                              </div>
                                            </li>
                                          );
                                        } else if (i == 5) {
                                          i++;
                                          return (
                                            <li key={subCatName.id}>
                                              <div
                                                onClick={() => {
                                                  window.location.href = "/shop";
                                                }}
                                                className={`link text-secondary duration-300 cursor-pointer`}
                                              >
                                                {t('header.viewMore')}
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
                          <div className="banner-ads-block pl-2.5 basis-1/3">
                            <div
                              className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer"
                              onClick={() => handleTypeClick("swimwear")}
                            >
                              <div className="text-content py-14 pl-8 relative z-[1]">
                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                  {t('header.save')} $10
                                </div>
                                <div className="heading6 mt-2">
                                  {t('header.diveIntoSavings')} <br />
                                  {t('header.onSwimwear')}
                                </div>
                                <div className="body1 mt-3 text-secondary">
                                  {t('header.startingAt')}{" "}
                                  <span className="text-red">$59.99</span>
                                </div>
                              </div>
                              <Image
                                src={"/images/slider/bg2-2.png"}
                                width={200}
                                height={100}
                                alt="bg-img"
                                className="basis-1/3 absolute right-0 top-0 duration-700"
                              />
                            </div>
                            <div
                              className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer mt-8"
                              onClick={() => handleTypeClick("accessories")}
                            >
                              <div className="text-content py-14 pl-8 relative z-[1]">
                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                  {t('header.save')} $10
                                </div>
                                <div className="heading6 mt-2">
                                  20% {t('header.off')} <br />
                                  {t('header.accessories')}
                                </div>
                                <div className="body1 mt-3 text-secondary">
                                  {t('header.startingAt')}{" "}
                                  <span className="text-red">$59.99</span>
                                </div>
                              </div>
                              <Image
                                src={"/images/other/bg-feature.png"}
                                width={200}
                                height={100}
                                alt="bg-img"
                                className="basis-1/3 absolute right-0 top-0 duration-700"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="h-full">
                    <Link
                      href="/shop"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/shop") ? "active" : ""
                      }`}
                    >
                      {t('header.shop')}
                    </Link>
                  </li>
                  <li className="h-full">
                    <Link
                      href="#!"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/product/") ? "active" : ""
                      }`}
                    >
                      {t('header.product')}
                    </Link>
                    <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                      <div className="container">
                        <div className="nav-link w-full flex justify-between py-8">
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-2">
                              {t('header.productsFeatures')}
                            </div>
                            <ul>
                              <li>
                                <Link
                                  href={"/product/default"}
                                  className={`link text-secondary duration-300 ${
                                    pathname === "/product/default"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  {t('header.defaultProduct')}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/product/variable"}
                                  className={`link text-secondary duration-300 ${
                                    pathname === "/product/variable"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  {t('header.variableProduct')}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/product/grouped"}
                                  className={`link text-secondary duration-300 ${
                                    pathname === "/product/grouped"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  {t('header.groupedProduct')}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/product/external"}
                                  className={`link text-secondary duration-300 ${
                                    pathname === "/product/external"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  {t('header.externalProduct')}
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="h-full relative">
                    <Link
                      href="#!"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/blog") ? "active" : ""
                      }`}
                    >
                      {t('header.blog.title')}
                    </Link>
                    <div className="sub-menu py-3 px-5 -left-10 absolute bg-white rounded-b-xl">
                      <ul className="w-full">
                        <li>
                          <Link
                            href="/blog/default"
                            className={`link text-secondary duration-300 ${
                              pathname === "/blog/default" ? "active" : ""
                            }`}
                          >
                            {t('header.blog.default')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/blog/list"
                            className={`link text-secondary duration-300 ${
                              pathname === "/blog/list" ? "active" : ""
                            }`}
                          >
                            {t('header.blog.list')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/blog/grid"
                            className={`link text-secondary duration-300 ${
                              pathname === "/blog/grid" ? "active" : ""
                            }`}
                          >
                            {t('header.blog.grid')}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="h-full relative">
                    <Link
                      href="/pages"
                      className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                        pathname.includes("/pages") ? "active" : ""
                      }`}
                    >
                      {t('header.pages.title')}
                    </Link>
                    <div className="sub-menu py-3 px-5 -left-10 absolute bg-white rounded-b-xl">
                      <ul className="w-full">
                        <li>
                          <Link
                            href="/pages/about"
                            className={`link text-secondary duration-300 ${
                              pathname === "/pages/about" ? "active" : ""
                            }`}
                          >
                            {t('header.pages.about')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/contact"
                            className={`link text-secondary duration-300 ${
                              pathname === "/pages/contact" ? "active" : ""
                            }`}
                          >
                            {t('header.pages.contact')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/store-list"
                            className={`link text-secondary duration-300 ${
                              pathname === "/pages/store-list" ? "active" : ""
                            }`}
                          >
                            {t('header.pages.storeList')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/page-not-found"
                            className={`link text-secondary duration-300 ${
                              pathname === "/pages/page-not-found"
                                ? "active"
                                : ""
                            }`}
                          >
                            {t('header.pages.notFound')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/faqs"
                            className={`link text-secondary duration-300 ${
                              pathname === "/pages/faqs" ? "active" : ""
                            }`}
                          >
                            {t('header.pages.faqs')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/coming-soon"
                            className={`link text-secondary duration-300 ${
                              pathname === "/pages/coming-soon"
                                ? "active"
                                : ""
                            }`}
                          >
                            {t('header.pages.comingSoon')}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/pages/customer-feedbacks"
                            className={`link text-secondary duration-300 ${
                              pathname === "/pages/customer-feedbacks"
                                ? "active"
                                : ""
                            }`}
                          >
                            {t('header.pages.customerFeedbacks')}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="right flex gap-12">
              <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                <MagnifyingGlass
                  size={24}
                  color="black"
                  onClick={openModalSearch}
                />
                <div className="line absolute bg-line w-px h-6 -right-6"></div>
              </div>
              <div className="list-action flex items-center gap-4">
                <div className="user-icon flex items-center justify-center cursor-pointer">
                  {!loggedIn ||
                  window.sessionStorage.getItem("loggedIn") != "true" ? (
                    <>
                      <User
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
                          className="button-main w-full text-center"
                        >
                          Login
                        </Link>
                        <div className="text-secondary text-center mt-3 pb-4">
                          Don&apos;t have an account?
                          <Link
                            href={"/register"}
                            className="text-black pl-1 hover:underline"
                          >
                            Register
                          </Link>
                        </div>
                        <Link
                          href={"/my-account"}
                          className="button-main bg-white text-black border border-black w-full text-center"
                        >
                          Dashboard
                        </Link>
                        <div className="bottom mt-4 pt-4 border-t border-line"></div>
                        <Link href={"#!"} className="body1 hover:underline">
                          Support
                        </Link>
                      </div>
                    </>
                  ) : (
                    <User
                      size={24}
                      color="black"
                      onClick={() => {
                        window.location.href = "/my-account";
                      }}
                    />
                  )}
                </div>
                <div
                  className="max-md:hidden wishlist-icon flex items-center cursor-pointer"
                  onClick={openModalWishlist}
                >
                  <Heart size={24} color="black" />
                </div>
                <div
                  className="cart-icon flex items-center relative cursor-pointer"
                  onClick={openModalCart}
                >
                  <Handbag size={24} color="black" />
                  <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartState.cartArray.length}
                  </span>
                </div>
              </div>
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
                  <X size={14} />
                </div>
                <Link
                  href={"/"}
                  className="logo text-3xl font-semibold text-center"
                >
                  Anvogue
                </Link>
              </div>
              <div className="form-search relative mt-2">
                <MagnifyingGlass
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder={t('header.mobile.search.placeholder')}
                  className=" h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4"
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
                      {t('header.mobile.demo')}
                      <span className="text-right">
                        <CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(1)}
                      >
                        <CaretLeft />
                        {t('header.mobile.back')}
                      </div>
                      <div className="list-nav-item w-full grid grid-cols-2 pt-2 pb-6">
                        <ul>
                          <li>
                            <Link
                              href="/"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/" ? "active" : ""
                              }`}
                            >
                              Home Fashion 1
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion2"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion2"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 2
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion3"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion3"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 3
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion4"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion4"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 4
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion5"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion5"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 5
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion6"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion6"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 6
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion7"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion7"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 7
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion8"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion8"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 8
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion9"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion9"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 9
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion10"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion10"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 10
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/fashion11"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/fashion11"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Fashion 11
                            </Link>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <Link
                              href="/homepages/underwear"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/underwear"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Underwear
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/cosmetic1"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/cosmetic1"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Cosmetic 1
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/cosmetic2"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/cosmetic2"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Cosmetic 2
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/cosmetic3"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/cosmetic3"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Cosmetic 3
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/pet"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/pet" ? "active" : ""
                              }`}
                            >
                              Home Pet Store
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/jewelry"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/jewelry"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Jewelry
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/furniture"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/furniture"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Furniture
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/watch"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/watch" ? "active" : ""
                              }`}
                            >
                              Home Watch
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/toys"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/toys" ? "active" : ""
                              }`}
                            >
                              Home Toys Kid
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/yoga"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/yoga" ? "active" : ""
                              }`}
                            >
                              Home Yoga
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/organic"
                              className={`nav-item-mobile link text-secondary duration-300 ${
                                pathname === "/homepages/organic"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Organic
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/homepages/marketplace"
                              className={`nav-item-mobile text-secondary duration-300 ${
                                pathname === "/homepages/marketplace"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Home Marketplace
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${openSubNavMobile === 2 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(2)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Features
                      <span className="text-right">
                        <CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(2)}
                      >
                        <CaretLeft />
                        Back
                      </div>
                      <div className="list-nav-item w-full pt-3 pb-12">
                        <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              {t('header.mobile.features.forMen')}
                            </div>
                            <ul>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.startingFrom50')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("outerwear")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.outerwear')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("sweater")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.sweaters')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("shirt")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.shirts')}
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 view-all-btn`}
                                >
                                  {t('header.mobile.features.viewAll')}
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              {t('header.mobile.features.skincare')}
                            </div>
                            <ul>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("face")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.faceSkin')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("eye")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.eyeMakeup')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("lip")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.lipPolish')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("hair")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.hairCare')}
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 view-all-btn`}
                                >
                                  {t('header.mobile.features.viewAll')}
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              {t('header.mobile.features.health')}
                            </div>
                            <ul>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("candle")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.centedCandle')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("drinks")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.healthDrinks')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("clothes")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.yogaClothes')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("mats")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.yogaEquipment')}
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 view-all-btn`}
                                >
                                  {t('header.mobile.features.viewAll')}
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              {t('header.mobile.features.forWomen')}
                            </div>
                            <ul>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.startingFrom60')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("dress")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.dresses')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("t-shirt")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.tshirts')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("accessories")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.accessoriesJewelry')}
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 view-all-btn`}
                                >
                                  {t('header.mobile.features.viewAll')}
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              {t('header.mobile.features.forKid')}
                            </div>
                            <ul>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("bed")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.kidsBed')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("toy")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.boysToy')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("blanket")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.babyBlanket')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("clothing")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.newbornClothing')}
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 view-all-btn`}
                                >
                                  {t('header.mobile.features.viewAll')}
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              {t('header.mobile.features.forHome')}
                            </div>
                            <ul>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.furnitureDecor')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("table")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.tableLivingRoom')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("chair")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.chairWorkRoom')}
                                </div>
                              </li>
                              <li>
                                <div
                                  onClick={() => handleTypeClick("lighting")}
                                  className={`link text-secondary duration-300 cursor-pointer`}
                                >
                                  {t('header.mobile.features.lightingBedRoom')}
                                </div>
                              </li>
                              <li>
                                <div
                                  className={`link text-secondary duration-300 view-all-btn`}
                                >
                                  {t('header.mobile.features.viewAll')}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="banner-ads-block grid sm:grid-cols-2 items-center gap-6 pt-6">
                          <div
                            className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden"
                            onClick={() => handleTypeClick("swimwear")}
                          >
                            <div className="text-content py-14 pl-8 relative z-[1]">
                              <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                {t('header.mobile.features.save10')}
                              </div>
                              <div className="heading6 mt-2">
                                {t('header.mobile.features.diveIntoSavings')} <br />
                                {t('header.mobile.features.onSwimwear')}
                              </div>
                              <div className="body1 mt-3 text-secondary">
                                {t('header.mobile.features.startingAt')} <span className="text-red">$59.99</span>
                              </div>
                            </div>
                            <Image
                              src={"/images/slider/bg2-2.png"}
                              width={200}
                              height={100}
                              alt="bg-img"
                              className="basis-1/3 absolute right-0 top-0"
                            />
                          </div>
                          <div
                            className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden"
                            onClick={() => handleTypeClick("accessories")}
                          >
                            <div className="text-content py-14 pl-8 relative z-[1]">
                              <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">
                                {t('header.mobile.features.save10')}
                              </div>
                              <div className="heading6 mt-2">
                                20% {t('header.mobile.features.off')} <br />
                                {t('header.mobile.features.accessories')}
                              </div>
                              <div className="body1 mt-3 text-secondary">
                                {t('header.mobile.features.startingAt')} <span className="text-red">$59.99</span>
                              </div>
                            </div>
                            <Image
                              src={"/images/other/bg-feature.png"}
                              width={200}
                              height={100}
                              alt="bg-img"
                              className="basis-1/3 absolute right-0 top-0"
                            />
                          </div>
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
                      Shop
                    </a>
                  </li>
                  <li
                    className={`${openSubNavMobile === 4 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(4)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Product
                      <span className="text-right">
                        <CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(4)}
                      >
                        <CaretLeft />
                        Back
                      </div>
                      <div className="list-nav-item w-full pt-3 pb-12">
                        <div className="">
                          <div className="nav-link grid grid-cols-2 gap-5 gap-y-6 justify-between">
                            <div className="nav-item">
                              <div className="text-button-uppercase pb-1">
                                {t('header.mobile.product.features')}
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/default"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/default"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.default')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/sale"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/sale"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.sale')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/countdown-timer"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/countdown-timer"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.countdownTimer')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/grouped"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/grouped"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.grouped')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/bought-together"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/bought-together"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.boughtTogether')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/out-of-stock"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/out-of-stock"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.outOfStock')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/variable"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/variable"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.variable')}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="nav-item">
                              <div className="text-button-uppercase pb-1">
                                {t('header.mobile.product.features')}
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/external"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/external"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.external')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/on-sale"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/on-sale"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.onSale')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/discount"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/discount"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.withDiscount')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/sidebar"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/sidebar"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.withSidebar')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/fixed-price"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/fixed-price"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.fixedPrice')}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="nav-item col-span-2">
                              <div className="text-button-uppercase pb-1">
                                {t('header.mobile.product.layout')}
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/thumbnail-left"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/thumbnail-left"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.thumbnailsLeft')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/thumbnail-bottom"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/thumbnail-bottom"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.thumbnailsBottom')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/one-scrolling"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/one-scrolling"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.grid1Scrolling')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/two-scrolling"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/two-scrolling"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.grid2Scrolling')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/combined-one"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/combined-one"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.combined1')}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/combined-two"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/combined-two"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {t('header.mobile.product.combined2')}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="recent-product pt-4">
                            <div className="text-button-uppercase pb-1">
                              {t('header.mobile.product.recentProducts')}
                            </div>
                            <div className="list-product hide-product-sold  grid grid-cols-2 gap-5 mt-3">
                              {productData.slice(0, 2).map((prd, index) => (
                                <Product key={index} data={prd} type="grid" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${openSubNavMobile === 5 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(5)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Blog
                      <span className="text-right">
                        <CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(5)}
                      >
                        <CaretLeft />
                        Back
                      </div>
                      <div className="list-nav-item w-full pt-2 pb-6">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/blog/default"
                              className={`link text-secondary duration-300 ${
                                pathname === "/blog/default" ? "active" : ""
                              }`}
                            >
                              {t('header.mobile.blog.default')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/list"
                              className={`link text-secondary duration-300 ${
                                pathname === "/blog/list" ? "active" : ""
                              }`}
                            >
                              {t('header.mobile.blog.list')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/grid"
                              className={`link text-secondary duration-300 ${
                                pathname === "/blog/grid" ? "active" : ""
                              }`}
                            >
                              {t('header.mobile.blog.grid')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail2"
                              className={`link text-secondary duration-300 ${
                                pathname === "/blog/detail2" ? "active" : ""
                              }`}
                            >
                              {t('header.mobile.blog.detail1')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail2"
                              className={`link text-secondary duration-300 ${
                                pathname === "/blog/detail2" ? "active" : ""
                              }`}
                            >
                              {t('header.mobile.blog.detail2')}
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${openSubNavMobile === 6 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(6)}
                  >
                    <a
                      href={"#!"}
                      className="text-xl font-semibold flex items-center justify-between mt-5"
                    >
                      Pages
                      <span className="text-right">
                        <CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(6)}
                      >
                        <CaretLeft />
                        Back
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
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/contact"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/contact" ? "active" : ""
                              }`}
                            >
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/store-list"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/store-list" ? "active" : ""
                              }`}
                            >
                              Store List
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/page-not-found"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/page-not-found"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {t('header.pages.notFound')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/faqs"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/faqs" ? "active" : ""
                              }`}
                            >
                              {t('header.pages.faqs')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/coming-soon"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/coming-soon"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {t('header.pages.comingSoon')}
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/customer-feedbacks"
                              className={`link text-secondary duration-300 ${
                                pathname === "/pages/customer-feedbacks"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {t('header.pages.customerFeedbacks')}
                            </Link>
                          </li>
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
            <House weight="bold" className="text-2xl" />
            <span className="menu_bar-title caption2 font-semibold">{t('header.mobile.menuBar.home')}</span>
          </Link>
          <Link
            href={"/shop/filter-canvas"}
            className="menu_bar-link flex flex-col items-center gap-1"
          >
            <List weight="bold" className="text-2xl" />
            <span className="menu_bar-title caption2 font-semibold">
              {t('header.mobile.menuBar.category')}
            </span>
          </Link>
          <Link
            href={"/shop"}
            className="menu_bar-link flex flex-col items-center gap-1"
            onClick={(e) => { e.stopPropagation() }}
          >
            <MagnifyingGlass weight="bold" className="text-2xl" />
            <span
              className="menu_bar-title caption2 font-semibold"
              onClick={() => {
                handleSearch(searchKeyword);
              }}
            >
              {t('header.mobile.menuBar.search')}
            </span>
          </Link>
          <Link
            href={"/cart"}
            className="menu_bar-link flex flex-col items-center gap-1"
          >
            <div className="icon relative">
              <Handbag weight="bold" className="text-2xl" />
              <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                {cartState.cartArray.length}
              </span>
            </div>
            <span className="menu_bar-title caption2 font-semibold">{t('header.mobile.menuBar.cart')}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MenuOne;
