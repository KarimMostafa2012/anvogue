"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/slices/productSlice";
import Product from "../Product/Product";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";
import { getAllCategories } from "@/redux/slices/categorySlice";
import { ProductType } from "@/type/ProductType";

interface Params {
  product_name?: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  sub_category?: string;
  lang?: string;
  page_size?: number;
  page?: number;
  color?: string;
  sort?: string;
  has_offer?: boolean;
}

interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: number) => void;
  forcePage?: number;
}

const HandlePagination: React.FC<PaginationProps> = ({
  pageCount,
  onPageChange,
  forcePage,
}) => {
  const { t } = useTranslation();
  return (
    <ReactPaginate
      previousLabel={<Icon.CaretLeft size={16} className="text-secondary2" />}
      nextLabel={<Icon.CaretRight size={16} className="text-secondary2" />}
      pageCount={pageCount}
      pageRangeDisplayed={6}
      marginPagesDisplayed={2}
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected)}
      containerClassName="pagination flex items-center justify-center gap-2 mt-8"
      pageClassName="mx-1"
      pageLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-secondary2"
      activeClassName="active"
      activeLinkClassName="bg-black text-white"
      previousClassName="mx-1"
      nextClassName="mx-1"
      previousLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      nextLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      disabledClassName="opacity-50 cursor-not-allowed"
      breakLabel={t("...")}
      breakClassName="mx-1 px-3 py-1"
      forcePage={forcePage}
    />
  );
};

