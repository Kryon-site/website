const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach(section => observer.observe(section));

const logoImages = document.querySelectorAll(".logo-img[data-slug]");

logoImages.forEach(img => {
  const slug = img.dataset.slug;
  const name = img.dataset.name || slug;
  if (img.src.includes("simple-icons") || img.src.includes("simpleicons")) {
    img.classList.add("is-icon");
  }
  const fallbacks = [
    `https://unpkg.com/simple-icons@latest/icons/${slug}.svg`,
    `https://cdn.simpleicons.org/${slug}/000000`,
  ];
  let attempt = 0;

  const handleError = () => {
    if (attempt < fallbacks.length) {
      img.src = fallbacks[attempt];
      img.classList.add("is-icon");
      attempt += 1;
      return;
    }
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48"><text x="50%" y="50%" fill="#000" font-size="14" font-family="Manrope, Arial, sans-serif" text-anchor="middle" dominant-baseline="middle">${name}</text></svg>`;
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;
    img.classList.add("is-icon");
    img.removeEventListener("error", handleError);
  };

  img.addEventListener("error", handleError);
});
