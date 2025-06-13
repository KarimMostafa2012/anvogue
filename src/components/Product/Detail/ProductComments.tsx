"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface Comment {
  id: number;
  product: number;
  comment: string;
  created_at: string;
  comment_owner: boolean;
}

interface ProductCommentsProps {
  productId: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`https://api.malalshammobel.com/products/comment/?product=${productId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  // Submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.malalshammobel.com/products/comment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productId,
          comment: commentForm.comment,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.includes("User must be parched this product")) {
          toast.error("You must purchase this product before leaving a comment");
        } else {
          toast.error("Failed to submit comment");
        }
        return;
      }

      toast.success("Comment submitted successfully");
      setCommentForm({ comment: '' });
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error("Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [productId]);

  return (
    <div className="mt-8">
      <div className="heading flex items-center justify-between flex-wrap gap-4">
        <div className="heading4">{comments.length} Comments</div>
      </div>
      <div className="list-review mt-6">
        {comments.map((comment) => (
          <div key={comment.id} className="item mt-8">
            <div className="heading flex items-center justify-between">
              <div className="user-infor flex gap-4">
                <div className="avatar">
                  <Image
                    src={"/images/avatar/1.png"}
                    width={200}
                    height={200}
                    alt="img"
                    className="w-[52px] aspect-square rounded-full"
                  />
                </div>
                <div className="user">
                  <div className="flex items-center gap-2">
                    <div className="text-title">{comment.comment_owner ? 'You' : 'Anonymous'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-secondary2">{comment.created_at}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              {comment.comment}
            </div>
          </div>
        ))}
      </div>
      <div id="form-review" className="form-review pt-6">
        <div className="heading4">Leave A comment</div>
        <form onSubmit={handleSubmitComment} className="grid sm:grid-cols-2 gap-4 gap-y-5 md:mt-6 mt-3">
          <div className="col-span-full message">
            <textarea
              className="border border-line px-4 py-3 w-full rounded-lg"
              value={commentForm.comment}
              onChange={(e) => setCommentForm({ comment: e.target.value })}
              placeholder="Your comment *"
              required
            ></textarea>
          </div>
          <div className="col-span-full sm:pt-3">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="button-main bg-white text-black border border-black"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductComments; 