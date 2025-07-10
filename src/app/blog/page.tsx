"use client";
import React, { useState, useEffect } from "react";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import BlogItem from "@/components/Blog/BlogItem";
import Footer from "@/components/Footer/Footer";
import HandlePagination from "@/components/Other/HandlePagination";

interface blog {
  author: string;
  created_at: string;
  featured_image: string;
  id: number;
  subtitle: string;
  title: string;
}

const BlogGrid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [blogs, setBlogs] = useState<blog[]>([]);
  const productsPerPage = 9;
  const offset = currentPage * productsPerPage;

  useEffect(() => {
    fetch(`https://api.malalshammobel.com/blog/posts/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
        } else {
          console.log(response);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setBlogs(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const pageCount = Math.ceil(blogs.length / productsPerPage);

  // If page number 0, set current page = 0
  useEffect(() => {
    if (pageCount === 0) {
      setCurrentPage(0);
    }
  }, [pageCount]);

  const currentProducts = blogs.slice(offset, offset + productsPerPage);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading="Blog Grid" subHeading="Blog Grid" />
      </div>
      <div className="blog grid md:py-20 py-10">
        <div className="container">
          <div className="list-blog grid lg:grid-cols-3 sm:grid-cols-2 md:gap-[42px] gap-8">
            {currentProducts.map((item) => (
              <BlogItem key={item.id} data={item} type="style-one" />
            ))}
          </div>
          {pageCount > 1 && (
            <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
              <HandlePagination
                pageCount={pageCount}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogGrid;
