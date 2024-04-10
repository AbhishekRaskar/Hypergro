import React, { useState, useEffect } from "react";
import { Heart, Save } from "react-feather";

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
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true while fetching data
      try {
        const response = await fetch(
          `https://internship-service.onrender.com/videos?page=${currentPage}`
        );
        const data = await response.json();
        if (data && data.data && data.data.posts) {
          const postsWithDefaults = data.data.posts.map((post: Post) => ({
            ...post,
            isSaved: false,
            isLiked: false,
          }));
          setVideoPosts(postsWithDefaults);
          setTotalPages(data.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    };

    fetchData();

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleVideoToggle = (post: Post) => {
    setCurrentVideo(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentVideo(null);
    setIsModalOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      event.target instanceof HTMLElement &&
      !event.target.closest(".relative")
    ) {
      setIsModalOpen(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSaveVideo = (postId: string) => {
    const updatedPosts = videoPosts.map((post) =>
      post.postId === postId ? { ...post, isSaved: !post.isSaved } : post
    );
    setVideoPosts(updatedPosts);

    localStorage.setItem("videoPosts", JSON.stringify(updatedPosts));
  };

  const handleLikeVideo = (postId: string) => {
    const updatedPosts = videoPosts.map((post) =>
      post.postId === postId ? { ...post, isLiked: !post.isLiked } : post
    );
    setVideoPosts(updatedPosts);

    localStorage.setItem("videoPosts", JSON.stringify(updatedPosts));
  };

  return (
    <div
      className={` container mx-auto p-8 ${
        darkMode ? "dark-theme" : "light-theme"
      }`}
    >
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
                        d="M6 18L18 6M6 6l12 12"
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
                      onClick={() => handleSaveVideo(post.postId)}
                    >
                      {post.isSaved ? (
                        <Save color="blue" />
                      ) : (
                        <Save color="gray" />
                      )}
                    </button>
                    <button onClick={() => handleLikeVideo(post.postId)}>
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
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative w-full md:w-1/4">
                <button
                  className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                  onClick={handleCloseModal}
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
