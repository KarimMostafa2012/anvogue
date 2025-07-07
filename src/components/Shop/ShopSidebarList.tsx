"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/slices/productSlice";
import Product from "../Product/Product";
import ReactPaginate from "react-paginate";
import { useTranslation } from "react-i18next";
import { getAllCategories } from "@/redux/slices/categorySlice";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

interface Params {
  product_name?: string;
  min_price?: number;
  max_price?: number;
  category?: string;
  sub_category?: string | undefined;
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

const HandlePagination: React.FC<PaginationProps> = React.memo(
  ({ pageCount, onPageChange, forcePage }) => {
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
  }
);
HandlePagination.displayName = "HandlePagination"; // Add display name for better debugging

interface ShopSidebarListProps {
  className?: string;
}

const ShopSidebarList = ({ className }: ShopSidebarListProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language);

  // Flag to prevent initial fetch on mount when state is initialized from URL
  const hasInitializedFromURL = useRef(false);

  // Memoize search params to prevent unnecessary recalculations
  const memoizedSearchParams = useMemo(() => {
    return {
      category: searchParams.get("category"),
      color: searchParams.get("color"),
      sub_category: searchParams.get("sub_category") || "",
      min_price: searchParams.get("min_price"),
      max_price: searchParams.get("max_price"),
      sort: searchParams.get("sort") || "",
      sale: searchParams.get("sale") || "",
      page: searchParams.get("page"),
      product_name: searchParams.get("product_name") || "",
    };
  }, [searchParams]);

  // Consolidated local state for filters
  const [localState, setLocalState] = useState(() => {
    // Initialize state from URL params directly during the initial render
    const params = {
      category: searchParams.get("category"),
      color: searchParams.get("color"),
      sub_category: searchParams.get("sub_category") || undefined,
      min_price: searchParams.get("min_price"),
      max_price: searchParams.get("max_price"),
      sort: searchParams.get("sort"),
      sale: searchParams.get("sale") || false,
      page: searchParams.get("page"),
      product_name: searchParams.get("product_name") || "",
    };

    return {
      viewType: "grid" as "grid" | "list" | "marketplace",
      showOnlySale: params.sale === "true",
      sortOption: params.sort,
      priceRange: {
        min: params.min_price ? Math.max(0, Number(params.min_price)) : 0,
        max: params.max_price
          ? Math.min(10000, Number(params.max_price))
          : 10000,
      },
      selectedCategory: params.category,
      selectedSubCategory: params.sub_category,
      selectedColor: params.color,
      currentPage: params.page ? Math.max(0, Number(params.page) - 1) : 0,
      productNameInput: params.product_name,
    };
  });
  // Immediate API params (no debounce for initial load)
  const immediateApiParams = useMemo(() => {
    return {
      lang: currentLanguage,
      page_size: 12,
      page: localState.currentPage + 1,
      category: localState.selectedCategory || undefined,
      sub_category: localState.selectedSubCategory || undefined,
      min_price:
        localState.priceRange.min > 0 ? localState.priceRange.min : undefined,
      max_price:
        localState.priceRange.max < 10000
          ? localState.priceRange.max
          : undefined,
      color: localState.selectedColor || undefined,
      sort:
        localState.sortOption === "priceHighToLow"
          ? "-price"
          : localState.sortOption === "priceLowToHigh"
          ? "price"
          : undefined,
      has_offer: localState.showOnlySale || undefined,
      product_name: localState.productNameInput || undefined,
    };
  }, [
    currentLanguage,
    localState.currentPage,
    localState.selectedCategory,
    localState.selectedColor,
    localState.sortOption,
    localState.showOnlySale,
    localState.selectedSubCategory,
    localState.priceRange.min,
    localState.priceRange.max,
    localState.productNameInput,
  ]);

  // Debounced API params for subsequent changes
  const [debouncedApiParams] = useDebounce(immediateApiParams, 500);

  // UI state
  const [showMore, setShowMore] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [colors, setColors] = useState<
    { id: string; product: number; color: string }[]
  >([]);

