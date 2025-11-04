"use client";

import React, { useState, useEffect } from "react";

type CommentType = {
  email: string;
  comment: string;
  createdAt: string;
};

type ProductInteractionProps = {
  productId: string;
};

const ProductInteraction = ({ productId }: ProductInteractionProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInteraction() {
      try {
        const res = await fetch(`/api/products/interaction?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments ?? []);
          setLikes(data.likes ?? 0);
          setViews(data.views ?? 0);
        } else {
          console.error("Failed to fetch interaction");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchInteraction();

    // Increase views once when component mounts
    async function increaseView() {
      try {
        const res = await fetch(`/api/products/interaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, action: "view" }),
        });
        if (res.ok) {
          setViews((v) => v + 1);
        }
      } catch (error) {
        console.error(error);
      }
    }

    increaseView();
  }, [productId]);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/products/interaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "like" }),
      });
      if (res.ok) {
        setLikes((l) => l + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    try {
      const res = await fetch(`/api/products/interaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "comment", comment: trimmedComment }),
      });
      if (res.ok) {
        // Option 1: Reload all comments from server to be accurate
        // OR Option 2: Append new comment optimistically
        setComments((prev) => [
          ...prev,
          {
            email: "You",
            comment: trimmedComment,
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewComment("");
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading interactions...</p>;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={handleLike}
          aria-label="Like this product"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
        >
          ❤️ Like
        </button>
        <div className="text-gray-700 font-medium text-lg select-none">
          {likes} {likes === 1 ? "Like" : "Likes"} · {views} {views === 1 ? "View" : "Views"}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Comments</h3>

        <form onSubmit={handleAddComment} className="flex gap-3 mb-5">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-red-600 disabled:bg-red-300 transition"
          >
            Post
          </button>
        </form>

        <ul className="max-h-48 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {comments.length === 0 ? (
            <li className="text-gray-400 italic text-center select-none">No comments yet</li>
          ) : (
            comments.map(({ email, comment, createdAt }, i) => (
              <li key={i} className="bg-red-50 rounded-lg p-3 shadow-sm text-gray-700 break-words">
                <p className="font-semibold text-sm text-gray-600">
                  {email}{" "}
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(createdAt).toLocaleString()}
                  </span>
                </p>
                <p>{comment}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductInteraction;
