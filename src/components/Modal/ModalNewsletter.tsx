"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from "@/data/Product.json";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import Image from "next/image";
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
  const [popup, setPopup] = useState<popupType>({
    id: 5,
    background_color: "#896322",
    background_img: "https://api.malalshammobel.com/media/popup/brand1.png",
    title: "Welcome to our Sale!",
    content: "Enjoy up to 50% off on selected items for a limited time.",
    button_text: "Shop Now",
  });
  const router = useRouter();
  const { openQuickview } = useModalQuickviewContext();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  // Get products from Redux store
  const products = useSelector((state: RootState) => state.products.products);
  const currentLanguage = useSelector((state: RootState) => state.language);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          lang: currentLanguage,
          has_offer: true,
        };
        await dispatch(getOfferProducts({ params }));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, dispatch, currentLanguage]);

  useEffect(() => {
    fetch(
      `https://api.malalshammobel.com/home/pop-up/?lang=${currentLanguage}`,
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
          console.log("okaaaaay", response);
        }
        return response.json();
      })
      .then((data) => {
        setPopup(data[0]);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentLanguage]);

  const handleDetailProduct = (productId: string) => {
    // redirect to shop with category selected
    router.push(`/product/variable?id=${productId}`);
  };

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 3000);
  }, []);

  return (
    <div className="modal-newsletter" onClick={() => setOpen(false)}>
      <div className="container h-full flex items-center justify-center w-full">
        <div
          className={`modal-newsletter-main ${open ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="main-content flex rounded-[20px] w-full max-md:max-h-[80vh] overflow-hidden">
            <div
              className={`left lg:w-1/2 sm:w-2/5 max-sm:hidden flex flex-col items-center justify-center gap-5 py-14`}
              style={{
                backgroundColor: popup.background_color || "#d2ef9a",
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
            <div className="right lg:w-1/2 sm:w-3/5 w-full bg-white sm:pt-10 sm:ps-10 max-sm:p-6 relative max-md:h-full">
              <div
                className="close-newsletter-btn w-10 h-10 flex items-center justify-center border border-line rounded-full absolute ltr:right-5 rtl:left-5 top-5 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Icon.X weight="bold" className="text-xl" />
              </div>
              <div className="heading5 pb-5">{t("you_may_also_like")}</div>
              <div className="list flex flex-col gap-5 overflow-x-auto sm:pe-6">
                {products.map((item, index) => (
                  <>
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
                            width={5000}
                            height={5000}
                            src={item.images[0].img}
                            alt={item.name}
                            className="w-[100px] aspect-square flex-shrink-0 rounded-lg"
                          />
                        </div>
                        <div className="">
                          <div className="name text-button">{item.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="product-price text-title">
                              ${item.new_price}
                            </div>
                            <div className="product-origin-price text-title text-secondary2">
                              <del>${item.price}</del>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="quick-view-btn button-main sm:py-3 py-2 sm:px-5 px-4 bg-black hover:bg-green text-white rounded-full whitespace-nowrap"
                        onClick={() => openQuickview(item)}
                      >
                        {t("quick_view")}
                      </button>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewsletter;