const ShopSidebarList = ({
  data,
  productPerPage,
  dataType,
}: {
  data: ProductType[];
  productPerPage: Number;
  dataType: string | null;
}) => {
  const [viewType, setViewType] = useState<"grid" | "list" | "marketplace">(
    "grid"
  );
  const [params, setParams] = useState<Params>({
    lang: "en",
    page_size: 12,
    page: 1,
  });
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const currentLanguage = useSelector((state: RootState) => state.language);
  const { t } = useTranslation();
  let colors: { id: string; product: number; color: string }[] = [];
  let colorCounter = 0;

  const dispatch = useDispatch<AppDispatch>();
  const { products, count, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  products.forEach((prod) => {
    prod.colors.forEach((col: any) => {
      if (colorCounter < 59) {
        colors[colorCounter] = col;
        colorCounter++;
      }
    });
  });

  // Reset currentPage to 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, priceRange, selectedColor, sortOption, showOnlySale]);

  useEffect(() => {
    dispatch(
      getAllCategories({
        lang: currentLanguage,
      })
    );
  }, [dispatch, currentLanguage]);

  // Update params when filters, sorting, or pagination change
  useEffect(() => {
    setParams({
      lang: currentLanguage,
      page_size: 6, // Fixed page size for API
      page: currentPage + 1, // API pages are 1-based
      category: selectedCategory || undefined,
      min_price: priceRange.min > 0 ? priceRange.min : undefined,
      max_price: priceRange.max < 1000 ? priceRange.max : undefined,
      color: selectedColor || undefined,
      sort:
        sortOption === "priceHighToLow"
          ? "-price"
          : sortOption === "priceLowToHigh"
          ? "price"
          : undefined,
      has_offer: showOnlySale || undefined,
    });
  }, [
    currentPage,
    selectedCategory,
    priceRange,
    selectedColor,
    sortOption,
    showOnlySale,
    currentLanguage,
  ]);

  // Fetch products when params change
  useEffect(() => {
    console.log("Fetching with params:", params);
    dispatch(getAllProducts({ params }));
  }, [dispatch, params]);

  // Calculate category counts
  const categoryCounts = products.reduce((acc, product) => {
    if (product.category) {
      acc[product.category] = (acc[product.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Clear all filters
  const clearAllFilters = () => {
    setShowOnlySale(false);
    setPriceRange({ min: 0, max: 100 });
    setSelectedCategory(null);
    setSelectedColor(null);
    setSortOption("");
    setCurrentPage(0);
  };

  // Pure server-side pagination
  const pageCount = Math.ceil((count ?? 0) / (params.page_size || 6));

  return (
    <>
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container lg:pt-[134px] pt-24 pb-10 relative">
            <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
              <div className="text-content">
                <div className="heading2 text-center">{t("Shop")}</div>
                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                  <Link href="/">{t("Homepage")}</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="text-secondary2 capitalize">{t("Shop")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="flex max-md:flex-wrap max-md:flex-col-reverse gap-y-8">
            <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pe-12">
              <div className="filter-type pb-8 border-b border-line">
                <div className="heading6">{t("Product Type")}</div>
                <div className="list-type mt-4">
                  {categories.map((item, index) => (
                    <div
                      key={index}
                      className={`item flex items-center justify-between cursor-pointer ${
                        selectedCategory === item.name ? "text-black" : ""
                      }`}
                      onClick={() =>
                        setSelectedCategory(
                          item.name === selectedCategory ? null : item.name
                        )
                      }
                    >
                      <div className="text-secondary has-line-before hover:text-black capitalize">
                        {t(item.name)}
                      </div>
                      {/* <div className="text-secondary2">({categoryCounts[item.name] || 0})</div> */}
                    </div>
                  ))}
                </div>
              </div>
              <div className="filter-price pb-8 border-b border-gray-200 mt-8">
                <div className="text-lg font-semibold text-gray-800 mb-4">
                  {t("Price Range")}
                </div>
                <div className="price-block flex items-center justify-between gap-4 mt-4">
                  <div className="min flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("Min price")}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: Number(e.target.value),
                          })
                        }
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-4 py-2 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center pt-5">
                    <span className="text-gray-400">-</span>
                  </div>

                  <div className="max flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("Max price")}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: Number(e.target.value),
                          })
                        }
                        className="focus:ring-primary-500 border focus:border-primary-500 block w-full pl-7 pr-4 py-2 sm:text-sm border-gray-300 rounded-md"
                        placeholder="1000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-color pb-8 border-b border-line mt-8">
                <div className="heading6">{t("Colors")}</div>
                <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                  {colors.map((color, i) => (
                    <div
                      key={i}
                      className={`color-item flex items-center justify-center gap-2 rounded-full border border-line ${
                        selectedColor === color.color ? "border-black" : ""
                      }`}
                      onClick={() =>
                        setSelectedColor(
                          color.color === selectedColor ? null : color.color
                        )
                      }
                    >
                      <div
                        className="color w-5 h-5 rounded-full border-[1px] border-[rgba(0,0,0,0.4)]"
                        style={{ backgroundColor: color.color }}
                      ></div>
                    </div>
                  ))}
                </div>
                <button className="block w-full text-center font-medium text-[14px] mt-2">
                  {t("Show more")}
                </button>
              </div>
              {(selectedCategory ||
                selectedColor ||
                showOnlySale ||
                priceRange.min > 0 ||
                priceRange.max < 1000) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-500 hover:underline mt-4"
                >
                  {t("Clear All Filters")}
                </button>
              )}
            </div>
            <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:ps-3">
              <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                <div className="left flex has-line items-center flex-wrap gap-5">
                  <div className="choose-layout flex items-center gap-2">
                    <div
                      onClick={() => setViewType("grid")}
                      className={`item three-col w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer ${
                        viewType === "grid" ? "active" : ""
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      </div>
                    </div>
                    <div
                      onClick={() => setViewType("list")}
                      className={`item row w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer ${
                        viewType === "list" ? "active" : ""
                      }`}
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
                      checked={showOnlySale}
                      onChange={() => setShowOnlySale(!showOnlySale)}
                    />
                    <label
                      htmlFor="filter-sale"
                      className="caption1 cursor-pointer"
                    >
                      {t("Show only products on sale")}
                    </label>
                  </div>
                </div>
                <div className="right flex items-center gap-3">
                  <label
                    htmlFor="select-filter"
                    className="caption1 capitalize"
                  >
                    {t("Sort by")}
                  </label>
                  <div className="select-block relative">
                    <select
                      id="select-filter"
                      name="select-filter"
                      className="caption1 py-2 ps-3 md:pe-20 pe-10 rounded-lg border border-line"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="">{t("Default Sorting")}</option>
                      <option value="priceHighToLow">
                        {t("Price High To Low")}
                      </option>
                      <option value="priceLowToHigh">
                        {t("Price Low To High")}
                      </option>
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
                  {count ?? 0}
                  <span className="text-secondary ps-1">
                    {t("Products Found")}
                  </span>
                </div>
                {(selectedCategory ||
                  selectedColor ||
                  showOnlySale ||
                  priceRange.min > 0 ||
                  priceRange.max < 1000) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {t("Clear All Filters")}
                  </button>
                )}
              </div>

              <div
                className={`list-product ${
                  viewType === "grid"
                    ? "grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px]"
                    : viewType === "list"
                    ? "flex flex-col gap-6"
                    : "grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4"
                } mt-7`}
              >
                {loading ? (
                  <div className="loading-container">
                    <Icon.SpinnerGap
                      size={32}
                      className="spinner text-secondary2 mb-4"
                    />
                    <div className="loading-text text-secondary2 font-semibold">
                      {t("Loading products...")}
                    </div>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-10 text-red-500">
                    {t("Error")}: {error}
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <Product data={product} key={product.id} type={viewType} />
                  ))
                ) : (
                  <div className="no-data-product col-span-full text-center py-10">
                    {t(
                      "No products match your current filters. Try adjusting or clearing filters."
                    )}
                  </div>
                )}
              </div>

              {pageCount > 1 && (
                <HandlePagination
                  pageCount={pageCount}
                  onPageChange={(selected) => {
                    setCurrentPage(selected);
                    const element = document.querySelector(".shop-product");
                    element?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  forcePage={currentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSidebarList;

// <div key={product.id} className="product-card bg-white rounded-lg overflow-hidden shadow-md">
//   <div className="product-image relative">
//     {product.images.length > 0 && (
//       <img
//         src={product.images[0].img}
//         alt={product.name}
//         className="w-full h-48 object-cover"
//       />
//     )}
//     {product.has_offer && (
//       <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
//         Sale
//       </div>
//     )}
//   </div>
//   <div className="product-details p-4">
//     <h3 className="product-name font-medium text-lg mb-1">{product.name}</h3>
//     <div className="product-price flex items-center gap-2">
//       <span className="current-price font-bold">${product.price}</span>
//     </div>
//     <div className="product-colors flex mt-2">
//       {product.colors.map((color: { color: string | undefined; }, index: React.Key | null | undefined) => (
//         <div
//           key={index}
//           className="w-4 h-4 rounded-full border border-gray-300 mr-1"
//           style={{ backgroundColor: color.color }}
//           title={color.color}
//         ></div>
//       ))}
//     </div>
//     <div className="product-rating mt-2">
//       {[...Array(5)].map((_, i) => (
//         <Icon.Star
//           key={i}
//           size={16}
//           weight={i < Math.floor(product.average_rate) ? "fill" : "regular"}
//           className="text-yellow-400 inline"
//         />
//       ))}
//       <span className="text-xs text-gray-500 ml-1">
//         ({product.average_rate.toFixed(1)})
//       </span>
//     </div>
//     <button className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
//       Add to Cart
//     </button>
//   </div>
// </div>
