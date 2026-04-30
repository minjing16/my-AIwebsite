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
const YOUTUBE_KEY = "tool_youtube_links";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [tried, setTried] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [articles, setArticles] = useState<Article[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<Record<string, string>>({});
  const [youtubeDrafts, setYoutubeDrafts] = useState<Record<string, string>>({});
  const [openYoutubeEditor, setOpenYoutubeEditor] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<Article["source"]>("yozm");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const loadedTried = safeParse<string[]>(localStorage.getItem(TOOL_KEY), []);
    const loadedRatings = safeParse<Record<string, number>>(
      localStorage.getItem(RATING_KEY),
      {},
    );
    const loadedArticles = safeParse<Article[]>(localStorage.getItem(ARTICLE_KEY), []);
    const loadedYoutubeLinks = safeParse<Record<string, string>>(
      localStorage.getItem(YOUTUBE_KEY),
      {},
    );
    setTried(Array.isArray(loadedTried) ? loadedTried : []);
    setRatings(loadedRatings ?? {});
    setArticles(Array.isArray(loadedArticles) ? loadedArticles : []);
    setYoutubeLinks(loadedYoutubeLinks ?? {});
    setYoutubeDrafts(loadedYoutubeLinks ?? {});
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
    localStorage.setItem(YOUTUBE_KEY, JSON.stringify(youtubeLinks));
  }, [youtubeLinks]);

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

  const saveYoutubeLink = (toolName: string) => {
    const draft = (youtubeDrafts[toolName] || "").trim();
    if (!draft) return;
    setYoutubeLinks((prev) => ({ ...prev, [toolName]: draft }));
    setOpenYoutubeEditor(null);
  };

  const deleteYoutubeLink = (toolName: string) => {
    setYoutubeLinks((prev) => {
      const next = { ...prev };
      delete next[toolName];
      return next;
    });
    setYoutubeDrafts((prev) => ({ ...prev, [toolName]: "" }));
    setOpenYoutubeEditor(null);
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
          AI 툴 학습/활용 가이드
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
                const youtubeLink = youtubeLinks[tool.name] || "";
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
                      <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (youtubeLink) {
                            window.open(youtubeLink, "_blank", "noopener,noreferrer");
                            return;
                          }
                          setOpenYoutubeEditor((prev) =>
                            prev === tool.name ? null : tool.name,
                          );
                        }}
                        className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600"
                      >
                        유튜브 강의보기
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

                    {openYoutubeEditor === tool.name && (
                      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-2">
                        <input
                          value={youtubeDrafts[tool.name] ?? ""}
                          onChange={(e) =>
                            setYoutubeDrafts((prev) => ({
                              ...prev,
                              [tool.name]: e.target.value,
                            }))
                          }
                          placeholder="https://www.youtube.com/..."
                          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-blue-500"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenYoutubeEditor(null)}
                            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-500"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => saveYoutubeLink(tool.name)}
                            className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    )}

                    {youtubeLink && (
                      <div className="mt-2">
                        <p className="truncate text-[11px] text-slate-400">
                          저장된 링크: {youtubeLink}
                        </p>
                        <div className="mt-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenYoutubeEditor(tool.name)}
                            className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:border-blue-200 hover:text-blue-600"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteYoutubeLink(tool.name)}
                            className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:border-red-200 hover:text-red-600"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
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
            <button
              type="button"
              onClick={() => setOpenForm((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
            >
              <span aria-hidden>+</span>
              아티클 추가
            </button>
          </div>

          {openForm && (
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

          <div className="space-y-2">
            {articles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
                아직 저장된 아티클이 없어요. 좋은 글을 발견하면 추가해보세요!
              </div>
            ) : (
              [...articles].reverse().map((article, idx) => {
                const realIdx = articles.length - 1 - idx;
                return (
                  <article
                    key={`${article.title}-${article.date}`}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <span className="mt-0.5 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
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
                    <button
                      type="button"
                      onClick={() => removeArticle(realIdx)}
                      className="rounded-md px-2 py-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </article>
                );
              })
            )}
          </div>
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
