import React, { useEffect, useState } from "react";


interface Post {
  postId: string;
  creator: {
    name: string;
    pic: string;
  };
  submission: {
    title: string;
    description: string;
    thumbnail: string;
    mediaUrl: string;
  };
}

const Saved = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPostsStr = localStorage.getItem("savedPosts");
    if (savedPostsStr) {
      setSavedPosts(JSON.parse(savedPostsStr));
    }
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Saved Posts</h1>
      {savedPosts.length === 0 ? (
        <div className="text-center text-gray-600">No saved posts found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {savedPosts.map((post) => (
            <div
              key={post.postId}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <video
                src={post.submission.mediaUrl}
                className="w-full h-90 object-cover rounded-t-lg"
                autoPlay
                muted
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {post.creator.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.submission.description}
                </p>
                <div className="flex items-center">
                  <img
                    src={post.creator.pic}
                    alt={post.creator.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium">
                    {post.creator.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;

