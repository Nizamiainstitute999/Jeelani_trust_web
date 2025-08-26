// ==================================================
// 🖼️ GALLERY PAGE SCRIPT (Single-file)
// - Wraps thumbnails to prevent radius+scale flicker
// - AOS fade-up on images (disabled on small screens)
// - Lightbox with next/prev
// - Zoom (wheel / buttons / double-tap) + Pan (drag)
// ==================================================

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    // ------------------------------------------------
    // 1) Wrap each image in .img-wrap (prevents flicker)
    // ------------------------------------------------
    const originalImages = Array.from(gallery.querySelectorAll("img"));
    originalImages.forEach((img) => {
      if (img.parentElement?.classList?.contains("img-wrap")) return;
      const wrap = document.createElement("div");
      wrap.className = "img-wrap";
      img.replaceWith(wrap);
      wrap.appendChild(img);
    });

    // After wrapping, re-collect references
    const allImages = Array.from(gallery.querySelectorAll("img"));

    // ------------------------------------------------
    // 2) AOS setup on thumbnails + global init
    // ------------------------------------------------
    allImages.forEach((img, i) => {
      img.setAttribute("data-aos", "fade-up");
      img.setAttribute("data-aos-delay", String((i % 6) * 60));
      img.setAttribute("data-aos-duration", "500");
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "eager");
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    });

    if (window.AOS && typeof AOS.init === "function") {
      AOS.init({
        once: true,
        offset: 80,
        duration: 500,
        easing: "ease-out-cubic",
        disable: window.innerWidth < 768
      });
    }

    // ------------------------------------------------
    // 3) Lightbox / Zoom references
    // ------------------------------------------------
    const lightbox       = document.getElementById("lightbox");
    const lightboxImg    = document.getElementById("lightbox-img");
    const zoomWrap       = document.getElementById("zoomContainer");
    const closeBtn       = document.getElementById("lightbox-close");
    const prevBtn        = document.getElementById("lightbox-prev");
    const nextBtn        = document.getElementById("lightbox-next");
    const zoomInBtn      = document.getElementById("zoomIn");
    const zoomOutBtn     = document.getElementById("zoomOut");
    const zoomResetBtn   = document.getElementById("zoomReset");

    // Guard for missing markup (keeps file safe if included elsewhere)
    if (!lightbox || !lightboxImg || !zoomWrap || !closeBtn || !prevBtn || !nextBtn || !zoomInBtn || !zoomOutBtn || !zoomResetBtn) {
      return;
    }

    // ------------------------------------------------
    // 4) Helpers: indexing + preload
    // ------------------------------------------------
    let currentIndex = 0;

    const setSrc = (imgEl) => {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || "Gallery Image";
    };

    const preload = (idx) => {
      [-1, 1].forEach((step) => {
        const j = (idx + step + allImages.length) % allImages.length;
        const src = allImages[j].src;
        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        img.src = src;
      });
    };

    const open = (index) => {
      currentIndex = index;
      setSrc(allImages[currentIndex]);
      lightbox.classList.remove("hidden");
      document.documentElement.style.overflow = "hidden";
      resetZoom();
      preload(currentIndex);
    };

    const close = () => {
      lightbox.classList.add("hidden");
      document.documentElement.style.overflow = "";
    };

    const next = () => {
      currentIndex = (currentIndex + 1) % allImages.length;
      setSrc(allImages[currentIndex]);
      resetZoom();
      preload(currentIndex);
    };

    const prev = () => {
      currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
      setSrc(allImages[currentIndex]);
      resetZoom();
      preload(currentIndex);
    };

    // Click to open on any wrapper
    Array.from(gallery.querySelectorAll(".img-wrap")).forEach((wrap, i) => {
      wrap.addEventListener("click", () => open(i));
    });

    // Lightbox controls
    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    // Click backdrop to close
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "Escape")     close();
    });

    // ------------------------------------------------
    // 5) Zoom & Pan
    // ------------------------------------------------
    let scale = 1, minScale = 1, maxScale = 8;
    let originX = 0, originY = 0;
    let isPanning = false, startX = 0, startY = 0;

    const applyTransform = () => {
      lightboxImg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
      lightboxImg.style.transformOrigin = "0 0";
      lightboxImg.style.cursor = scale > 1 ? (isPanning ? "grabbing" : "grab") : "pointer";
    };

    const resetZoom = () => {
      scale = 1; originX = 0; originY = 0;
      applyTransform();
    };

    const clampPan = () => {
      const rect = zoomWrap.getBoundingClientRect();
      const imgW = rect.width * scale;
      const imgH = rect.height * scale;
      const maxX = Math.max(0, imgW - rect.width);
      const maxY = Math.max(0, imgH - rect.height);
      originX = Math.min(0, Math.max(-maxX, originX));
      originY = Math.min(0, Math.max(-maxY, originY));
    };

    const zoomAt = (clientX, clientY, deltaScale) => {
      const rect = lightboxImg.getBoundingClientRect();
      const x = clientX - rect.left - originX;
      const y = clientY - rect.top - originY;
      const newScale = Math.min(maxScale, Math.max(minScale, scale * deltaScale));
      if (newScale === scale) return;
      originX -= x * (newScale / scale - 1);
      originY -= y * (newScale / scale - 1);
      scale = newScale;
      clampPan(); applyTransform();
    };

    // Wheel zoom
    zoomWrap.addEventListener("wheel", (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      zoomAt(e.clientX, e.clientY, factor);
    }, { passive: false });

    // Buttons zoom
    zoomInBtn.addEventListener("click",  () => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.2));
    zoomOutBtn.addEventListener("click", () => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1 / 1.2));
    zoomResetBtn.addEventListener("click", resetZoom);

    // Drag to pan
    lightboxImg.addEventListener("pointerdown", (e) => {
      if (scale <= 1) return;
      isPanning = true;
      lightboxImg.setPointerCapture(e.pointerId);
      startX = e.clientX - originX;
      startY = e.clientY - originY;
      applyTransform();
    });

    lightboxImg.addEventListener("pointermove", (e) => {
      if (!isPanning) return;
      originX = e.clientX - startX;
      originY = e.clientY - startY;
      clampPan(); applyTransform();
    });

    const endPan = () => { isPanning = false; applyTransform(); };
    lightboxImg.addEventListener("pointerup", endPan);
    lightboxImg.addEventListener("pointercancel", endPan);

    // Double-click / double-tap to toggle zoom
    let lastTap = 0;
    lightboxImg.addEventListener("click", (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        const nextScale = scale >= 2 ? 1 : 2;
        zoomAt(e.clientX, e.clientY, nextScale / scale);
      }
      lastTap = now;
    });

    // Pinch zoom (two pointers)
    const pointers = new Map();
    zoomWrap.addEventListener("pointerdown", (e) => { pointers.set(e.pointerId, e); zoomWrap.setPointerCapture(e.pointerId); });
    zoomWrap.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, e);
      if (pointers.size === 2) {
        const [p1, p2] = Array.from(pointers.values());
        const dist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
        if (!zoomWrap._lastDist) zoomWrap._lastDist = dist;
        const factor = dist / zoomWrap._lastDist;
        const cx = (p1.clientX + p2.clientX) / 2;
        const cy = (p1.clientY + p2.clientY) / 2;
        zoomAt(cx, cy, factor);
        zoomWrap._lastDist = dist;
      }
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((t) => {
      zoomWrap.addEventListener(t, (e) => {
        pointers.delete(e.pointerId);
        if (pointers.size < 2) zoomWrap._lastDist = null;
      });
    });
  });
})();
