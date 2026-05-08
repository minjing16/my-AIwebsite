"use client";

import { useEffect, useMemo, useState } from "react";

type Tool = {
  name: string;
  badge: "무료" | "제한무료" | "유료";
  desc: string;
  tip: string;
};

type Stage = {
  id: string;
  number: number;
  title: string;
  tools: Tool[];
};

type Article = {
  title: string;
  url: string;
  source: "yozm" | "brunch" | "etc";
  memo: string;
  date: string;
};

type DesignBlog = { site: string; url: string };

type YoutubeLesson = {
  id: string;
  title: string;
  url: string;
};

const stages: Stage[] = [
  {
    id: "stage-1",
    number: 1,
    title: "리서치 & 아이디어",
    tools: [
      {
        name: "Claude",
        badge: "제한무료",
        desc: "긴 문서를 읽고 구조적으로 정리하는 데 강합니다.",
        tip: "아이디어 메모를 붙여 넣고 핵심 문제/가설/가치제안을 3줄로 정리해달라고 요청해보세요.",
      },
      {
        name: "ChatGPT",
        badge: "제한무료",
        desc: "브레인스토밍과 문장 리라이팅이 빠릅니다.",
        tip: "같은 내용을 3개 톤(전문적/친근/간결)으로 다시 써달라고 요청하면 카피 검토가 쉬워집니다.",
      },
      {
        name: "gemini",
        badge: "제한무료",
        desc: "빠른 탐색과 멀티모달 기반 아이디어 확장에 유용합니다.",
        tip: "초기 요구사항과 참고 자료를 함께 넣어 아이디어 옵션을 비교 생성해보세요.",
      },
    ],
  },
  {
    id: "stage-2",
    number: 2,
    title: "IA&와이어프레임 설계",
    tools: [
      {
        name: "Google Stitch",
        badge: "제한무료",
        desc: "텍스트로 와이어프레임과 화면 구조를 빠르게 제안받을 수 있습니다.",
        tip: "핵심 화면 요구사항과 사용자 흐름을 함께 써주면 IA 초안을 더 정확히 뽑아줍니다.",
      },
      {
        name: "Uizard",
        badge: "제한무료",
        desc: "손그림/스케치를 디지털 와이어프레임으로 변환하기 좋습니다.",
        tip: "러프한 스케치라도 우선 올린 뒤, 변환된 화면을 기준으로 구조를 다듬어 보세요.",
      },
      {
        name: "FigJam AI",
        badge: "제한무료",
        desc: "아이디어를 IA/플로우 다이어그램으로 정리하기에 편합니다.",
        tip: "기능 리스트를 붙여넣고 그룹핑 자동화를 사용하면 정보 구조를 빠르게 정리할 수 있습니다.",
      },
    ],
  },
  {
    id: "stage-3",
    number: 3,
    title: "UI디자인",
    tools: [
      {
        name: "Figma AI (Make)",
        badge: "제한무료",
        desc: "프롬프트 기반 UI 생성과 기존 디자인 보강에 활용할 수 있습니다.",
        tip: "디자인 시스템 키워드와 화면 목적을 함께 써주면 결과 품질이 올라갑니다.",
      },
      {
        name: "Google Stitch",
        badge: "제한무료",
        desc: "와이어프레임을 넘어 UI 시안 제작까지 빠르게 진행할 수 있습니다.",
        tip: "핵심 화면을 먼저 생성하고 결과를 반복 개선하는 방식으로 진행하세요.",
      },
      {
        name: "Framer AI",
        badge: "제한무료",
        desc: "랜딩/마케팅 UI를 빠르게 만들고 배포 시안까지 연결하기 좋습니다.",
        tip: "핵심 섹션별로 블록을 생성한 뒤 전체 톤을 한 번에 정리하세요.",
      },
    ],
  },
  {
    id: "stage-4",
    number: 4,
    title: "콘텐츠 소스 제작",
    tools: [
      {
        name: "Adobe Firefly",
        badge: "제한무료",
        desc: "아이콘 스타일/일러스트 무드/비주얼 소스 제작에 강합니다.",
        tip: "브랜드 톤을 프롬프트에 고정해 자산 스타일의 일관성을 유지하세요.",
      },
      {
        name: "ChatGPT",
        badge: "제한무료",
        desc: "콘텐츠 콘셉트, 카피, 프롬프트 초안 작성에 활용할 수 있습니다.",
        tip: "생성하려는 자산 목적을 먼저 정의하고 프롬프트 템플릿을 고정하세요.",
      },
      {
        name: "gemini",
        badge: "제한무료",
        desc: "참고 자료 분석과 대체 아이디어 제시에 유용합니다.",
        tip: "여러 스타일 비교안을 요청해 최종 제작 방향을 빠르게 좁혀보세요.",
      },
      {
        name: "Leonardo AI",
        badge: "무료",
        desc: "고퀄리티 일러스트와 비주얼 자산 생성에 적합합니다.",
        tip: "레퍼런스 이미지를 함께 사용해 원하는 스타일로 결과를 수렴시키세요.",
      },
      {
        name: "Iconify",
        badge: "무료",
        desc: "대규모 아이콘 라이브러리로 빠른 검색과 삽입이 가능합니다.",
        tip: "Outline/Filled 등 아이콘 스타일 규칙을 먼저 정한 뒤 사용하세요.",
      },
      {
        name: "Canva AI",
        badge: "무료",
        desc: "썸네일/배너/소셜 콘텐츠를 빠르게 제작하고 변형하기 좋습니다.",
        tip: "한 번 만든 디자인을 리사이즈 기능으로 채널별 포맷에 재활용하세요.",
      },
      {
        name: "midjourney",
        badge: "유료",
        desc: "스타일 완성도가 높은 비주얼과 일러스트 생성에 유리합니다.",
        tip: "스타일 키워드와 구도를 고정해 시리즈 자산으로 제작해보세요.",
      },
      {
        name: "나노바나나",
        badge: "제한무료",
        desc: "Google Gemini 기반 AI 이미지 생성·편집 툴로 캐릭터 일관성이 뛰어납니다.",
        tip: "같은 캐릭터를 다양한 포즈와 배경으로 연출할 때 특히 강합니다. 자연어로 편집 지시를 내리면 바로 반영돼요.",
      },
    ],
  },
];

