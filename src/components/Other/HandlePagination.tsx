'use client'

import React from 'react';
import ReactPaginate from 'react-paginate';
import * as Icon from "@phosphor-icons/react/dist/ssr";

// HandlePagination component
interface PaginationProps {
    pageCount: number;
    onPageChange: (selected: number) => void;
}

const HandlePagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
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
            previousLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            nextLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            disabledClassName="opacity-50 cursor-not-allowed"
            breakLabel="..."
            breakClassName="mx-1 px-3 py-1"
        />
    );
};

export default HandlePagination;
