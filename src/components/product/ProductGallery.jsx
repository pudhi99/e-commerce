"use client";
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const ProductGallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainCarousel, mainApi] = useEmblaCarousel();
  const [thumbCarousel, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;

    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);

    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  return (
    <div className="w-full lg:w-1/2">
      <div className="w-full md:w-4/6 lg:w-4/6 mx-auto">
        {/* Main Carousel */}
        <div className="relative mb-2 md:mb-4">
          <div className="overflow-hidden rounded-lg" ref={mainCarousel}>
            <div className="flex touch-pan-y">
              {images.map((image, index) => (
                <div key={index} className="relative flex-[0_0_100%] min-w-0">
                  <div className="relative pt-[100%]">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel */}
        <div className="relative px-2 md:px-0">
          <div className="overflow-hidden" ref={thumbCarousel}>
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onThumbClick(index)}
                  className={`relative flex-[0_0_18%] md:flex-[0_0_15%] min-w-0 cursor-pointer transition-all duration-200 rounded-md overflow-hidden
                  ${
                    index === selectedIndex
                      ? "ring-2 ring-teal-400 border-2 border-teal-400"
                      : "ring-1 ring-gray-400 border border-gray-400 hover:border-gray-200"
                  }`}
                >
                  <div className="relative pt-[100%]">
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
