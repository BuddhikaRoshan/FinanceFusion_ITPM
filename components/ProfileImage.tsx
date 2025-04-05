import { useState, useRef, useEffect } from "react";
import { Upload, User, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ProfileImageProps {
  userId: string;
}

const ProfileImage = ({ userId }: ProfileImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's profile image
  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const user = await response.json();
        setImageUrl(user.imageUrl || null);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load profile image"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserImage();
  }, [userId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // First upload the image file
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Image upload failed");

      const result = await uploadResponse.json();
      console.log(result);
      // Then update the user's profile with the new image URL
      const updateResponse = await fetch(`/api/users?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: result.path }),
      });

      if (!updateResponse.ok) throw new Error("Profile update failed");

      // Update local state with the new image URL
      setImageUrl(result.path);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile picture"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-600 bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <User className="h-16 w-16 text-gray-500" />
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-all"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          <Upload className="h-5 w-5 text-white" />
        )}
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ProfileImage;
