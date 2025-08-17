"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { RANDOM_IMAGE_HEIGHTS } from "~/constants";
import type { DummyImage } from "~/hooks/useFetchImage";

interface InfiniteScrollWrapperProps {
  mode: "reverse" | "normal";
}

const InfiniteScrollWrapper = ({ mode }: InfiniteScrollWrapperProps) => {
  const [data, setData] = useState<DummyImage[]>([]);
  const [page, setPage] = useState(1);
  const [triggerRef, setTriggerRef] = useState<HTMLDivElement | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const rootContainerRef = useRef<HTMLDivElement | null>(null);
  const prevRootContainerRefHeight = useRef(0);
  const isFetching = useRef(false);

  const isReverseMode = useMemo(() => mode === "reverse", [mode]);

  const fetchImages = useCallback(
    async (page: number) => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=20`, {
          signal: abortControllerRef.current?.signal,
        });
        const data = await response.json();
        prevRootContainerRefHeight.current = rootContainerRef?.current?.scrollHeight || 0;
        setData((prevData) => (mode === "normal" ? [...prevData, ...data] : [...data, ...prevData]));
      } catch (error) {
        setPage((prevPage) => prevPage - 1);
      } finally {
        isFetching.current = false;
      }
    },
    [mode],
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  useEffect(() => {
    if (!isReverseMode || !rootContainerRef.current) return;

    const offsetHeight = rootContainerRef.current.scrollHeight - prevRootContainerRefHeight.current;
    rootContainerRef.current.scrollTop += offsetHeight;
  }, [isReverseMode, data]);

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (isFetching.current) return;
              setPage((prevPage) => prevPage + 1);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: isReverseMode ? "50% 0px 0px 0px" : "0px",
        },
      );
    }

    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }

    if (observerRef.current && triggerRef) {
      observerRef.current.observe(triggerRef);
    }
  }, [triggerRef]);

  return (
    <div ref={rootContainerRef} className="mx-auto w-[300px] overflow-auto max-h-screen">
      {isReverseMode && <div ref={setTriggerRef}></div>}
      {(data || Array.from({ length: 20 })).map((item, index) => (
        <img
          key={item?.id || index}
          className="break-inside-avoid object-cover w-full mb-4 block"
          style={{
            height: "200px",
          }}
          src={item?.download_url}
        />
      ))}
      {!isReverseMode && <div ref={setTriggerRef}></div>}
    </div>
  );
};

export default InfiniteScrollWrapper;