  // Redux state
  const { products, count, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  // Debounced values for API calls
  const [debouncedProductName] = useDebounce(localState.productNameInput, 500);
  const [debouncedMinPrice] = useDebounce(localState.priceRange.min, 500);
  const [debouncedMaxPrice] = useDebounce(localState.priceRange.max, 500);
  const [debouncedSubCategory] = useDebounce(
    localState.selectedSubCategory,
    500
  );

  // Fetch colors from API (runs only once on mount)
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

  // Fetch categories (runs when language changes)
  useEffect(() => {
    dispatch(getAllCategories({ lang: currentLanguage }));
  }, [dispatch, currentLanguage]);

  // Consolidated API params - now depends on debounced values for certain filters
  // Consolidated API params - now depends on debounced values for certain filters
  const apiParams = useMemo(() => {
    return {
      lang: currentLanguage,
      page_size: 12,
      page: localState.currentPage + 1,
      category: localState.selectedCategory || undefined,
      sub_category: debouncedSubCategory || undefined, // Uses debounced
      min_price: debouncedMinPrice > 0 ? debouncedMinPrice : undefined, // Uses debounced
      max_price: debouncedMaxPrice < 10000 ? debouncedMaxPrice : undefined, // Uses debounced
      color: localState.selectedColor || undefined,
      sort:
        localState.sortOption === "priceHighToLow"
          ? "-price"
          : localState.sortOption === "priceLowToHigh"
          ? "price"
          : undefined,
      has_offer: localState.showOnlySale || undefined,
      product_name: debouncedProductName || undefined, // Uses debounced
    };
  }, [
    currentLanguage,
    localState.currentPage,
    localState.selectedCategory,
    localState.selectedColor,
    localState.sortOption,
    localState.showOnlySale,
    debouncedSubCategory,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedProductName,
  ]);

  // Fetch products when API params change (debounced values are stable here)
  useEffect(() => {
    console.log("Dispatching getAllProducts with params:", apiParams);
    dispatch(getAllProducts({ params: apiParams }));
  }, [dispatch, apiParams]); // This will run on initial mount and subsequent debounced changes

  // Fetch products when API params change (debounced values are stable here)
  useEffect(() => {
    // Prevent fetching on the initial mount if params are already set from URL
    // and we are just setting up the initial state
    if (!hasInitializedFromURL.current) {
      hasInitializedFromURL.current = true;
      // Optionally, check if any debounced values are still pending here
      // If initial load should wait for debounced values, you might skip
      // the fetch based on whether debounced values match initial URL values.
      // For simplicity, we assume initial URL values are the "debounced" ones for the first render.
      // If the product_name from URL is empty, `debouncedProductName` will also be empty immediately.
      // If it has a value, it will be the initial value, and debouncing won't affect the *first* fetch for it.
    } else {
      const fetchProducts = async () => {
        console.log(apiParams);
        dispatch(getAllProducts({ params: apiParams }));
      };
      fetchProducts();
    }
  }, [dispatch, apiParams]); // apiParams is stable due to useMemo and debounced inputs

  // Update URL when state changes (uses debounced values for query parameters)
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (localState.selectedCategory)
      newParams.set("category", localState.selectedCategory);
    if (localState.selectedColor)
      newParams.set("color", localState.selectedColor);
    if (debouncedProductName)
      newParams.set("product_name", debouncedProductName); // Use debounced value
    if (debouncedSubCategory)
      newParams.set("sub_category", debouncedSubCategory); // Use debounced value
    if (debouncedMinPrice > 0)
      newParams.set("min_price", debouncedMinPrice.toString()); // Use debounced value
    if (debouncedMaxPrice < 10000)
      newParams.set("max_price", debouncedMaxPrice.toString()); // Use debounced value
    if (localState.sortOption) newParams.set("sort", localState.sortOption);
    if (localState.showOnlySale) newParams.set("sale", "true");
    // Only set page param if it's not the first page (to keep URLs cleaner)
    if (localState.currentPage > 0)
      newParams.set("page", (localState.currentPage + 1).toString());

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [
    localState.selectedCategory,
    localState.selectedColor,
    localState.sortOption,
    localState.showOnlySale,
    localState.currentPage,
    debouncedSubCategory,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedProductName,
    pathname,
    router,
  ]);

  // Handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalState((prev) => ({
        ...prev,
        productNameInput: e.target.value, // Update immediate input value
        currentPage: 0, // Reset page on new search
      }));
      // No direct router update here, debounce handles it via debouncedProductName useEffect
    },
    []
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setLocalState((prev) => ({
      ...prev,
      productNameInput: suggestion,
      currentPage: 0,
    }));
    setShowSuggestions(false);
  }, []);

  const handleCategoryChange = useCallback((categoryName: string) => {
    setLocalState((prev) => ({
      ...prev,
      selectedCategory:
        prev.selectedCategory === categoryName ? null : categoryName,
      currentPage: 0,
    }));
  }, []);

  const handleColorChange = useCallback((colorName: string) => {
    setLocalState((prev) => ({
      ...prev,
      selectedColor: prev.selectedColor === colorName ? null : colorName,
      currentPage: 0,
    }));
  }, []);

  const handleMinPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalState((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          min: Math.max(0, Number(e.target.value)),
        },
        currentPage: 0,
      }));
    },
    []
  );

  const handleMaxPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalState((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          max: Math.min(10000, Number(e.target.value)),
        },
        currentPage: 0,
      }));
    },
    []
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLocalState((prev) => ({
        ...prev,
        sortOption: e.target.value,
        currentPage: 0,
      }));
    },
    []
  );

  const handleSaleToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalState((prev) => ({
        ...prev,
        showOnlySale: e.target.checked,
        currentPage: 0,
      }));
    },
    []
  );

  const handlePageChange = useCallback((selectedPage: number) => {
    setLocalState((prev) => ({
      ...prev,
      currentPage: selectedPage,
    }));
    const element = document.querySelector(".shop-product");
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setLocalState({
      viewType: "grid",
      showOnlySale: false,
      sortOption: "",
      priceRange: { min: 0, max: 10000 },
      selectedCategory: null,
      selectedSubCategory: undefined,
      selectedColor: null,
      currentPage: 0,
      productNameInput: "", // Clear the search input as well
    });
    router.replace(pathname, { scroll: false }); // Clear URL params
  }, [pathname, router]);

  // Calculate page count
  const pageCount = Math.ceil((count ?? 0) / 12);

  return (
    <>
      {/* Breadcrumb section */}
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container lg:pt-[134px] pt-24 pb-10 relative">
            <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
              <div className="text-content">
                <div className="heading2 text-center">{t("shop.title")}</div>
                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                  <Link href="/">{t("shop.homepage")}</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="text-secondary2 capitalize">
                    {t("shop.title")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main shop content */}
      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="flex max-md:flex-wrap max-md:flex-col-reverse gap-y-8">
            {/* Sidebar filters */}
            <div className="sidebar lg:w-1/4 md:w-1/3 w-full md:pe-12">
              {/* Search box */}
              <div className="search-box mb-6 relative">
                <input
                  type="text"
                  placeholder={t("shop.sidebar.searchPlaceholder")}
                  className="w-full p-2 border border-gray-300 rounded border-[rgba(0,0,0,0.1)] focus-within:outline-none focus:outline-none"
                  value={localState.productNameInput} // Bind to local input state
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                {loading &&
                  localState.productNameInput && ( // Use local input state for loading indicator
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

              {/* Category filter */}
              <div className="filter-type pb-8 border-b border-line">
                <div className="heading6">{t("shop.sidebar.categories")}</div>
                <div className="list-type mt-4">
                  {categories.map((item, index) => (
                    <div
                      key={index}
                      className={`item flex items-center justify-between cursor-pointer`}
                      onClick={() => handleCategoryChange(item.name)}
                    >
                      <div
                        className={`text-secondary has-line-before hover:text-black capitalize ${
                          localState.selectedCategory === item.name
                            ? "!text-black font-bold"
                            : ""
                        }`}
                      >
                        {t(item.name)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price range filter */}
              <div className="filter-price pb-8 border-b border-gray-200 mt-8">
                <div className="text-lg font-semibold text-gray-800 mb-4">
                  {t("shop.sidebar.priceRange")}
                </div>
                <div className="price-block flex items-center justify-between gap-4 mt-4">
                  <div className="min flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("shop.sidebar.minPrice")}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={localState.priceRange.min}
                        onChange={handleMinPriceChange}
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
                      {t("shop.sidebar.maxPrice")}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={localState.priceRange.max}
                        onChange={handleMaxPriceChange}
                        className="focus:ring-primary-500 border focus:border-primary-500 block w-full pl-7 pr-4 py-2 sm:text-sm border-gray-300 rounded-md"
                        placeholder="10000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color filter */}
              <div className="filter-color pb-8 border-b border-line mt-8">
                <div className="heading6">{t("shop.sidebar.colors")}</div>
                <div className="list-color flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                  {colors
                    .slice(0, showMore ? colors.length : 59)
                    .map((color, i) => (
                      <div
                        key={i}
                        className={`color-item flex items-center justify-center gap-2 rounded-full border border-line ${
                          localState.selectedColor === color.color
                            ? "border-[rgba(0,0,0,0.5)] border-[2px]"
                            : ""
                        }`}
                        onClick={() => handleColorChange(color.color)}
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
                    {showMore
                      ? t("shop.sidebar.showLess")
                      : t("shop.sidebar.showMore")}
                  </button>
                )}
              </div>

              {/* Clear all filters */}
              <div className="clear-all mt-8">
                <button
                  className="button-main w-full text-center"
                  onClick={clearAllFilters}
                >
                  {t("shop.sidebar.clearAll")}
                </button>
              </div>
            </div>

            {/* Product listing */}
            <div className="list-product-block lg:w-3/4 md:w-2/3 w-full md:ps-3">
              {/* Search results header */}
              {memoizedSearchParams.product_name && (
                <div className="mb-4 text-lg">
                  {t("shop.showingResultsFor")}:{" "}
                  <span className="font-semibold">
                    &quot;{memoizedSearchParams.product_name}&quot;
                  </span>
                  <button
                    onClick={() => {
                      const newParams = new URLSearchParams(
                        searchParams.toString()
                      );
                      newParams.delete("product_name");
                      router.replace(`${pathname}?${newParams.toString()}`, {
                        scroll: false,
                      });
                      setLocalState((prev) => ({
                        // Also update local state to reflect cleared search
                        ...prev,
                        productNameInput: "",
                        currentPage: 0,
                      }));
                    }}
                    className="ml-2 text-blue-500 hover:underline text-sm"
                  >
                    {t("shop.clearSearch")}
                  </button>
                </div>
              )}

              {/* View controls and sorting */}
              <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                <div className="left flex has-line items-center flex-wrap gap-5">
                  <div className="choose-layout flex items-center gap-2">
                    <div
                      onClick={() =>
                        setLocalState((prev) => ({ ...prev, viewType: "grid" }))
                      }
                      className={`item three-col w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer ${
                        localState.viewType === "grid" ? "active" : ""
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                        <span className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setLocalState((prev) => ({ ...prev, viewType: "list" }))
                      }
                      className={`item row w-8 h-8 border border-line rounded flex items-center justify-center cursor-pointer ${
                        localState.viewType === "list" ? "active" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="w-4 h-[3px] bg-secondary2 rounded-sm"></span>
                        <span className="w-4 h-[3px] bg-secondary2 rounded-sm"></span>
                        <span className="w-4 h-[3px] bg-secondary2 rounded-sm"></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="block-input">
                      <input
                        type="checkbox"
                        id="sale"
                        checked={localState.showOnlySale}
                        onChange={handleSaleToggle}
                      />
                      <Icon.CheckSquare
                        size={20}
                        weight="fill"
                        className="icon-checkbox"
                      />
                    </div>
                    <label
                      htmlFor="sale"
                      className="text-secondary cursor-pointer"
                    >
                      {t("shop.sidebar.saleItems")}
                    </label>
                  </div>
                </div>
                <div className="right flex items-center gap-3">
                  <label
                    htmlFor="select-filter"
                    className="caption1 capitalize"
                  >
                    {t("shop.sortBy")}
                  </label>
                  <div className="select-block relative">
                    <select
                      id="select-filter"
                      name="select-filter"
                      className="caption1 py-2 ps-3 md:pe-20 pe-10 rounded-lg border border-line"
                      value={localState.sortOption || ""}
                      onChange={handleSortChange}
                    >
                      <option value="">{t("shop.sort.default")}</option>
                      <option value="priceHighToLow">
                        {t("shop.sort.priceHighToLow")}
                      </option>
                      <option value="priceLowToHigh">
                        {t("shop.sort.priceLowToHigh")}
                      </option>
                    </select>
                    <Icon.CaretDown
                      size={12}
                      className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                    />
                  </div>
                </div>
              </div>

              {/* Filter summary */}
              <div className="list-filtered flex items-center gap-3 mt-4">
                <div className="total-product">
                  {count ?? 0}
                  <span className="text-secondary ps-1">
                    {t("shop.productsFound")}
                  </span>
                </div>
                {(localState.selectedCategory ||
                  localState.selectedColor ||
                  localState.showOnlySale ||
                  localState.productNameInput || // Use local input state for clear all
                  localState.priceRange.min > 0 ||
                  localState.priceRange.max < 10000) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {t("shop.clearAllFilters")}
                  </button>
                )}
              </div>

              {/* Product grid/list */}
              <div
                className={`list-product ${
                  localState.viewType === "grid"
                    ? "grid lg:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px]"
                    : localState.viewType === "list"
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
                      {t("shop.loadingProducts")}
                    </div>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-10 text-red-500">
                    {t("shop.error")}: {error}
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <Product
                      data={product}
                      key={product.id}
                      type={localState.viewType}
                    />
                  ))
                ) : (
                  <div className="no-data-product col-span-full text-center py-10">
                    {localState.productNameInput ? ( // Use local input state
                      <>
                        {t("shop.noProductsFoundFor")} &quot;
                        {localState.productNameInput}&quot;
                        <button
                          onClick={() => {
                            const newParams = new URLSearchParams(
                              searchParams.toString()
                            );
                            newParams.delete("product_name");
                            router.replace(
                              `${pathname}?${newParams.toString()}`,
                              { scroll: false }
                            );
                            setLocalState((prev) => ({
                              // Also update local state
                              ...prev,
                              productNameInput: "",
                              currentPage: 0,
                            }));
                          }}
                          className="block mx-auto mt-2 text-blue-500 hover:underline"
                        >
                          {t("shop.clearSearchAndTryAgain")}
                        </button>
                      </>
                    ) : (
                      t("shop.noProductsMatchFilters")
                    )}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <HandlePagination
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  forcePage={localState.currentPage}
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
