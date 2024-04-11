import React, { useState, useEffect } from "react";
import { Heart, Save } from "react-feather";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Post {
  postId: string;
  creator: {
    name: string;
    id: string;
    handle: string;
    pic: string;
  };
  comment: {
    count: number;
    commentingAllowed: boolean;
  };
  reaction: {
    count: number;
    voted: boolean;
  };
  submission: {
    title: string;
    description: string;
    mediaUrl: string;
    thumbnail: string;
    hyperlink: string;
    placeholderUrl: string;
  };

  isSaved: boolean;
  isLiked: boolean;
}

const Home = () => {
  const [videoPosts, setVideoPosts] = useState<Post[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(9);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? JSON.parse(storedTheme) : false;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [savedPosts, setSavedPosts] = useState<Post[]>(() => {
    const savedPostsStr = localStorage.getItem("savedPosts");
    return savedPostsStr ? JSON.parse(savedPostsStr) : [];
  });
  const [likedPosts, setLikedPosts] = useState<Post[]>(() => {
    const likedPostsStr = localStorage.getItem("likedPosts");
    return likedPostsStr ? JSON.parse(likedPostsStr) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://internship-service.onrender.com/videos?page=${currentPage}`
        );
        const data = await response.json();
        if (data && data.data && data.data.posts) {
          const postsWithDefaults = data.data.posts.map((post: Post) => ({
            ...post,
            isSaved: savedPosts.some((savedPost) => savedPost.postId === post.postId),
            isLiked: likedPosts.some((likedPost) => likedPost.postId === post.postId),
          }));
          setVideoPosts(postsWithDefaults);
          setTotalPages(data.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, savedPosts, likedPosts]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
  }, [savedPosts]);

  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  const handleVideoToggle = (post: Post) => {
    setCurrentVideo(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentVideo(null);
    setIsModalOpen(false);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSaveVideo = (
    post: Post,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (savedPosts.some((savedPost) => savedPost.postId === post.postId)) {
      const updatedSavedPosts = savedPosts.filter(
        (savedPost) => savedPost.postId !== post.postId
      );
      setSavedPosts(updatedSavedPosts);
      toast.success("Video removed from saved list");
    } else {
      setSavedPosts([...savedPosts, post]);
      toast.success("Video saved");
    }
  };

  const handleLikeVideo = (
    post: Post,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (likedPosts.some((likedPost) => likedPost.postId === post.postId)) {
      const updatedLikedPosts = likedPosts.filter(
        (likedPost) => likedPost.postId !== post.postId
      );
      setLikedPosts(updatedLikedPosts);
      toast.success("Video unliked");
    } else {
      setLikedPosts([...likedPosts, post]);
      toast.success("Video liked");
    }
  };

  return (
    <div
      className={` container mx-auto p-8 ${
        darkMode ? "dark-theme" : "light-theme"
      }`}
    >
      <ToastContainer />
      {loading ? (
        <div
          className="loader text-cyan-600 text-center"
          style={{ fontSize: "30px" }}
        >
          Loading.....
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {videoPosts.map((post) => (
              <div
                key={post.postId}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
                onClick={() => handleVideoToggle(post)}
              >
                <div className="relative">
                  <video
                    src={post.submission.mediaUrl}
                    className="w-full h-70 object-cover rounded-t-lg"
                    autoPlay
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white opacity-75 hover:opacity-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3l14 9-14 9V3z"
                      />
                    </svg>
                  </div>
                </div>
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
                    <button
                      className="ml-auto mr-2"
                      onClick={(e) => handleSaveVideo(post, e)}
                    >
                      {post.isSaved ? (
                        <Save color="blue" />
                      ) : (
                        <Save color="gray" />
                      )}
                    </button>
                    <button onClick={(e) => handleLikeVideo(post, e)}>
                      {post.isLiked ? (
                        <Heart color="red" />
                      ) : (
                        <Heart color="gray" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <br />
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="mr-2 px-4 py-2 bg-blue-200 rounded-md text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="ml-2 px-4 py-2 bg-blue-200 rounded-md text-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          {isModalOpen && currentVideo && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={handleCloseModal}
            >
              <div className="relative w-full md:w-1/4">
                <button
                  className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseModal();
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <video
                  src={currentVideo.submission.mediaUrl}
                  className="w-full h-auto"
                  controls
                  autoPlay
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