const sourceLabel = { yozm: "요즘IT", brunch: "브런치", etc: "기타" } as const;
const ratingLabel = ["", "별로예요", "그저그래요", "괜찮아요", "좋아요", "최고예요"];
const designBlogs: DesignBlog[] = [
  {
    site: "토스 블로그",
    url: "https://toss.tech/",
  },
  {
    site: "당근 블로그",
    url: "https://medium.com/daangn",
  },
  {
    site: "우아한 형제들 블로그",
    url: "https://techblog.woowahan.com/",
  },
  {
    site: "카카오 블로그",
    url: "https://design.kakao.com/",
  },
  {
    site: "네이버 블로그",
    url: "https://d2.naver.com/home",
  },
  {
    site: "라인 블로그",
    url: "https://linepluscorp.com/",
  },
  {
    site: "무신사 블로그",
    url: "https://medium.com/musinsa-tech",
  },
];

const TOOL_KEY = "tried_tools";
const RATING_KEY = "tool_ratings";
const ARTICLE_KEY = "saved_articles";
const YOUTUBE_KEY = "tool_youtube_lessons_v2";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getYoutubeThumbnail(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1).split("?")[0];
    } else if (u.hostname.includes("youtube.com")) {
      videoId = u.searchParams.get("v");
    }
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  } catch {
    return null;
  }
}

