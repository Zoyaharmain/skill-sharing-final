import { useState } from "react";
import API from "../../api/axios";


const VideoUpload = ({ setVideoUrl, setIsUploading }) => {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    //  Preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      setIsUploading?.(true);

      const res = await API.post("/upload/video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("UPLOAD RESPONSE:", res.data);

      // url extraction
      const url =
        res.data?.videoUrl ||
        res.data?.url ||
        res.data?.data?.videoUrl ||
        "";

      if (!url) {
        alert("Video uploaded but URL missing");
        return;
      }

      
      setVideoUrl(url);

      console.log("🎥 FINAL VIDEO URL:", url);

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
      setIsUploading?.(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    setVideoUrl(""); 
  };
return (
  <div className="w-full h-full flex items-center justify-center">

    {!preview ? (
  <div className="border-2 border-dashed rounded-lg p-6 w-full h-full flex flex-col items-center justify-center text-center">
    {/* ICON */}
    <div className="text-6xl text-gray-500 mb-6">
      🎥
    </div>

    {/* TITLE */}
    <p className="text-xl font-semibold text-gray-800 mb-2">
      Upload Skill Video
    </p>

    {/* SUBTEXT */}
    <p className="text-sm text-gray-500 mb-6">
      Drag & drop your video here or click below
    </p>

    {/* HIDDEN INPUT (IMPORTANT — don’t remove this) */}
    <input
      type="file"
      accept="video/*"
      onChange={handleVideo}
      id="videoUpload"
      className="hidden"
    />

    {/* BUTTON */}
    <label
      htmlFor="videoUpload"
      className="w-fit px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg cursor-pointer hover:opacity-90 shadow-md transition font-medium"
    >
      Choose Video
    </label>

    <p className="text-xs text-gray-400 mt-3">
      MP4, MOV supported
    </p>

  </div>
) : (
      <div className="w-full flex flex-col gap-3">

        <video
          src={preview}
          controls
          className="w-full rounded-lg max-h-64 border border-gray-300 shadow-md"
        />

        {loading && (
          <p className="text-sm text-blue-500 font-medium">
            Uploading video...
          </p>
        )}

        {!loading && (
          <button
            onClick={handleRemove}
            className=" mx-auto text-sm text-red-500 hover:underline self-start"
          >
            Remove video
          </button>
        )}

      </div>
    )}

  </div>
  
);
};

export default VideoUpload;