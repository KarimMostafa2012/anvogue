'use client'

import React from 'react';
import ReactPaginate from 'react-paginate';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useTranslation } from 'react-i18next';

// HandlePagination component
interface PaginationProps {
    pageCount: number;
    onPageChange: (selected: number) => void;
}

const HandlePagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
    const { t } = useTranslation();
    
    return (
        <ReactPaginate
            previousLabel={<Icon.CaretLeft size={16} className="text-secondary2" />}
            nextLabel={<Icon.CaretRight size={16} className="text-secondary2" />}
            pageCount={pageCount}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            onPageChange={(selectedItem) => onPageChange(selectedItem.selected)}
            containerClassName="pagination flex items-center justify-center gap-2 mt-8"
            pageClassName="mx-1"
            pageLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-secondary2"
            activeClassName="active"
            activeLinkClassName="bg-black text-white"
            previousClassName="mx-1"
            nextClassName="mx-1"
            previousLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 rtl:rotate-180"
            nextLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 rtl:rotate-180"
            disabledClassName="opacity-50 cursor-not-allowed"
            breakLabel={t("...")}
            breakClassName="mx-1 px-3 py-1"
        />
    );
};

export default HandlePagination;