export default function Home() {
  const [tried, setTried] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [articles, setArticles] = useState<Article[]>([]);
  const [youtubeLessons, setYoutubeLessons] = useState<Record<string, YoutubeLesson[]>>({});
  const [youtubeModal, setYoutubeModal] = useState<string | null>(null);
  const [lessonDraft, setLessonDraft] = useState<{ title: string; url: string }>({ title: "", url: "" });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonDraft, setEditLessonDraft] = useState<{ title: string; url: string }>({ title: "", url: "" });
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<Article["source"]>("yozm");
  const [memo, setMemo] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Article | null>(null);
  const [articleTab, setArticleTab] = useState<"saved" | "auto">("saved");
  const [rssItems, setRssItems] = useState<{ title: string; url: string; date: string }[]>([]);
  const [rssLoading, setRssLoading] = useState(false);
  const [rssError, setRssError] = useState(false);
  const [aiItems, setAiItems] = useState<{ title: string; url: string; source: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    const loadedTried = safeParse<string[]>(localStorage.getItem(TOOL_KEY), []);
    const loadedRatings = safeParse<Record<string, number>>(
      localStorage.getItem(RATING_KEY),
      {},
    );
    const loadedArticles = safeParse<Article[]>(localStorage.getItem(ARTICLE_KEY), []);
    const loadedYoutubeLessons = safeParse<Record<string, YoutubeLesson[]>>(
      localStorage.getItem(YOUTUBE_KEY),
      {},
    );
    setTried(Array.isArray(loadedTried) ? loadedTried : []);
    setRatings(loadedRatings ?? {});
    setArticles(Array.isArray(loadedArticles) ? loadedArticles : []);
    setYoutubeLessons(loadedYoutubeLessons ?? {});
  }, []);

  useEffect(() => {
    localStorage.setItem(TOOL_KEY, JSON.stringify(tried));
  }, [tried]);

  useEffect(() => {
    localStorage.setItem(RATING_KEY, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(ARTICLE_KEY, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(YOUTUBE_KEY, JSON.stringify(youtubeLessons));
  }, [youtubeLessons]);

  useEffect(() => {
    if (articleTab !== "auto") return;
    if (rssItems.length > 0) return;
    setRssLoading(true);
    setRssError(false);
    fetch("/api/rss")
      .then((r) => r.json())
      .then((data) => {
        setRssItems(data.items ?? []);
        setRssLoading(false);
      })
      .catch(() => {
        setRssError(true);
        setRssLoading(false);
      });
  }, [articleTab]);

  const totalTools = useMemo(
    () => stages.reduce((acc, stage) => acc + stage.tools.length, 0),
    [],
  );

  const triedSet = useMemo(() => new Set(tried), [tried]);

  const toggleTried = (toolName: string) => {
    if (triedSet.has(toolName)) {
      setTried((prev) => prev.filter((name) => name !== toolName));
    } else {
      setTried((prev) => [...prev, toolName]);
    }
  };

  const setToolRating = (toolName: string, value: number) => {
    setRatings((prev) => {
      const old = prev[toolName] ?? 0;
      const next = old === value ? 0 : value;
      return { ...prev, [toolName]: next };
    });
  };

  const submitArticle = () => {
    if (!title.trim() || !url.trim()) return;
    setArticles((prev) => [
      ...prev,
      {
        title: title.trim(),
        url: url.trim(),
        source,
        memo: memo.trim(),
        date: new Date().toISOString(),
      },
    ]);
    setTitle("");
    setUrl("");
    setSource("yozm");
    setMemo("");
    setOpenForm(false);
  };

  const removeArticle = (idx: number) => {
    setArticles((prev) => prev.filter((_, i) => i !== idx));
  };

  const startEditArticle = (idx: number) => {
    setEditingIdx(idx);
    setEditDraft({ ...articles[idx] });
  };

  const cancelEditArticle = () => {
    setEditingIdx(null);
    setEditDraft(null);
  };

  const saveEditArticle = () => {
    if (!editDraft || editingIdx === null) return;
    if (!editDraft.title.trim() || !editDraft.url.trim()) return;
    setArticles((prev) =>
      prev.map((a, i) =>
        i === editingIdx
          ? { ...editDraft, title: editDraft.title.trim(), url: editDraft.url.trim(), memo: editDraft.memo.trim() }
          : a,
      ),
    );
    setEditingIdx(null);
    setEditDraft(null);
  };

  const addLesson = (toolName: string) => {
    if (!lessonDraft.title.trim() || !lessonDraft.url.trim()) return;
    const newLesson: YoutubeLesson = {
      id: Date.now().toString(),
      title: lessonDraft.title.trim(),
      url: lessonDraft.url.trim(),
    };
    setYoutubeLessons((prev) => ({
      ...prev,
      [toolName]: [...(prev[toolName] ?? []), newLesson],
    }));
    setLessonDraft({ title: "", url: "" });
  };

  const deleteLesson = (toolName: string, lessonId: string) => {
    setYoutubeLessons((prev) => ({
      ...prev,
      [toolName]: (prev[toolName] ?? []).filter((l) => l.id !== lessonId),
    }));
  };

  const startEditLesson = (lesson: YoutubeLesson) => {
    setEditingLessonId(lesson.id);
    setEditLessonDraft({ title: lesson.title, url: lesson.url });
  };

  const saveEditLesson = (toolName: string) => {
    if (!editingLessonId || !editLessonDraft.title.trim() || !editLessonDraft.url.trim()) return;
    setYoutubeLessons((prev) => ({
      ...prev,
      [toolName]: (prev[toolName] ?? []).map((l) =>
        l.id === editingLessonId
          ? { ...l, title: editLessonDraft.title.trim(), url: editLessonDraft.url.trim() }
          : l,
      ),
    }));
    setEditingLessonId(null);
    setEditLessonDraft({ title: "", url: "" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur px-5 md:px-10">
        <div className="mx-auto flex h-15 max-w-[1100px] items-center justify-between">
          <div className="text-[15px] font-semibold tracking-tight">
            AI Tools <span className="text-blue-600">for Learning</span>
          </div>
          <nav className="hidden gap-1 md:flex">
            {stages.map((stage) => (
              <a
                key={stage.id}
                href={`#${stage.id}`}
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                {stage.title}
              </a>
            ))}
            <a
              href="#articles"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              아티클
            </a>
            <a
              href="#design-blogs"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              디자인 블로그
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-[1100px] px-5 pb-12 pt-16 md:px-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-blue-600">
          <span className="h-2 w-2 rounded-full bg-blue-600" /> Personal Knowledge Base
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          AI 학습/활용 가이드
        </h1>
        <p className="mt-4 max-w-[520px] text-[16px] leading-7 text-slate-500">
          아이디어 구체화, UI 제안, 콘텐츠 소스 제작까지. 단계별 도구와 활용 팁,
          그리고 참고할 유튜브/아티클을 모아두는 개인 학습용 랜딩입니다.
        </p>
        <div className="mt-8 flex items-center gap-5">
          <div>
            <div className="text-xl font-bold">{tried.length}</div>
            <div className="text-xs text-slate-400">써본 툴</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-xl font-bold">{totalTools}</div>
            <div className="text-xs text-slate-400">등록 툴</div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-5 pb-24 md:px-10">
        {stages.map((stage) => (
          <section key={stage.id} id={stage.id} className="mb-14 scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                {stage.number}
              </div>
              <h2 className="text-xl font-bold tracking-tight">{stage.title}</h2>
              <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-400">
                {stage.tools.length}개 툴
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stage.tools.map((tool) => {
                const isTried = triedSet.has(tool.name);
                const rating = ratings[tool.name] ?? 0;
                const lessonCount = (youtubeLessons[tool.name] ?? []).length;
                return (
                  <article
                    key={tool.name}
                    className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="text-[15px] font-bold">{tool.name}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          tool.badge === "무료"
                            ? "bg-emerald-100 text-emerald-600"
                            : tool.badge === "제한무료"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-[13px] leading-6 text-slate-500">{tool.desc}</p>
                    <div className="mt-3 rounded-md border-l-2 border-blue-200 bg-slate-50 p-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                        활용 팁
                      </p>
                      <p className="text-[12px] leading-6 text-slate-500">{tool.tip}</p>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setYoutubeModal(tool.name); setLessonDraft({ title: "", url: "" }); setEditingLessonId(null); }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600"
                        >
                          유튜브 강의보기
                          {lessonCount > 0 && (
                            <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">{lessonCount}</span>
                          )}
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setToolRating(tool.name, star)}
                              className={`text-base transition hover:scale-110 ${
                                star <= rating ? "text-amber-400" : "text-slate-200"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                          <span className="ml-1 text-[11px] text-slate-400">
                            {ratingLabel[rating]}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleTried(tool.name)}
                          className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                            isTried
                              ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                              : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500"
                          }`}
                        >
                          {isTried ? "✓ 써봤어요" : "안 써봤어요"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <section id="articles" className="scroll-mt-24 border-t border-slate-200 pt-14">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">AI 관련 아티클</h2>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-400">
                {articles.length}개
              </span>
            </div>
            {articleTab === "saved" ? (
              <button
                type="button"
                onClick={() => setOpenForm((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
              >
                <span aria-hidden>+</span> 아티클 추가
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (aiLoading) return;
                  setAiLoading(true);
                  setAiError(false);
                  setAiItems([]);
                  fetch("/api/recommend")
                    .then((r) => r.json())
                    .then((data) => { setAiItems(data.items ?? []); setAiLoading(false); })
                    .catch(() => { setAiError(true); setAiLoading(false); });
                }}
                className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
              >
                {aiLoading ? "검색 중..." : "✨ 추천받기"}
              </button>
            )}
          </div>

          {/* 탭 */}
          <div className="mb-4 flex gap-2 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setArticleTab("saved")}
              className={`pb-2 text-sm font-semibold transition ${articleTab === "saved" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              내 아티클
            </button>
            <button
              type="button"
              onClick={() => setArticleTab("auto")}
              className={`flex items-center gap-1.5 pb-2 text-sm font-semibold transition ${articleTab === "auto" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              AI 자동 추천
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">자동</span>
            </button>
          </div>

          {articleTab === "auto" && (
            <div>
              <p className="mb-4 text-xs text-slate-400">Claude AI가 브런치·요즘IT에서 최신 아티클을 검색해 추천해드려요.</p>

              {/* Claude 추천 결과 */}
              <div className="space-y-2">
                {aiLoading && <div className="py-8 text-center text-sm text-slate-400">AI가 아티클을 검색하고 있어요... (10~20초 소요)</div>}
                {aiError && <div className="py-6 text-center text-sm text-slate-400">추천을 불러오지 못했어요. 다시 시도해주세요.</div>}
                {!aiLoading && !aiError && aiItems.length === 0 && rssItems.length === 0 && !rssLoading && (
                  <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
                    추천받기 버튼을 눌러보세요!
                  </div>
                )}
                {aiItems.map((item) => {
                  const alreadySaved = articles.some((a) => a.url === item.url);
                  const srcLabel = item.source === "brunch" ? "브런치" : item.source === "yozm" ? "요즘IT" : "기타";
                  const srcColor = item.source === "brunch" ? "bg-yellow-50 text-yellow-600" : "bg-slate-100 text-slate-500";
                  return (
                    <div key={item.url} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${srcColor}`}>{srcLabel}</span>
                      <a href={item.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-semibold hover:text-blue-600">{item.title}</a>
                      <button
                        type="button"
                        disabled={alreadySaved}
                        onClick={() => {
                          if (alreadySaved) return;
                          setArticles((prev) => [...prev, {
                            title: item.title, url: item.url,
                            source: item.source === "brunch" ? "brunch" : item.source === "yozm" ? "yozm" : "etc",
                            memo: "", date: new Date().toISOString(),
                          }]);
                        }}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition ${alreadySaved ? "bg-slate-100 text-slate-400 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                      >
                        {alreadySaved ? "저장됨" : "저장"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* 요즘IT RSS */}
              {!rssError && rssItems.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold text-slate-400">요즘IT 최신 아티클</p>
                  <div className="space-y-2">
                    {rssLoading && <div className="py-4 text-center text-sm text-slate-400">불러오는 중...</div>}
                    {rssItems.map((item) => {
                      const alreadySaved = articles.some((a) => a.url === item.url);
                      return (
                        <div key={item.url} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">요즘IT</span>
                          <a href={item.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-semibold hover:text-blue-600">{item.title}</a>
                          <button
                            type="button"
                            disabled={alreadySaved}
                            onClick={() => {
                              if (alreadySaved) return;
                              setArticles((prev) => [...prev, {
                                title: item.title, url: item.url, source: "yozm", memo: "", date: new Date().toISOString(),
                              }]);
                            }}
                            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition ${alreadySaved ? "bg-slate-100 text-slate-400 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                          >
                            {alreadySaved ? "저장됨" : "저장"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {articleTab === "saved" && openForm && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="아티클 제목"
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as Article["source"])}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="yozm">요즘IT</option>
                  <option value="brunch">브런치</option>
                  <option value="etc">기타</option>
                </select>
                <input
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="한 줄 메모"
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="rounded-md border border-slate-200 px-4 py-1.5 text-sm text-slate-500"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={submitArticle}
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </div>
          )}

          {articleTab === "saved" && (
          <div className="space-y-2">
            {articles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
                아직 저장된 아티클이 없어요. 좋은 글을 발견하면 추가해보세요!
              </div>
            ) : (
              [...articles].reverse().map((article, idx) => {
                const realIdx = articles.length - 1 - idx;
                const isEditing = editingIdx === realIdx;
                return (
                  <article
                    key={`${article.title}-${article.date}`}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                        {sourceLabel[article.source]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-sm font-semibold hover:text-blue-600"
                        >
                          {article.title}
                        </a>
                        {article.memo && (
                          <p className="mt-1 text-xs leading-5 text-slate-500">{article.memo}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => startEditArticle(realIdx)}
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            </svg>
                          </button>
                        )}
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => { if (window.confirm("아티클을 삭제하시겠습니까?")) removeArticle(realIdx); }}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing && editDraft && (
                      <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                        <div className="grid gap-2 md:grid-cols-2">
                          <input
                            value={editDraft.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDraft((d: Article | null) => d ? { ...d, title: e.target.value } : d)}
                            placeholder="아티클 제목"
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                          <input
                            value={editDraft.url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDraft((d: Article | null) => d ? { ...d, url: e.target.value } : d)}
                            placeholder="https://..."
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                          <select
                            value={editDraft.source}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditDraft((d: Article | null) => d ? { ...d, source: e.target.value as Article["source"] } : d)}
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          >
                            <option value="yozm">요즘IT</option>
                            <option value="brunch">브런치</option>
                            <option value="etc">기타</option>
                          </select>
                          <input
                            value={editDraft.memo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDraft((d: Article | null) => d ? { ...d, memo: e.target.value } : d)}
                            placeholder="한 줄 메모"
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEditArticle}
                            className="rounded-md border border-slate-200 px-4 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={saveEditArticle}
                            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
          )}
        </section>

        <section
          id="design-blogs"
          className="scroll-mt-24 mt-14 border-t border-slate-200 pt-14"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight">타사 디자인 블로그</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {designBlogs.map((blog) => (
              <article
                key={blog.site}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-slate-900">{blog.site}</p>
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                >
                  바로가기
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* 유튜브 강의 모달 */}
      {youtubeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setYoutubeModal(null); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[11px] font-medium text-slate-400">유튜브 강의</p>
                <h3 className="text-[15px] font-bold text-slate-900">{youtubeModal}</h3>
              </div>
              <button
                type="button"
                onClick={() => setYoutubeModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* 강의 목록 */}
            <div className="max-h-72 overflow-y-auto px-5 py-3">
              {(youtubeLessons[youtubeModal] ?? []).length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">아직 등록된 강의가 없어요.</p>
              ) : (
                <ul className="space-y-2">
                  {(youtubeLessons[youtubeModal] ?? []).map((lesson) => (
                    <li key={lesson.id} className="rounded-lg border border-slate-100 bg-slate-50">
                      {editingLessonId === lesson.id ? (
                        <div className="p-3 space-y-2">
                          <input
                            value={editLessonDraft.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLessonDraft((d) => ({ ...d, title: e.target.value }))}
                            placeholder="강의 제목"
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                          <input
                            value={editLessonDraft.url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLessonDraft((d) => ({ ...d, url: e.target.value }))}
                            placeholder="https://www.youtube.com/..."
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setEditingLessonId(null)} className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:bg-slate-100">취소</button>
                            <button type="button" onClick={() => { if (youtubeModal) saveEditLesson(youtubeModal); }} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">저장</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {getYoutubeThumbnail(lesson.url) && (
                            <a href={lesson.url} target="_blank" rel="noreferrer" className="block">
                              <img
                                src={getYoutubeThumbnail(lesson.url)!}
                                alt={lesson.title}
                                className="w-full rounded-t-lg object-cover"
                                style={{ aspectRatio: "16/9" }}
                              />
                            </a>
                          )}
                          <div className="flex items-center gap-2 px-3 py-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FF0000" className="shrink-0"><path d="M19.59 12.688 8.474 6.156C7.775 5.745 7 6.26 7 7.08v13.84c0 .82.775 1.335 1.474.924l11.116-6.532a1.056 1.056 0 0 0 0-1.624Z"/></svg>
                            <a href={lesson.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 hover:text-blue-600">
                              {lesson.title}
                            </a>
                            <div className="flex shrink-0 gap-1">
                              <button type="button" onClick={() => startEditLesson(lesson)} className="rounded p-1 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                              </button>
                              <button type="button" onClick={() => { if (youtubeModal) deleteLesson(youtubeModal, lesson.id); }} className="rounded p-1 text-slate-400 hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 강의 추가 폼 */}
            <div className="border-t border-slate-100 px-5 py-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">강의 추가</p>
              <input
                value={lessonDraft.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLessonDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="강의 제목"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                value={lessonDraft.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLessonDraft((d) => ({ ...d, url: e.target.value }))}
                placeholder="https://www.youtube.com/..."
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { if (youtubeModal) addLesson(youtubeModal); }}
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between text-sm text-slate-400">
          <div>
            <span className="font-semibold text-slate-500">AI Tools for Learning</span> · 개인
            공부용 사이트
          </div>
          <div>Last updated · 2026</div>
        </div>
      </footer>
    </div>
  );
}
