/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      fetch("http://localhost:2048/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ title, body, picture: url }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Post created successfully");
            navigate("/");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error creating post:", err);
          toast.error("Could not create post. Please try again.");
        });
    }
  }, [url]);

  const postDetails = () => {
    if (!image) {
      toast.error("Please select an image to upload.");
      return;
    }
    if (image.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Insta-Clone");
    data.append("cloud_name", "dyuqftfhd");

    fetch("https://api.cloudinary.com/v1_1/dyuqftfhd/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.secure_url) {
          setUrl(data.secure_url);
        } else {
          throw new Error("Upload failed: " + JSON.stringify(data));
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Cloudinary Upload Error:", err);
        toast.error("Image upload failed. Please try again.");
      });
  };

  // 🛑 Cancel Action: Resets form & optionally navigates back
  const handleCancel = () => {
    setTitle("");
    setBody("");
    setImage(null);
    setUrl("");
    toast.info("Post creation canceled");
    navigate("/"); // Remove this line if you want to stay on the page
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center gap-4 w-[90%] sm:w-[400px] shadow-lg py-6 px-4 bg-white rounded-2xl">
        <h2 className="text-2xl font-semibold text-gray-900">Create Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-3 rounded-md outline-none w-full focus:border-blue-500"
        />
        <textarea
          placeholder="Write a caption..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="border border-gray-300 p-3 rounded-md outline-none w-full focus:border-blue-500 resize-none h-24"
        />
        <label className="w-full">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <div className="border border-gray-300 rounded-md p-3 w-full text-center cursor-pointer hover:bg-gray-200 transition">
            {image ? image.name : "Choose an image"}
          </div>
        </label>

        {/* Buttons Section */}
        <div className="flex gap-2 w-full">
          <button
            className="w-1/2 bg-blue-500 text-white py-2 text-md font-semibold rounded-md hover:bg-blue-600 transition duration-300 tracking-wide disabled:bg-gray-400"
            onClick={postDetails}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Post"}
          </button>
          <button
            className="w-1/2 bg-red-500 text-white py-2 text-md font-semibold rounded-md hover:bg-red-600 transition duration-300 tracking-wide"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
