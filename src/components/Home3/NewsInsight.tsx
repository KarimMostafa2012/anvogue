import React from "react";
import BlogItem from "../Blog/BlogItem";

interface blog {
  author: string;
  created_at: string;
  featured_image: string;
  id: number;
  subtitle: string;
  title: string;
}

interface Props {
  data: Array<blog>;
  start: number;
  limit: number;
}

const NewsInsight: React.FC<Props> = ({ data, start, limit }) => {
  return (
    <>
      <div className="news-block md:pt-20 pt-10">
        <div className="container">
          <div className="heading3 text-center">News insight</div>
          <div className="list-blog grid md:grid-cols-3 gap-[30px] md:mt-10 mt-6">
            {data.slice(start, limit).map((prd, index) => (
              <BlogItem key={index} data={prd} type="style-one" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsInsight;
