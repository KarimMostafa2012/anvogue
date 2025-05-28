"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from "@/type/ProductType";
import Product from "../Product/Product";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import HandlePagination from "../Other/HandlePagination";

interface Props {
  data: Array<ProductType>;
  productPerPage: number;
  dataType: string | null;
}

const ShopSidebarList: React.FC<Props> = ({
  data,
  productPerPage,
  dataType,
  categories,
}) => {
  const [type, setType] = useState<string | null>(dataType);
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [color, setColor] = useState<string | null>();
  const [list, setList] = useState<Boolean | null>(true);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = productPerPage;
  const offset = currentPage * productsPerPage;
  let colors = [];
  let colorCounter = 0;

  data.forEach((prod) => {
    prod.colors.forEach((col) => {
      if (colorCounter < 59) {
        colors[colorCounter] = col;
        colorCounter++;
      }
    });
  });

  function removeDuplicateIcons(icons: IconArray): IconArray {
    const seen = new Set<number>();
    return icons.filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }
  const uniqueColors = removeDuplicateIcons(colors);

  const handleType = (type: string) => {
    setType((prevType) => (prevType === type ? null : type));
    setCurrentPage(0);
  };

  const handleShowOnlySale = () => {
    setShowOnlySale((toggleSelect) => !toggleSelect);
    setCurrentPage(0);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0], max: values[1] });
      setCurrentPage(0);
    }
  };

  const handleColor = (color: string) => {
    setColor((prevColor) => (prevColor === color ? null : color));
    setCurrentPage(0);
  };

  // Filter product data by dataType
  let filteredData = data.filter((product) => {
    let isShowOnlySaleMatched = true;
    if (showOnlySale) {
      isShowOnlySaleMatched = product.has_offer;
    }

    let isDataTypeMatched = true;
    if (dataType) {
      isDataTypeMatched = product.category.name.en === dataType;
    }

    let isTypeMatched = true;
    if (type) {
      dataType = type;
      isTypeMatched = product.category.name.en === type;
    }

    let isPriceRangeMatched = true;
    if (priceRange.min !== 0 || priceRange.max !== 100) {
      isPriceRangeMatched =
        Number(product.price) >= priceRange.min &&
        Number(product.price) <= priceRange.max;
    }

    let isColorMatched = true;
    if (color) {
      isColorMatched = product.colors.some((item) => item.color === color);
    }

    return (
      isShowOnlySaleMatched &&
      isDataTypeMatched &&
      isTypeMatched &&
      isColorMatched &&
      isPriceRangeMatched &&
      product.category === "fashion"
    );
  });

  // Create a copy array filtered to sort
  let sortedData = [...filteredData];

  if (sortOption === "soldQuantityHighToLow") {
    filteredData = sortedData.sort((a, b) => b.sold - a.sold);
  }

  if (sortOption === "discountHighToLow") {
    filteredData = sortedData.sort(
      (a, b) =>
        Math.floor(100 - (b.price / b.originPrice) * 100) -
        Math.floor(100 - (a.price / a.originPrice) * 100)
    );
  }

  if (sortOption === "priceHighToLow") {
    filteredData = sortedData.sort((a, b) => b.price - a.price);
  }

  if (sortOption === "priceLowToHigh") {
    filteredData = sortedData.sort((a, b) => a.price - b.price);
  }

  const totalProducts = filteredData.length;
  const selectedType = type;
  const selectedColor = color;

  if (filteredData.length === 0) {
    filteredData = [
      {
        id: "no-data",
        category: "no-data",
        type: "no-data",
        name: "no-data",
        gender: "no-data",
        new: false,
        sale: false,
        rate: 0,
        price: 0,
        originPrice: 0,
        sold: 0,
        quantity: 0,
        quantityPurchase: 0,
        variation: [],
        thumbImage: [],
        images: [],
        description: "no-data",
        action: "no-data",
        slug: "no-data",
      },
    ];
  }

  // Find page number base on filteredData
  const pageCount = Math.ceil(filteredData.length / productsPerPage);

  // If page number 0, set current page = 0
  if (pageCount === 0) {
    setCurrentPage(0);
  }

  // Get product data for current page
  let currentProducts: ProductType[];

  if (filteredData.length > 0) {
    currentProducts = filteredData.slice(offset, offset + productsPerPage);
  } else {
    currentProducts = [];
  }

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  const handleClearAll = () => {
    setType(null);
    setColor(null);
    setPriceRange({ min: 0, max: 100 });
    setCurrentPage(0);
    dataType = null;
    setType(dataType);
  };

  return (
    <>
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container lg:pt-[134px] pt-24 pb-10 relative">
            <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
              <div className="text-content">
                <div className="heading2 text-center">
                  {dataType === null ? "Shop" : dataType}
                </div>
                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                  <Link href={"/"}>Homepage</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="text-secondary2 capitalize">
                    {dataType === null ? "Shop" : dataType}
                  </div>
                </div>
              </div>
              <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                {["t-shirt", "dress", "top", "swimwear", "shirt"].map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${
                        dataType === item ? "active" : ""
                      }`}
                      onClick={() => handleType(item)}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="flex max-md:flex-wrap max-md:flex-col-reverse gap-y-8">
            <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pr-12">
              <div className="filter-type pb-8 border-b border-line">
                <div className="heading6">Products Type</div>
                <div className="list-type mt-4">
                  {[
                    "t-shirt",
                    "dress",
                    "top",
                    "swimwear",
                    "shirt",
                    "underwear",
                    "sets",
                    "accessories",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`item flex items-center justify-between cursor-pointer ${
                        dataType === item ? "active" : ""
                      }`}
                      onClick={() => handleType(item)}
                    >
                      <div className="text-secondary has-line-before hover:text-black capitalize">
                        {item}
                      </div>
                      <div className="text-secondary2">
                        (
                        {
                          data.filter(
                            (dataItem) =>
                              dataItem.type === item &&
                              dataItem.category === "fashion"
                          ).length
                        }
                        )
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="filter-price pb-8 border-b border-line mt-8">
                <div className="heading6">Price Range</div>
                <Slider
                  range
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  onChange={handlePriceChange}
                  className="mt-5"
                />
                <div className="price-block flex items-center justify-between flex-wrap mt-4">
                  <div className="min flex items-center gap-1">
                    <div>Min price:</div>
                    <div className="price-min">
                      $<span>{priceRange.min}</span>
                    </div>
                  </div>
                  <div className="min flex items-center gap-1">
                    <div>Max price:</div>
                    <div className="price-max">
                      $<span>{priceRange.max}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-color pb-8 border-b border-line mt-8">
                <div className="heading6">colors</div>
                <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                  {uniqueColors.map((col, i) => {
                    if (i < 30) {
                      return (
                        <div
                          className={`color-item flex items-center justify-center gap-2 rounded-full border border-line ${
                            color === col.color ? "active" : ""
                          }`}
                          onClick={() => handleColor(col.color)}
                        >
                          <div
                            className="color w-5 h-5 rounded-full border-[1px] border-[rgba(0,0,0,0.4)]"
                            style={{ backgroundColor: col.color }}
                          ></div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className={`color-item hidden items-center justify-center gap-2 rounded-full border border-line ${
                            color === col.color ? "active" : ""
                          }`}
                          onClick={() => handleColor(col.color)}
                        >
                          <div
                            className="color w-5 h-5 rounded-full border-[1px] border-[rgba(0,0,0,0.4)]"
                            style={{ backgroundColor: col.color }}
                          ></div>
                        </div>
                      );
                    }
                  })}
                </div>
                <button
                  className="block w-full text-center font-medium text-[14px] mt-2"
                  onClick={(e) => {
                    document
                      .querySelectorAll(".list-color .color-item")
                      .forEach((ele, i) => {
                        if (i > 29) {
                          ele.classList.toggle("hidden");
                          ele.classList.toggle("flex");
                        }
                      });
                      e.target.textContent = "show more" == e.target.textContent ? "show less" : "show more"
                  }}
                >
                  show more
                </button>
              </div>
            </div>
            <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:pl-3">
              <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                <div className="left flex has-line items-center flex-wrap gap-5">
                  <div className="choose-layout flex items-center gap-2">
                    <div
                      onClick={() => {
                        setList(false);
                      }}
                      className={
                        "item three-col w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer " +
                        (!list ? "active" : "")
                      }
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setList(true);
                      }}
                      className={
                        "item row w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer " +
                        (list ? "active" : "")
                      }
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="w-4 h-[3px] bg-secondary2 rounded-sm"></span>
                        <span className="w-4 h-[3px] bg-secondary2 rounded-sm"></span>
                        <span className="w-4 h-[3px] bg-secondary2 rounded-sm"></span>
                      </div>
                    </div>
                  </div>
                  <div className="check-sale flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="filterSale"
                      id="filter-sale"
                      className="border-line"
                      onChange={handleShowOnlySale}
                    />
                    <label
                      htmlFor="filter-sale"
                      className="cation1 cursor-pointer"
                    >
                      Show only products on sale
                    </label>
                  </div>
                </div>
                <div className="right flex items-center gap-3">
                  <label
                    htmlFor="select-filter"
                    className="caption1 capitalize"
                  >
                    Sort by
                  </label>
                  <div className="select-block relative">
                    <select
                      id="select-filter"
                      name="select-filter"
                      className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line"
                      onChange={(e) => {
                        handleSortChange(e.target.value);
                      }}
                      defaultValue={"Sorting"}
                    >
                      <option value="Sorting" disabled>
                        Sorting
                      </option>
                      <option value="soldQuantityHighToLow">
                        Best Selling
                      </option>
                      <option value="discountHighToLow">Best Discount</option>
                      <option value="priceHighToLow">Price High To Low</option>
                      <option value="priceLowToHigh">Price Low To High</option>
                    </select>
                    <Icon.CaretDown
                      size={12}
                      className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                    />
                  </div>
                </div>
              </div>

              <div className="list-filtered flex items-center gap-3 mt-4">
                <div className="total-product">
                  {totalProducts}
                  <span className="text-secondary pl-1">Products Found</span>
                </div>
                {(selectedType || selectedColor) && (
                  <>
                    <div className="list flex items-center gap-3">
                      <div className="w-px h-4 bg-line"></div>
                      {selectedType && (
                        <div
                          className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                          onClick={() => {
                            setType(null);
                          }}
                        >
                          <Icon.X className="cursor-pointer" />
                          <span>{selectedType}</span>
                        </div>
                      )}
                      {selectedColor && (
                        <div
                          className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize"
                          onClick={() => {
                            setColor(null);
                          }}
                        >
                          <Icon.X className="cursor-pointer" />
                          <span>{selectedColor}</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                      onClick={handleClearAll}
                    >
                      <Icon.X
                        color="rgb(219, 68, 68)"
                        className="cursor-pointer"
                      />
                      <span className="text-button-uppercase text-red">
                        Clear All
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div
                className={
                  list
                    ? "list-product hide-product-sold flex flex-col gap-8 mt-7"
                    : "list-product hide-product-sold grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7"
                }
              >
                {currentProducts.map((item) =>
                  item.id === "no-data" ? (
                    <div key={item.id} className="no-data-product">
                      No products match the selected criteria.
                    </div>
                  ) : (
                    <Product
                      key={item.id}
                      data={item}
                      type={list ? "list" : "grid"}
                      style="style-2"
                    />
                  )
                )}
              </div>

              {pageCount > 1 && (
                <div className="list-pagination flex items-center md:mt-10 mt-7">
                  <HandlePagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSidebarList;
