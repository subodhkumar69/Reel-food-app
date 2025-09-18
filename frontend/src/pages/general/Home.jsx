import React, { useEffect, useState } from "react";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";
import API from "../api"; // 👈 import your axios helper (adjust path if needed)

const Home = () => {
  const [videos, setVideos] = useState([]);

  // Fetch all videos
  useEffect(() => {
    API.get("/api/food", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setVideos(response.data.foodItems);
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // Like a video
  async function likeVideo(item) {
    const response = await API.post(
      "/api/food/like",
      { foodId: item._id },
      { withCredentials: true }
    );

    if (response.data.liked) {
      console.log("Video liked");
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v
        )
      );
    } else {
      console.log("Video unliked");
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v
        )
      );
    }
  }

  // Save a video
  async function saveVideo(item) {
    const response = await API.post(
      "/api/food/save",
      { foodId: item._id },
      { withCredentials: true }
    );

    if (response.data.saved) {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v
        )
      );
    } else {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v
        )
      );
    }
  }

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available."
    />
  );
};

export default Home;
