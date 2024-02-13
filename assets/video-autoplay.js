export function videoAutoplay(targetVideo) {
  if (!targetVideo) return;

  const videoObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
          entry.isIntersecting ? entry.target.play() : entry.target.pause()
      };
  });

  videoObserver.observe(targetVideo);
}