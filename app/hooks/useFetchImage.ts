import { useEffect, useState } from "react";

export interface DummyImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export const useFetchImage = ({ page = 1, limit = 100 }): DummyImage[] => {
  const [images, setImages] = useState<DummyImage[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }

    fetchImages();
  }, []);

  return images;
};
