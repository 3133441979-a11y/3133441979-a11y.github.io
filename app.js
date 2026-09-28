const weddingConfig = {
  groomName: "郑凯铎",
  brideName: "尚倩",
  dateISO: "2026-10-27T11:38:00+08:00",
  displayDate: "2026年10月27日 星期二 11:38",
  lunarDate: "农历九月十八",
  venueName: "响沙豪门盛宴酒店",
  venueAddress: "内蒙古自治区鄂尔多斯市达拉特旗新园街8号，二楼 吉祥梦幻厅",
  mapUrl: "https://uri.amap.com/marker?position=110.008224,40.423935&name=%E5%93%8D%E6%B2%99%E8%B1%AA%E9%97%A8%E7%9B%9B%E5%AE%B4%E9%85%92%E5%BA%97&coordinate=gaode&callnative=1",
  musicUrl: "https://amp3.hunbei.com/mp3/Aini.mp3",
  rsvpEndpoint: "https://formsubmit.co/ajax/3133441979@qq.com",
  invitationText:
    "好久不见，婚礼见。我们将在这个被认真收藏的日子里，把关于郑凯铎和尚倩的故事翻到新的一页，诚挚邀请你来赴一场以爱之名的约定。",
  closingLine: "当你收到这封邀请函，我们已经在倒数着日子，期待与你相见。",
  photos: [
    { src: "./assets/photos/photo-1.jpg", caption: "把这一天留给花、阳光和喜欢的人", orientation: "portrait" },
    { src: "./assets/photos/photo-2.jpg", caption: "好久不见，婚礼见", orientation: "square" },
    { src: "./assets/photos/photo-3.jpg", caption: "请你来赴一场以爱之名的邀约", orientation: "portrait" },
    { src: "./assets/photos/photo-4.jpg", caption: "爱与友情，都会在生命中留下痕迹", orientation: "landscape" },
    { src: "./assets/photos/photo-5.jpg", caption: "我们的故事一直在延续", orientation: "portrait" },
    { src: "./assets/photos/photo-6.jpg", caption: "欢迎参加我们的婚礼", orientation: "landscape" }
  ],
  schedule: [
    { time: "11:00", title: "签到 - 领取今日任务，赴老友之约" },
    { time: "11:38", title: "仪式 - 见证拥抱、誓言与交换戒指" },
    { time: "12:08", title: "宴席 - 共享一场热闹又丰盛的午宴" }
  ],
  closingTitle: "我们在响沙等你",
  closingText: "请带着笑容来，把这一天变成我们共同收藏的存档。"
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const state = {
  audioContext: null,
  audioElement: null,
  musicTimer: null,
  toastTimer: null,
  musicGestureArmed: false
};

function bindText() {
  $$("[data-bind]").forEach((node) => {
    node.textContent = weddingConfig[node.dataset.bind] || "";
  });

  const mapLink = $('[data-link="map"]');
  if (mapLink) {
    mapLink.href = weddingConfig.mapUrl;
  }

  document.title = `${weddingConfig.groomName} & ${weddingConfig.brideName}的婚礼邀请函`;
}

function renderPhotos() {
  const root = $('[data-list="photos"]');
  root.innerHTML = weddingConfig.photos
    .map(
      (item) => `
        <article class="photo-card photo-card--${item.orientation || "portrait"}">
          <div class="photo-window">
            <img class="photo-img" src="${item.src}" alt="${item.caption}" loading="lazy" decoding="async" />
          </div>
          <p>${item.caption}</p>
        </article>
      `
    )
    .join("");
}

function renderSchedule() {
  const root = $('[data-list="schedule"]');
  root.innerHTML = weddingConfig.schedule
    .map(
      (item) => `
        <article class="schedule-item">
          <time>${item.time}</time>
          <span>${item.title}</span>
        </article>
      `
    )
    .join("");
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const target = new Date(weddingConfig.dateISO).getTime();
  const diff = Math.max(target - Date.now(), 0);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  $('[data-countdown="days"]').textContent = pad(days);
  $('[data-countdown="hours"]').textContent = pad(hours);
  $('[data-countdown="minutes"]').textContent = pad(minutes);
  $('[data-countdown="seconds"]').textContent = pad(seconds);
}

function showToast(message) {
  const toast = $("[data-toast]");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyAddress() {
  const text = `${weddingConfig.venueName}，${weddingConfig.venueAddress}`;
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text).catch(() => undefined);
    showToast("地址已复制");
    return;
  }
  showToast(text);
}

