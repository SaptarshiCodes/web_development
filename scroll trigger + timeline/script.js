gsap.registerPlugin(ScrollTrigger);

const cursor = document.querySelector(".cursor");

gsap.set(cursor, {
  xPercent: -50,
  yPercent: -50,
});

document.querySelectorAll(".enlarge").forEach(el => {
  el.addEventListener("mouseenter", () => {
    gsap.to(".cursor", {
      scale: 3,
      duration: 0.2
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(".cursor", {
      scale: 1,
      duration: 0.2
    });
  });
});

window.addEventListener("mousemove", (e) => {
  console.log(e),
  gsap.to(cursor, {
    x: e.x,
    y: e.y,
    duration: 1,
    scrub: 2,
    ease: "back.out(2)",
  });
});

function page1Animation() {
  const track = document.querySelector(".track");

  let x = 0;
  let direction = -1;
  let speed = 1;

  if (!track.dataset.duplicated) {
    track.innerHTML += track.innerHTML;
    track.dataset.duplicated = "true";
  }

  const halfWidth = track.scrollWidth / 2;

  gsap.from("nav, nav h4, nav button", {
    y: -30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power2.out",
  });

  window.addEventListener("wheel", (e) => {
    direction = e.deltaY > 0 ? -1 : 1;
  });

  gsap.ticker.add(() => {
    x += speed * direction;

    if (x <= -halfWidth) {
      x = 0;
    }

    if (x > 0) {
      x = -halfWidth;
    }

    gsap.set(track, {
      x,
    });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section1",
      start: "top -70%",
      end: "bottom 80%",
      toggleActions: "restart none restart none",
      // markers: true,
    },
  });

  tl.from(".left h1, .left p", {
    x: -200,
    opacity: 0,
    duration: 0.6,
    stagger: 0.4,
    ease: "expo.out",
  });

  tl.from(".left button", {
    opacity: 0,
    scale: 0.1,
    duration: 0.15,
  });

  tl.from(
    ".right img",
    {
      opacity: 0,
      scale: 0.1,
      duration: 1.5,
      ease: "power2.out",
    },
    "-=1",
  );

  tl.from(
    ".bottom img",
    {
      opacity: 0,
      y: 50,
      stagger: 0.08,
      duration: 0.5,
      ease: "expo.out",
    },
    "-=0.7",
  );
  tl.restart(true);
}

function page2Animation() {
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".section2",
      start: "top 70%",
      toggleActions: "restart none restart none",
      // markers: true,
    },
  });

  tl2.from(".services", {
    y: -100,
    opacity: 0,
    duration: 0.7,
    delay: 0.3,
    ease: "power2.out",
  });

  tl2.from(
    ".element.line1",
    {
      x: -200,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: "power2.out",
    },
    "<",
  );

  tl2.from(
    ".element.line2",
    {
      x: 200,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: "power2.out",
    },
    "<",
  );
}

window.addEventListener("load", () => {
  page1Animation();
  page2Animation();
  ScrollTrigger.refresh();
});
