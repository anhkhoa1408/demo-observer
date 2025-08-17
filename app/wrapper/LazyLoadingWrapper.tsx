'use client';

import { useEffect, useRef, useState } from 'react';
import { RANDOM_IMAGE_HEIGHTS } from '~/constants';
import { useFetchImage } from '~/hooks/useFetchImage';

const LazyLoadingWrapper = () => {
  const data = useFetchImage({ page: 1, limit: 200 });
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [rootContainerRef, setRootContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        threshold: 0.75,
      },
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (rootContainerRef) {
      const images = rootContainerRef.querySelectorAll('.lazy-load-item');
      images.forEach((img) => {
        observerRef.current?.observe(img);
      });

      return () => {
        images.forEach((img) => {
          observerRef.current?.unobserve(img);
        });
      };
    }
  }, [data]);

  return (
    <div ref={setRootContainerRef} className="columns-4">
      {data.map((item, index) => (
        <img
          key={item.id}
          className="lazy-load-item w-full object-cover block break-inside-avoid mb-4"
          style={{
            height: RANDOM_IMAGE_HEIGHTS[index % RANDOM_IMAGE_HEIGHTS.length],
          }}
          data-src={item.download_url}
        />
      ))}
    </div>
  );
};

export default LazyLoadingWrapper;