async function shareInvitation() {
  const shareData = {
    title: document.title,
    text: `${weddingConfig.groomName}和${weddingConfig.brideName}邀请你参加婚礼`,
    url: window.location.href
  };

  if (navigator.share) {
    await navigator.share(shareData).catch(() => undefined);
    return;
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(window.location.href).catch(() => undefined);
    showToast("邀请函链接已复制");
    return;
  }

  showToast("请复制浏览器地址分享邀请函");
}

function createCalendarFile() {
  const start = new Date(weddingConfig.dateISO);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const toICS = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pixel Game Wedding Invitation//CN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@pixel-game-wedding.local`,
    `DTSTAMP:${toICS(new Date())}`,
    `DTSTART:${toICS(start)}`,
    `DTEND:${toICS(end)}`,
    `SUMMARY:${weddingConfig.groomName} & ${weddingConfig.brideName}的婚礼`,
    `LOCATION:${weddingConfig.venueName} ${weddingConfig.venueAddress}`,
    `DESCRIPTION:${weddingConfig.invitationText}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([body], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${weddingConfig.groomName}-${weddingConfig.brideName}-wedding.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

function playNote(frequency, duration = 0.18) {
  const ctx = state.audioContext;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "square";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration + 0.02);
}

function getMusicButton() {
  return $('[data-action="music"]');
}

function getAudioElement() {
  if (weddingConfig.musicUrl) {
    if (!state.audioElement) {
      state.audioElement = new Audio(weddingConfig.musicUrl);
      state.audioElement.preload = "auto";
      state.audioElement.loop = true;
      state.audioElement.setAttribute("playsinline", "");
      state.audioElement.setAttribute("webkit-playsinline", "");
    }
    return state.audioElement;
  }
  return null;
}

async function startMusic({ announce = false } = {}) {
  const button = getMusicButton();
  const audio = getAudioElement();
  if (audio) {
    try {
      await audio.play();
      button?.classList.add("is-active");
      if (announce) showToast("音乐已播放");
      return true;
    } catch {
      button?.classList.remove("is-active");
      return false;
    }
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  state.audioContext ||= new AudioContextClass();
  if (state.audioContext.state === "suspended") {
    await state.audioContext.resume().catch(() => undefined);
  }
  if (state.musicTimer) {
    return true;
  }
  const notes = [523.25, 659.25, 783.99, 659.25, 698.46, 880];
  let index = 0;
  playNote(notes[index]);
  state.musicTimer = setInterval(() => {
    index = (index + 1) % notes.length;
    playNote(notes[index]);
  }, 420);
  button?.classList.add("is-active");
  if (announce) showToast("像素小夜曲已播放");
  return true;
}

function armGestureMusicFallback() {
  if (state.musicGestureArmed) return;
  state.musicGestureArmed = true;

  const startFromGesture = async (event) => {
    if (event.target.closest('[data-action="music"]')) return;
    const started = await startMusic();
    if (started) {
      ["pointerdown", "touchstart", "click"].forEach((type) => {
        document.removeEventListener(type, startFromGesture, true);
      });
      state.musicGestureArmed = false;
    }
  };

  ["pointerdown", "touchstart", "click"].forEach((type) => {
    document.addEventListener(type, startFromGesture, true);
  });
}

function autoPlayMusic() {
  if (!weddingConfig.musicUrl && !window.AudioContext && !window.webkitAudioContext) return;

  startMusic().then((started) => {
    if (!started) {
      armGestureMusicFallback();
      showToast("轻触页面即可播放音乐");
    }
  });

  document.addEventListener(
    "WeixinJSBridgeReady",
    () => {
      startMusic();
    },
    { once: true }
  );
}

function toggleMusic(button) {
  if (weddingConfig.musicUrl) {
    const audio = getAudioElement();
    state.audioElement.loop = true;
    if (audio.paused) {
      startMusic({ announce: true }).then((started) => {
        if (!started) showToast("浏览器阻止了自动播放，请再点一次");
      });
    } else {
      audio.pause();
      button.classList.remove("is-active");
      showToast("音乐已暂停");
    }
    return;
  }

  if (state.musicTimer) {
    clearInterval(state.musicTimer);
    state.musicTimer = null;
    button.classList.remove("is-active");
    showToast("音乐已暂停");
    return;
  }

  startMusic({ announce: true });
}

function handleRsvp(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);

  if (formData.get("_honey")) {
    return;
  }

  const record = {
    name: formData.get("name"),
    guests: formData.get("guests"),
    dinner: formData.get("dinner"),
    message: formData.get("message"),
    createdAt: new Date().toISOString(),
    pageUrl: window.location.href
  };

  const saveDraft = () => localStorage.setItem("pixelGameWeddingRsvp", JSON.stringify(record));
  const result = $("[data-rsvp-result]");
  const payload = {
    _subject: `婚礼回执 - ${record.name}`,
    _template: "table",
    _captcha: "false",
    _honey: "",
    新人: `${weddingConfig.groomName} & ${weddingConfig.brideName}`,
    宾客姓名: record.name,
    出席人数: record.guests,
    是否参加晚宴: record.dinner,
    祝福留言: record.message || "无",
    婚礼时间: weddingConfig.displayDate,
    婚礼地点: `${weddingConfig.venueName} ${weddingConfig.venueAddress}`,
    提交时间: new Date(record.createdAt).toLocaleString("zh-CN"),
    页面链接: record.pageUrl
  };

  if (!weddingConfig.rsvpEndpoint) {
    saveDraft();
    result.textContent = `收到啦，${record.name}。当前还没有配置在线收集邮箱，回执已暂存在这台设备上。`;
    showToast("待配置在线回执");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "提交中...";

  const requestBody = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    requestBody.append(key, value);
  });

  fetch(weddingConfig.rsvpEndpoint, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: requestBody.toString()
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("RSVP request failed");
      }
      localStorage.setItem("pixelGameWeddingRsvp", JSON.stringify({ ...record, synced: true }));
      result.textContent = `收到啦，${record.name}。我们会为 ${record.guests} 位客人预留座位。`;
      form.reset();
      showToast("回执已在线提交");
    })
    .catch(() => {
      saveDraft();
      result.textContent = `网络有点忙，${record.name} 的回执已先暂存在这台设备上，请稍后再试或直接联系新人。`;
      showToast("提交失败，已暂存");
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = "提交回执";
    });
}

function initReveal() {
  const revealNodes = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const fallbackTimer = setTimeout(() => {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }, 700);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
      if (revealNodes.every((node) => node.classList.contains("is-visible"))) {
        clearTimeout(fallbackTimer);
      }
    },
    { threshold: 0.12 }
  );

  revealNodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    observer.observe(node);
  });
}

function spawnPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = Math.random() > 0.45 ? "✦" : "◆";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
  petal.style.animationDuration = `${5 + Math.random() * 4}s`;
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 9000);
}

function wireActions() {
  $('[data-action="copy-address"]').addEventListener("click", copyAddress);
  $('[data-action="share"]').addEventListener("click", shareInvitation);
  $('[data-action="download-calendar"]').addEventListener("click", createCalendarFile);
  $('[data-action="back-top"]').addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $('[data-action="music"]').addEventListener("click", (event) => toggleMusic(event.currentTarget));
  $("[data-rsvp-form]").addEventListener("submit", handleRsvp);
}

function waitForImage(image) {
  if (!image) return Promise.resolve();
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();
  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
}

function initLoadingScreen() {
  const heroImage = $(".scene__bg");
  const minimumTime = new Promise((resolve) => setTimeout(resolve, 850));
  const timeout = new Promise((resolve) => setTimeout(resolve, 3800));

  Promise.race([Promise.all([waitForImage(heroImage), minimumTime]), timeout]).then(() => {
    document.body.classList.add("is-ready");
    setTimeout(() => {
      $("[data-loading-screen]")?.remove();
    }, 420);
    autoPlayMusic();
  });
}

function init() {
  bindText();
  renderPhotos();
  renderSchedule();
  updateCountdown();
  wireActions();
  initReveal();
  initLoadingScreen();
  setInterval(updateCountdown, 1000);
  setInterval(spawnPetal, 1200);
}

init();


