import React, { useState, useEffect } from "react";
import axios from "axios";

function UploadData() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bio, setBio] = useState("");
  const [video, setVideo] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [videos, setVideos] = useState([]);
  const [userInfo, setUserInfo] = useState({ firstName: "", email: "" });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/users/me"); // Assuming this endpoint returns user info
        setUserInfo(response.data);
        setVideos(response.data.videos); // Assuming user data includes videos
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleProfilePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo({ ...video, [e.target.name]: e.target.value });
  };

  const handleVideoFileChange = (e) => {
    setVideo({ ...video, file: e.target.files[0] });
  };

  const handleSubmitProfilePhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePhoto", profilePhoto);

    try {
      await axios.post("/api/upload/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading profile photo", error);
      alert("Error uploading profile photo");
    }
  };

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", video.title);
    formData.append("description", video.description);
    formData.append("video", video.file);

    try {
      await axios.post("/api/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video uploaded successfully");
      setVideos([
        ...videos,
        {
          title: video.title,
          description: video.description,
          url: video.file.name,
        },
      ]);
      setVideo({ title: "", description: "", file: null });
    } catch (error) {
      console.error("Error uploading video", error);
      alert("Error uploading video");
    }
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/update-bio", { bio });
      alert("Bio updated successfully");
    } catch (error) {
      console.error("Error updating bio", error);
      alert("Error updating bio");
    }
  };

  return (
    <div>
      <h1>Upload Data</h1>
      <p>Welcome, {userInfo.firstName}</p>
      <p>Email: {userInfo.email}</p>

      <form onSubmit={handleSubmitProfilePhoto}>
        <input
          type="file"
          onChange={handleProfilePhotoChange}
          accept="image/*"
          required
        />
        <button type="submit">Upload Profile Photo</button>
      </form>

      <form onSubmit={handleBioSubmit}>
        <textarea
          placeholder="Add your bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength="400"
          required
        />
        <button type="submit">Update Bio</button>
      </form>

      <form onSubmit={handleSubmitVideo}>
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={video.title}
          onChange={handleVideoChange}
          maxLength="20"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Video Description"
          value={video.description}
          onChange={handleVideoChange}
          maxLength="30"
          required
        />
        <input
          type="file"
          onChange={handleVideoFileChange}
          accept="video/mp4"
          required
        />
        <button type="submit">Upload Video</button>
      </form>

      <div>
        <h2>Uploaded Videos</h2>
        {videos.map((video, index) => (
          <div key={index}>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadData;
