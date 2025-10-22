"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import { useTranslation } from "react-i18next";
import { getOfferProducts } from "@/redux/slices/productSlice";

interface popupType {
  id: number;
  background_color: string;
  background_img: string;
  title: string;
  content: string;
  button_text: string;
}

const useAppDispatch = () => useDispatch<AppDispatch>();

const ModalNewsletter = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [popup, setPopup] = useState<popupType | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 🔹 unified loading for popup + products
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { openQuickview } = useModalQuickviewContext();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const products = useSelector(
    (state: RootState) => state.products.offerProducts
  );
  const currentLanguage = useSelector((state: RootState) => state.language);

  // 🔹 Fetch offer products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = { lang: currentLanguage, has_offer: true };
        await dispatch(getOfferProducts({ params }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [dispatch, currentLanguage]);

  // 🔹 Fetch popup data
  useEffect(() => {
    const fetchPopup = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.malalshammobel.com/home/pop-up/?lang=${currentLanguage}`
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();
        if (data && data.length > 0) {
          setPopup(data[0]);
        } else {
          setPopup(null); // No popup found
        }
      } catch (err: any) {
        console.error("Popup fetch error:", err);
        setError("Failed to load popup.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopup();
  }, [currentLanguage]);

  // 🔹 Open popup automatically if available
  useEffect(() => {
    if (popup && !loading) {
      const timer = setTimeout(() => setOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup, loading]);

  const handleDetailProduct = (productId: string) => {
    router.push(`/product/variable?id=${productId}`);
  };

  // 🔹 Render states
  if (loading) {
    return (
      <div className="modal-newsletter fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="loader border-4 border-gray-300 border-t-black rounded-full w-10 h-10 mx-auto animate-spin"></div>
          <p className="mt-3 text-gray-700">{t("loading")}...</p>
        </div>
      </div>
    );
  }

  if (error || !popup) {
    // No popup available or error occurred
    return null;
  }

  return (
    <div className={`modal-newsletter ${open ? "block" : "hidden"}`} onClick={() => setOpen(false)}>
      <div className="container h-full flex items-center justify-center w-full">
        <div
          className={`modal-newsletter-main ${open ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="main-content flex rounded-[20px] w-full max-md:max-h-[80vh] overflow-hidden">
            {/* LEFT SIDE */}
            <div
              className="left lg:w-1/2 sm:w-2/5 max-sm:hidden flex flex-col items-center justify-center gap-5 py-14"
              style={{
                backgroundColor: popup?.background_color || "#d2ef9a",
              }}
            >
              <div className="text-xs font-semibold uppercase text-center">
                {t("special_offer")}
              </div>
              <div className="lg:text-[70px] text-4xl lg:leading-[78px] leading-[42px] font-bold uppercase text-center">
                {popup.title}
              </div>
              <div className="text-button-uppercase text-center">
                {popup.content}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="right lg:w-1/2 sm:w-3/5 w-full bg-white sm:pt-10 sm:ps-10 max-sm:p-6 relative max-md:h-full">
              <div
                className="close-newsletter-btn w-10 h-10 flex items-center justify-center border border-line rounded-full absolute ltr:right-5 rtl:left-5 top-5 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Icon.X weight="bold" className="text-xl" />
              </div>

              <div className="heading5 pb-5">{t("you_may_also_like")}</div>

              <div className="list flex flex-col gap-5 overflow-x-auto sm:pe-6">
                {products.length > 0 ? (
                  products.map((item, index) => (
                    <div
                      className="product-item item pb-5 flex items-center justify-between gap-3 border-b border-line"
                      key={index}
                    >
                      <div
                        className="infor flex items-center gap-5 cursor-pointer"
                        onClick={() => handleDetailProduct(item.id)}
                      >
                        <div className="bg-img flex-shrink-0">
                          <Image
                            width={100}
                            height={100}
                            src={item.images[0]?.img || "/placeholder.png"}
                            alt={item.name}
                            className="w-[100px] aspect-square flex-shrink-0 rounded-lg"
                          />
                        </div>
                        <div>
                          <div className="name text-button">{item.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="product-price text-title">
                              ${item.new_price}
                            </div>
                            <div className="product-origin-price text-title text-secondary2">
                              <del>${item.price}</del>
                            </div>
                          </div>
                          <button
                            className="sm:hidden mt-3 quick-view-btn button-main sm:py-3 py-2 sm:px-5 px-4 bg-black hover:bg-green text-white rounded-full whitespace-nowrap"
                            onClick={() => openQuickview(item)}
                          >
                            {t("quick_view")}
                          </button>
                        </div>
                      </div>

                      <button
                        className="max-sm:hidden quick-view-btn button-main sm:py-3 py-2 sm:px-5 px-4 bg-black hover:bg-green text-white rounded-full whitespace-nowrap"
                        onClick={() => openQuickview(item)}
                      >
                        {t("quick_view")}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    {t("no_offer_products")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewsletter;
