"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LikeViewComment({ productId }: { productId: string }) {
    const [views, setViews] = useState(0);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        axios.post(`/api/products/${productId}/view`).then(res => setViews(res.data.views));

        // ✅ Dùng GET thay vì POST
        axios.get(`/api/products/${productId}/like/check`).then(res => {
            setLikes(res.data.likes);
            setLiked(res.data.liked);
        });

        axios.get(`/api/products/${productId}/comment`).then(res => setComments(res.data.comments));
    }, [productId]);


    const toggleLike = () => {
        axios.post(`/api/products/${productId}/like`).then(res => {
            setLikes(res.data.likes);
            setLiked(res.data.liked);
        });
    };

    const submitComment = async () => {
        if (!comment.trim()) return;
        const res = await axios.post(`/api/products/${productId}/comment`, { content: comment });
        setComments(res.data.comments);
        setComment("");
    };

    return (
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            {/* Views & Likes */}
            <div className="flex items-center justify-start gap-6 text-base text-gray-700 font-medium">
                <div className="flex items-center gap-1">
                    👁️ <span className="font-semibold text-blue-800">{views}</span> lượt xem
                </div>
                <button
                    onClick={toggleLike}
                    className={`flex items-center gap-1 transition-all duration-200 ${liked ? "text-pink-600" : "text-gray-500 hover:text-pink-600"
                        }`}
                >
                    {liked ? "💖" : "🤍"} <span className="font-semibold">{likes}</span> lượt tym
                </button>
            </div>

            {/* Input Comment */}
            <div className="space-y-3">
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
                    rows={3}
                    placeholder="Nhập bình luận..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <button
                    onClick={submitComment}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition font-semibold"
                >
                    Gửi bình luận
                </button>
            </div>

            {/* Hiển thị bình luận */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {comments.length > 0 ? (
                    comments.map(c => (
                        <div key={c.id} className="border-b pb-2 text-sm text-gray-800">
                            <span className="font-semibold text-blue-900">{c.user?.name || "Ẩn danh"}:</span>{" "}
                            {c.content}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm italic">Chưa có bình luận nào.</p>
                )}
            </div>
        </div>
    );
}
