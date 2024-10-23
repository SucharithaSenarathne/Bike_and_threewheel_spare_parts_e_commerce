import React, { useEffect, useRef } from 'react';
import '../styles/infinityscroll.css';

const InfiniteScroller = () => {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    scroller.setAttribute("data-animated", true);

    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  }, []);

  return (
    <div className="scroller" data-speed="fast" ref={scrollerRef}>
      <ul className="tag-list scroller__inner">
        <li>Discover</li>
        <li>high-quality</li>
        <li>automobile</li>
        <li>spare</li>
        <li>parts</li>
        <li>at</li>
        <li>unbeatable</li>
        <li>prices</li>
        <li>with</li>
        <li>fast</li>
        <li>and</li>
        <li>reliable</li>
        <li>delivery...</li>
      </ul>
    </div>
  );
};

export default InfiniteScroller;
