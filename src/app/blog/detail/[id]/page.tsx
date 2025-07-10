"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import NewsInsight from "@/components/Home3/NewsInsight";
import Footer from "@/components/Footer/Footer";
import { useRouter } from "next/navigation";

interface BlogPageProps {
  params: { id: string };
}
interface blog {
  author: string;
  created_at: string;
  featured_image: string;
  id: number;
  subtitle: string;
  title: string;
  header_image: string;
  content_blocks: {
    id: number;
    order: number;
    block_type: string;
    text: string | null;
    image: string | null;
  }[];
}

const BlogDetailOne = ({ params }: BlogPageProps) => {
  const router = useRouter();
  const { id } = params;

  const [blogMain, setBlogMain] = useState<blog>();

  const [blogs, setBlogs] = useState<blog[]>([]);

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

  useEffect(() => {
    fetch(`https://api.malalshammobel.com/blog/posts/${id}`, {
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
        setBlogMain(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  //   const handleBlogDetail = (id: string) => {
  //     // Go to blog detail with id selected
  //     router.push(`/blog/detail/${id}`);
  //   };

  return (
    <>
      <TopNavOne props="style-one bg-black" />
      <div id="header" className="relative w-full">
        <MenuOne props="bg-white" />
      </div>
      <div className="blog detail1">
        <div className="bg-img md:mt-[74px] mt-14">
          <Image
            src={blogMain?.header_image || ""}
            width={5000}
            height={4000}
            alt={blogMain?.title || "title"}
            className="w-full min-[1600px]:h-[800px] xl:h-[640px] lg:h-[520px] sm:h-[380px] h-[260px] object-cover"
          />
        </div>
        <div className="container md:pt-20 pt-10">
          <div className="blog-content flex items-center justify-center">
            <div className="main md:w-5/6 w-full">
              <div className="heading3 mt-3">{blogMain?.title}</div>
              <div className="author flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="caption1 text-secondary">
                    by {blogMain?.author}
                  </div>
                  <div className="line w-5 h-px bg-secondary"></div>
                  <div className="caption1 text-secondary">
                    {blogMain?.created_at}
                  </div>
                </div>
              </div>
              <div className="content md:mt-8 mt-5 gap-x-[30px] flex flex-wrap">
                <div className="body1">{blogMain?.subtitle}</div>
                {blogMain?.content_blocks?.map((content, i) => {
                  if (content.block_type == "text") {
                    return (
                      <div key={i} className="body1 min-w-full mt-3">
                        {content.text}
                      </div>
                    );
                  } else {
                    console.log(content.image);
                    return (
                      <div key={i} className="flex sm:flex-[calc(50%-30px)] md:mt-8 mt-5">
                        <Image
                          src={content.image || "/"}
                          width={3000}
                          height={2000}
                          alt={blogMain.title}
                          className="w-full rounded-3xl"
                        />
                      </div>
                    );
                  }
                })}
              </div>
              <div className="action flex items-center justify-between flex-wrap gap-5 md:mt-8 mt-5">
                <div className="right flex items-center gap-3 flex-wrap">
                  <p>Share:</p>
                  <div className="list flex items-center gap-3 flex-wrap">
                    <Link
                      href={"https://www.facebook.com/"}
                      target="_blank"
                      className="bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white"
                    >
                      <div className="icon-facebook duration-100"></div>
                    </Link>
                    <Link
                      href={"https://www.instagram.com/"}
                      target="_blank"
                      className="bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white"
                    >
                      <div className="icon-instagram duration-100"></div>
                    </Link>
                    <Link
                      href={"https://www.twitter.com/"}
                      target="_blank"
                      className="bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white"
                    >
                      <div className="icon-twitter duration-100"></div>
                    </Link>
                    <Link
                      href={"https://www.youtube.com/"}
                      target="_blank"
                      className="bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white"
                    >
                      <div className="icon-youtube duration-100"></div>
                    </Link>
                    <Link
                      href={"https://www.pinterest.com/"}
                      target="_blank"
                      className="bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white"
                    >
                      <div className="icon-pinterest duration-100"></div>
                    </Link>
                  </div>
                </div>
              </div>
              {/* <div className="next-pre flex items-center justify-between md:mt-8 mt-5 py-6 border-y border-line">
                {blogId === "1" ? (
                  <>
                    <div
                      className="left cursor-pointer"
                      onClick={() => handleBlogDetail(String(blogData.length))}
                    >
                      <div className="text-button-uppercase text-secondary2">
                        Previous
                      </div>
                      <div className="text-title mt-2">
                        {blogData[blogData.length - 1].title}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="left cursor-pointer"
                      onClick={() =>
                        handleBlogDetail(blogData[Number(blogId) - 2].id)
                      }
                    >
                      <div className="text-button-uppercase text-secondary2">
                        Previous
                      </div>
                      <div className="text-title mt-2">
                        {blogData[Number(blogId) - 2].title}
                      </div>
                    </div>
                  </>
                )}
                {Number(blogId) === blogData.length ? (
                  <>
                    <div
                      className="right text-right cursor-pointer"
                      onClick={() => handleBlogDetail("1")}
                    >
                      <div className="text-button-uppercase text-secondary2">
                        Next
                      </div>
                      <div className="text-title mt-2">{blogData[0].title}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="right text-right cursor-pointer"
                      onClick={() =>
                        handleBlogDetail(blogData[Number(blogId)].id)
                      }
                    >
                      <div className="text-button-uppercase text-secondary2">
                        Next
                      </div>
                      <div className="text-title mt-2">
                        {blogData[Number(blogId)].title}
                      </div>
                    </div>
                  </>
                )}
              </div> */}
            </div>
          </div>
        </div>
        <div className="md:pb-20 pb-10">
          <NewsInsight data={blogs} start={0} limit={3} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetailOne;
