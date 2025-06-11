"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/slices/productSlice";
import Product from "../Product/Product";
import ReactPaginate from "react-paginate";
import { useTranslation } from "next-i18next";
import { getAllCategories } from "@/redux/slices/categorySlice";
import { ProductType } from "@/type/ProductType";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

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
      breakLabel="..."
      breakClassName="mx-1 px-3 py-1"
      forcePage={forcePage}
    />
  );
};

interface ShopSidebarListProps {
  className?: string;
}

const ShopSidebarList = ({ className }: ShopSidebarListProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [debouncedPriceRange] = useDebounce(priceRange, 500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showMore, setShowMore] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedSubCategory] = useDebounce(selectedSubCategory, 500);
  const [colors, setColors] = useState<
    { id: string; product: number; color: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const currentLanguage = useSelector((state: RootState) => state.language);
  const { t } = useTranslation();

  // Get product_name directly from URL params
  const productName = searchParams.get("product_name") || "";
  const [debouncedProductName] = useDebounce(productName, 300);

  const dispatch = useDispatch<AppDispatch>();
  const { products, count, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  // Fetch colors from API
  useEffect(() => {
    fetch("https://api.malalshammobel.com/products/get/colors/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setColors(data))
      .catch((error) => console.error("Error fetching colors:", error));
  }, []);

  // Parse initial URL parameters on mount and when searchParams change
  useEffect(() => {
    const category = searchParams.get("category");
    const color = searchParams.get("color");
    const subCategory = searchParams.get("sub_category") || "";
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const sort = searchParams.get("sort") || "";
    const sale = searchParams.get("sale");
    const page = searchParams.get("page");

    setSelectedCategory(category);
    setSelectedColor(color);
    setSelectedSubCategory(subCategory);

    setPriceRange({
      min: minPrice ? Math.max(0, Number(minPrice)) : 0,
      max: maxPrice ? Math.min(10000, Number(maxPrice)) : 10000,
    });

    setSortOption(sort);
    setShowOnlySale(sale === "true");
    setCurrentPage(page ? Math.max(0, Number(page) - 1) : 0);
  }, [searchParams]);

  // Update URL when filters change
  const updateUrl = useCallback(() => {
    const newParams = new URLSearchParams();

    if (selectedCategory) newParams.set("category", selectedCategory);
    if (selectedColor) newParams.set("color", selectedColor);
    if (productName) newParams.set("product_name", productName);
    if (debouncedSubCategory)
      newParams.set("sub_category", debouncedSubCategory);
    if (debouncedPriceRange.min > 0)
      newParams.set("min_price", debouncedPriceRange.min.toString());
    if (debouncedPriceRange.max < 10000)
      newParams.set("max_price", debouncedPriceRange.max.toString());
    if (sortOption) newParams.set("sort", sortOption);
    if (showOnlySale) newParams.set("sale", "true");
    if (currentPage > 0) newParams.set("page", (currentPage + 1).toString());

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [
    selectedCategory,
    selectedColor,
    productName,
    debouncedSubCategory,
    debouncedPriceRange,
    sortOption,
    showOnlySale,
    currentPage,
    pathname,
    router,
  ]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Reset currentPage to 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [
    selectedCategory,
    priceRange,
    selectedColor,
    sortOption,
    showOnlySale,
    productName,
    debouncedSubCategory,
  ]);

  // Fetch categories
  useEffect(() => {
    dispatch(getAllCategories({ lang: currentLanguage }));
  }, [dispatch, currentLanguage]);

  // Update API params when filters change
  useEffect(() => {
    setParams({
      lang: currentLanguage,
      page_size: 12,
      page: currentPage + 1,
      category: selectedCategory || undefined,
      sub_category: debouncedSubCategory || undefined,
      min_price:
        debouncedPriceRange.min > 0 ? debouncedPriceRange.min : undefined,
      max_price:
        debouncedPriceRange.max < 10000 ? debouncedPriceRange.max : undefined,
      color: selectedColor || undefined,
      sort:
        sortOption === "priceHighToLow"
          ? "-price"
          : sortOption === "priceLowToHigh"
          ? "price"
          : undefined,
      has_offer: showOnlySale || undefined,
      product_name: debouncedProductName || undefined,
    });
  }, [
    currentPage,
    selectedCategory,
    debouncedPriceRange,
    selectedColor,
    sortOption,
    showOnlySale,
    currentLanguage,
    debouncedProductName,
    debouncedSubCategory,
  ]);

  // Fetch products when API params change
  useEffect(() => {
    dispatch(getAllProducts({ params }));
  }, [dispatch, params]);

  // Clear all filters
  const clearAllFilters = () => {
    setShowOnlySale(false);
    setPriceRange({ min: 0, max: 10000 });
    setSelectedCategory(null);
    setSelectedColor(null);
    setSortOption("");
    setCurrentPage(0);
    router.replace(pathname, { scroll: false });
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      newParams.set("product_name", e.target.value);
    } else {
      newParams.delete("product_name");
    }
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("product_name", suggestion);
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    setShowSuggestions(false);
  };

  // Calculate page count for pagination
  const pageCount = Math.ceil((count ?? 0) / (params.page_size || 12));

  // Helper function to ensure string output
  const getTranslation = (key: string): string => {
    const translation = t(key);
    return typeof translation === 'string' ? translation : String(translation);
  };

  return (
    <>
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container lg:pt-[134px] pt-24 pb-10 relative">
            <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
              <div className="text-content">
                <div className="heading2 text-center">{t('shop.title')}</div>
                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                  <Link href="/">{t('shop.homepage')}</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="text-secondary2 capitalize">{t('shop.title')}</div>
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
              <div className="search-box mb-6 relative">
                <input
                  type="text"
                  placeholder={t('shop.sidebar.searchPlaceholder')}
                  className="w-full p-2 border border-gray-300 rounded border-[rgba(0,0,0,0.1)] focus-within:outline-none focus:outline-none"
                  value={productName}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {loading && productName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon.SpinnerGap className="animate-spin" size={20} />
                  </div>
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-type pb-8 border-b border-line">
                <div className="heading6">{t('shop.sidebar.categories')}</div>
                <div className="list-type mt-4">
                  {categories.map((item, index) => (
                    <div
                      key={index}
                      className={`item flex items-center justify-between cursor-pointer ${
                        selectedCategory === item.name ? "text-black" : ""
                      }`}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        newParams.set("category", item.name);
                        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
                      }}
                    >
                      <div className="text-secondary has-line-before hover:text-black capitalize">
                        {t(item.name)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-price pb-8 border-b border-gray-200 mt-8">
                <div className="text-lg font-semibold text-gray-800 mb-4">
                  {t('shop.sidebar.priceRange')}
                </div>
                <div className="price-block flex items-center justify-between gap-4 mt-4">
                  <div className="min flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('shop.sidebar.minPrice')}
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
                            min: Math.max(0, Number(e.target.value)),
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
                      {t('shop.sidebar.maxPrice')}
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
                            max: Math.min(10000, Number(e.target.value)),
                          })
                        }
                        className="focus:ring-primary-500 border focus:border-primary-500 block w-full pl-7 pr-4 py-2 sm:text-sm border-gray-300 rounded-md"
                        placeholder="10000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="filter-color pb-8 border-b border-line mt-8">
                <div className="heading6">{t('shop.sidebar.colors')}</div>
                <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                  {colors.slice(0, showMore ? colors.length : 59).map((color, i) => (
                    <div
                      key={i}
                      className={`color-item flex items-center justify-center gap-2 rounded-full border border-line ${
                        selectedColor === color.color ? "border-black" : ""
                      }`}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        if (selectedColor === color.color) {
                          newParams.delete("color");
                        } else {
                          newParams.set("color", color.color);
                        }
                        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
                      }}
                    >
                      <div
                        className="color w-5 h-5 rounded-full border-[1px] border-[rgba(0,0,0,0.4)]"
                        style={{ backgroundColor: color.color }}
                      ></div>
                    </div>
                  ))}
                </div>
                {colors.length > 59 && (
                  <button
                    className="block w-full text-center font-medium text-[14px] mt-2"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? t('shop.sidebar.showLess') : t('shop.sidebar.showMore')}
                  </button>
                )}
              </div>

              <div className="sale-block mt-8">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sale"
                    checked={showOnlySale}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(searchParams.toString());
                      if (e.target.checked) {
                        newParams.set("sale", "true");
                      } else {
                        newParams.delete("sale");
                      }
                      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
                    }}
                  />
                  <label htmlFor="sale" className="text-title cursor-pointer">
                    {t('shop.sidebar.saleItems')}
                  </label>
                </div>
              </div>

              <div className="clear-all mt-8">
                <div
                  className="button-main w-full text-center"
                  onClick={clearAllFilters}
                >
                  {t('shop.sidebar.clearAll')}
                </div>
              </div>
            </div>

            <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:ps-3">
              {productName && (
                <div className="mb-4 text-lg">
                  {t('shop.showingResultsFor')}:{" "}
                  <span className="font-semibold">&quot;{productName}&quot;</span>
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams.toString());
                      newParams.delete("product_name");
                      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
                    }}
                    className="ml-2 text-blue-500 hover:underline text-sm"
                  >
                    {t('shop.clearSearch')}
                  </button>
                </div>
              )}

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
                </div>
                <div className="right flex items-center gap-3">
                  <label htmlFor="select-filter" className="caption1 capitalize">
                    {t('shop.sortBy')}
                  </label>
                  <div className="select-block relative">
                    <select
                      id="select-filter"
                      name="select-filter"
                      className="caption1 py-2 ps-3 md:pe-20 pe-10 rounded-lg border border-line"
                      value={sortOption}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        if (e.target.value) {
                          newParams.set("sort", e.target.value);
                        } else {
                          newParams.delete("sort");
                        }
                        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
                      }}
                    >
                      <option value="">{t('shop.sort.default')}</option>
                      <option value="priceHighToLow">{t('shop.sort.priceHighToLow')}</option>
                      <option value="priceLowToHigh">{t('shop.sort.priceLowToHigh')}</option>
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
                    {t('shop.productsFound')}
                  </span>
                </div>
                {(selectedCategory ||
                  selectedColor ||
                  showOnlySale ||
                  productName ||
                  priceRange.min > 0 ||
                  priceRange.max < 10000) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {t('shop.clearAllFilters')}
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
                  <div className="loading-container col-span-full text-center py-10">
                    <Icon.SpinnerGap
                      size={32}
                      className="spinner text-secondary2 mb-4 mx-auto animate-spin"
                    />
                    <div className="loading-text text-secondary2 font-semibold">
                      {t('shop.loadingProducts')}
                    </div>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-10 text-red-500">
                    {t('shop.error')}: {error}
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <Product data={product} key={product.id} type={viewType} />
                  ))
                ) : (
                  <div className="no-data-product col-span-full text-center py-10">
                    {productName ? (
                      <>
                        {t('shop.noProductsFoundFor')} &quot;{productName}&quot;
                        <button
                          onClick={() => {
                            const newParams = new URLSearchParams(searchParams.toString());
                            newParams.delete("product_name");
                            router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
                          }}
                          className="block mx-auto mt-2 text-blue-500 hover:underline"
                        >
                          {t('shop.clearSearchAndTryAgain')}
                        </button>
                      </>
                    ) : (
                      t('shop.noProductsMatchFilters')
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
