"use client";
import React, { useState } from "react";
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
import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import Rate from "@/components/Other/Rate";

const Compare = () => {
  const { compareState } = useCompare();
  const { cartState, addToCart, updateCart } = useCart();
  const { openModalCart } = useModalCartContext();
  const [activeColors, setActiveColors] = useState<{ [id: string]: string }>({});

  const handleAddToCart = (productItem: ProductType) => {
    if (!cartState.cartArray.find((item) => item.id === productItem.id)) {
      addToCart(productItem, activeColors[productItem.id] || productItem.colors[0].color, 1);
      updateCart(productItem.id, 1, activeColors[productItem.id] || productItem.colors[0].color, productItem.size);
    } else {
      updateCart(productItem.id, 1, activeColors[productItem.id] || productItem.colors[0].color, productItem.size);
    }
    openModalCart();
  };

  return (
    <>
      <TopNavOne
        props="style-one bg-black"
        
      />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Compare Products" subHeading="Compare Products" />
      </div>
      <div className="compare-block md:py-20 py-10">
        <div className="container">
          <div className="content-main">
            <div>
              <div className="list-product flex">
                <div className="left lg:w-[240px] w-[170px] flex-shrink-0"></div>
                <div className="right flex w-full border border-line rounded-t-2xl border-b-0">
                  {compareState.compareArray.map((item) => (
                    <div
                      className="product-item px-10 pt-6 pb-5 border-r border-line"
                      key={item.id}
                    >
                      <div className="bg-img w-full aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.images[0].img}
                          width={1000}
                          height={1500}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-title text-center mt-4">
                        {item.name}
                      </div>
                      <div className="caption2 font-semibold text-secondary2 uppercase text-center mt-1">
                        {item.brand}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="compare-table flex">
                <div className="left lg:w-[240px] w-[170px] flex-shrink-0 border border-line border-r-0 rounded-l-2xl">
                  <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">
                    Rating
                  </div>
                  <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">
                    Price
                  </div>
                  <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">
                    Type
                  </div>
                  <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">
                    Brand
                  </div>
                  <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">
                    Size
                  </div>
                  <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">
                    Colors
                  </div>
                  <div className="item text-button flex items-center h-[60px] px-8 w-full border-b border-line">
                    Add To Cart
                  </div>
                </div>
                <table className="right border-collapse w-full border-t border-r border-line">
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="w-full border border-line h-[60px] border-t-0 border-r-0"
                        key={index}
                      >
                        <div className="h-full flex items-center justify-center">
                          <Rate currentRate={item.average_rate} size={12} />
                          <p className="ps-1">({item.average_rate})</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="w-full border border-line h-[60px] border-t-0 border-r-0"
                        key={index}
                      >
                        <div className="h-full flex items-center justify-center">
                          ${item.price}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="w-full border border-line h-[60px] border-t-0 border-r-0"
                        key={index}
                      >
                        <div className="h-full flex items-center justify-center capitalize">
                          {item.type}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="w-full border border-line h-[60px] border-t-0 border-r-0"
                        key={index}
                      >
                        <div className="h-full flex items-center justify-center capitalize">
                          {item.brand}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="w-full border border-line h-[60px] border-t-0 border-r-0 size"
                        key={index}
                      >
                        <div className="h-full flex items-center justify-center capitalize gap-1">
                          <p>
                            {item.size}
                            <span>,</span>
                          </p>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="w-full border border-line h-[60px] border-t-0 border-r-0 size"
                        key={index}
                      >
                        <div className="h-full flex items-center justify-center capitalize gap-2">
                          {item.colors.map((colorItem, i) => (
                            <span
                              key={i}
                              className={"w-6 h-6 rounded-full border border-[rgba(0,0,0,0.4)] hover:border-[rgba(0,0,0,0.8)] cursor-pointer duration-300 " + (activeColors[item.id] == colorItem.color ? "!border-2" : "")}
                              style={{ backgroundColor: `${colorItem.color}` }}
                              onClick={()=>setActiveColors((prev) => ({...prev,[item.id]: colorItem.color,}))}
                            ></span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="w-full border border-line h-[60px] border-t-0 border-r-0"
                        key={index}
                      >
                        <div className="h-full flex items-center justify-center">
                          <div
                            className="button-main py-1.5 px-5"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add To Cart
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Compare;
