import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, ExternalLink, ChevronDown } from 'lucide-react';
import { insights, getInsight, SITE_URL, CATEGORIES, type Insight } from '../lib/insights';
import { NewsletterSection } from '../components/NewsletterSection';

interface InsightsPageProps {
  slug: string | null;
  onNavigate: (path: string) => void;
}

const DEFAULT_TITLE = 'TALENTO - Boutique Headhunting Agency | Executive Search & Leadership Recruitment';
const PAGE_SIZE = 6;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Create or update a <meta> / <link> tag in <head>. */
function setHead(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function useSeo(opts: { title: string; description: string; path: string; image: string; jsonLd: object[]; keywords?: string[] }) {
  useEffect(() => {
    const prevTitle = document.title;
    const url = `${SITE_URL}${opts.path}`;
    const img = opts.image.startsWith('http') ? opts.image : `${SITE_URL}${opts.image}`;
    document.title = opts.title;

    const meta = (name: string, content: string, prop = false) =>
      setHead(
        `meta[${prop ? 'property' : 'name'}="${name}"]`,
        () => {
          const m = document.createElement('meta');
          m.setAttribute(prop ? 'property' : 'name', name);
          return m;
        },
        'content',
        content
      );

    meta('description', opts.description);
    if (opts.keywords) meta('keywords', opts.keywords.join(', '));
    meta('og:title', opts.title, true);
    meta('og:description', opts.description, true);
    meta('og:url', url, true);
    meta('og:image', img, true);
    meta('twitter:title', opts.title, true);
    meta('twitter:description', opts.description, true);
    meta('twitter:image', img, true);
    setHead('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }, 'href', url);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'insights-jsonld';
    script.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': opts.jsonLd });
    document.head.appendChild(script);

    window.scrollTo({ top: 0 });
    return () => {
      document.title = prevTitle || DEFAULT_TITLE;
      script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.path]);
}

const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function Link({
  href,
  onNavigate,
  className,
  children,
}: {
  href: string;
  onNavigate: (p: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

function Kicker({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`inline-block text-[11px] font-semibold uppercase tracking-[0.18em] ${
        accent ? 'text-[#7A5F2E] dark:text-[#C2A163]' : 'text-[#4A5568] dark:text-[#A9B8CC]'
      }`}
    >
      {children}
    </span>
  );
}

function Meta({ post }: { post: Insight }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4A5568] dark:text-[#A9B8CC]">
      <span className="w-6 h-6 rounded-full bg-[#C2A163]/20 text-[#7A5F2E] dark:text-[#C2A163] text-[10px] font-semibold flex items-center justify-center">
        {initials(post.author)}
      </span>
      <span className="font-medium text-[#0A1A2E] dark:text-white">{post.author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readMinutes} min read</span>
    </p>
  );
}

/** Large lead card with big image */
function LeadCard({ post, onNavigate }: { post: Insight; onNavigate: (p: string) => void }) {
  const href = `/insights/${post.slug}`;
  return (
    <article className="group h-full flex flex-col">
      <Link href={href} onNavigate={onNavigate} className="block overflow-hidden rounded-2xl aspect-[3/2]">
        <img
          src={post.image}
          alt={post.imageAlt}
          width={1264}
          height={848}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="pt-5">
        <Kicker accent>{post.category}</Kicker>
        <h2 className="mt-2 font-['Playfair_Display'] text-2xl sm:text-3xl font-semibold leading-snug text-[#0A1A2E] dark:text-white">
          <Link href={href} onNavigate={onNavigate} className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[#4A5568] dark:text-[#A9B8CC]">{post.excerpt}</p>
        <div className="mt-4">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}

/** Compact text-only row card */
function RowCard({ post, onNavigate }: { post: Insight; onNavigate: (p: string) => void }) {
  const href = `/insights/${post.slug}`;
  return (
    <article className="py-5 first:pt-0 border-b border-[#B9C2CE]/40 dark:border-[#1B3047] last:border-0">
      <Kicker>{post.category}</Kicker>
      <h3 className="mt-1.5 font-['Playfair_Display'] text-lg font-semibold leading-snug text-[#0A1A2E] dark:text-white">
        <Link href={href} onNavigate={onNavigate} className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#4A5568] dark:text-[#A9B8CC] line-clamp-2">{post.excerpt}</p>
      <div className="mt-3">
        <Meta post={post} />
      </div>
    </article>
  );
}

function Card({ post, onNavigate }: { post: Insight; onNavigate: (p: string) => void }) {
  const href = `/insights/${post.slug}`;
  return (
    <article className="group flex flex-col">
      <Link href={href} onNavigate={onNavigate} className="block overflow-hidden rounded-xl aspect-[3/2]">
        <img
          src={post.image}
          alt={post.imageAlt}
          loading="lazy"
          width={1264}
          height={848}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <Kicker accent>{post.category}</Kicker>
          {post.kind === 'curated' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#B9C2CE]/60 dark:border-[#1B3047] text-[#4A5568] dark:text-[#A9B8CC]">
              With sources
            </span>
          )}
        </div>
        <h3 className="mt-2 font-['Playfair_Display'] text-lg font-semibold leading-snug text-[#0A1A2E] dark:text-white">
          <Link href={href} onNavigate={onNavigate} className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#4A5568] dark:text-[#A9B8CC] line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto pt-4">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}

function Breadcrumb({ items, onNavigate }: { items: { label: string; href?: string; internal?: boolean }[]; onNavigate: (p: string) => void }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {it.href ? (
              it.internal ? (
                <Link href={it.href} onNavigate={onNavigate} className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163]">
                  {it.label}
                </Link>
              ) : (
                <a href={it.href} className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163]">
                  {it.label}
                </a>
              )
            ) : (
              <span aria-current="page" className="text-[#0A1A2E] dark:text-white">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CtaBand() {
  return (
    <section className="border-t border-[#B9C2CE]/30 dark:border-[#1B3047]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
        <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-semibold text-[#0A1A2E] dark:text-white">
          Looking for your next leader?
        </h2>
        <p className="mt-3">Talk to TALENTO about a confidential, tailored search.</p>
        <a
          href="#contact"
          className="inline-block mt-6 bg-[#C2A163] hover:bg-[#A8874F] text-[#08162A] px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Contact us
        </a>
      </div>
    </section>
  );
}

function Listing({ onNavigate }: Omit<InsightsPageProps, 'slug'>) {
  const [category, setCategory] = useState<string>('All');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sorted = useMemo(() => [...insights].sort((a, b) => b.date.localeCompare(a.date)), []);
  const tabs = useMemo(() => ['All', ...CATEGORIES.filter((c) => insights.some((i) => i.category === c))], []);

  const filtered = category === 'All' ? sorted : sorted.filter((p) => p.category === category);
  const showFeatured = category === 'All';
  const lead = showFeatured ? filtered[0] : undefined;
  const rows = showFeatured ? filtered.slice(1, 4) : [];
  const rest = showFeatured ? filtered.slice(4) : filtered;
  const shown = rest.slice(0, visible);

  useSeo({
    title: 'Insights | Executive Search, Hiring & Talent Trends - TALENTO',
    description:
      'Practical guides from TALENTO on executive search, hiring strategy, the Bangladesh talent market, leadership and careers, written by our search team.',
    path: '/insights',
    image: '/insights/executive-search.jpg',
    keywords: ['executive search insights', 'hiring strategy', 'talent acquisition blog', 'recruitment trends Bangladesh'],
    jsonLd: [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/insights#blog`,
        url: `${SITE_URL}/insights`,
        name: 'TALENTO Insights',
        description: 'Practical guides on executive search, hiring and talent strategy.',
        inLanguage: 'en',
        publisher: { '@type': 'Organization', name: 'TALENTO', url: SITE_URL, logo: `${SITE_URL}/logo.png` },
      },
      {
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: sorted.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/insights/${p.slug}`,
        })),
      },
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/insights' },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-[#F7F4EC] dark:bg-[#08162A] text-[#4A5568] dark:text-[#A9B8CC] transition-colors duration-200">
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
          <Breadcrumb
            onNavigate={onNavigate}
            items={[{ label: 'Home', href: '#home' }, { label: 'Insights' }]}
          />
          <header className="max-w-3xl">
            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-semibold leading-tight text-[#0A1A2E] dark:text-white">
              TALENTO Insights
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed">
              Executive search, hiring and talent strategy, explained by the consultants who run our searches
              across Bangladesh and the region.
            </p>
          </header>

          <nav aria-label="Insight categories" className="mt-8 border-b border-[#B9C2CE]/40 dark:border-[#1B3047]">
            <ul className="flex gap-6 overflow-x-auto [scrollbar-width:none]">
              {tabs.map((c) => (
                <li key={c} className="shrink-0">
                  <button
                    onClick={() => {
                      setCategory(c);
                      setVisible(PAGE_SIZE);
                    }}
                    aria-pressed={category === c}
                    className={`pb-3 -mb-px text-sm font-medium border-b-2 transition-colors ${
                      category === c
                        ? 'border-[#C2A163] text-[#0A1A2E] dark:text-white'
                        : 'border-transparent hover:text-[#7A5F2E] dark:hover:text-[#C2A163]'
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {showFeatured && lead && (
          <section aria-label="Featured stories" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <LeadCard post={lead} onNavigate={onNavigate} />
              </div>
              <div className="lg:col-span-5 lg:border-l lg:pl-10 border-[#B9C2CE]/40 dark:border-[#1B3047]">
                {rows.map((p) => (
                  <RowCard key={p.slug} post={p} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section aria-label="Latest articles" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
          <div className="flex items-center justify-between border-t border-[#B9C2CE]/40 dark:border-[#1B3047] pt-8 mb-6">
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#0A1A2E] dark:text-white">
              {showFeatured ? 'Latest' : category}
            </h2>
            <span className="text-xs">{filtered.length} articles</span>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <Card key={p.slug} post={p} onNavigate={onNavigate} />
            ))}
          </div>
          {visible < rest.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#C2A163] text-sm font-semibold text-[#7A5F2E] dark:text-[#C2A163] hover:bg-[#C2A163] hover:text-[#08162A] transition-colors"
              >
                Load more articles <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        <NewsletterSection />

        <CtaBand />
      </main>
    </div>
  );
}

function Article({ post, onNavigate }: { post: Insight; onNavigate: (p: string) => void }) {
  const sameCat = insights.filter((i) => i.slug !== post.slug && i.category === post.category);
  const others = insights.filter((i) => i.slug !== post.slug && i.category !== post.category);
  const related = [...sameCat, ...others].slice(0, 3);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const graph: object[] = [
    {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: `${SITE_URL}${post.image}`,
      datePublished: post.date,
      dateModified: post.date,
      articleSection: post.category,
      author: { '@type': 'Organization', name: post.author },
      publisher: { '@type': 'Organization', name: 'TALENTO', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
      mainEntityOfPage: `${SITE_URL}/insights/${post.slug}`,
      keywords: post.keywords.join(', '),
      ...(post.references ? { citation: post.references.map((r) => r.url) } : {}),
    },
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Insights', path: '/insights' },
      { name: post.title, path: `/insights/${post.slug}` },
    ]),
  ];
  if (post.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  useSeo({
    title: `${post.title} | TALENTO Insights`,
    description: post.excerpt,
    path: `/insights/${post.slug}`,
    image: post.image,
    keywords: post.keywords,
    jsonLd: graph,
  });

  return (
    <div className="min-h-screen bg-[#F7F4EC] dark:bg-[#08162A] text-[#4A5568] dark:text-[#A9B8CC] transition-colors duration-200">
      <main className="pt-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-16">
          <Breadcrumb
            onNavigate={onNavigate}
            items={[
              { label: 'Home', href: '#home' },
              { label: 'Insights', href: '/insights', internal: true },
              { label: post.category },
            ]}
          />
          <header>
            <Kicker accent>{post.category}</Kicker>
            <h1 className="mt-3 font-['Playfair_Display'] text-3xl sm:text-4xl font-semibold leading-tight text-[#0A1A2E] dark:text-white">
              {post.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Meta post={post} />
            </div>
            <p className="mt-1 text-xs pl-8">{post.authorRole}</p>
          </header>

          <figure className="my-8 rounded-2xl overflow-hidden">
            <img src={post.image} alt={post.imageAlt} width={1264} height={848} className="w-full h-auto" />
          </figure>

          {post.takeaways && (
            <aside
              aria-labelledby="takeaways-heading"
              className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#EFE9D9]/70 dark:bg-[#0E223D] border border-[#C2A163]/30"
            >
              <h2 id="takeaways-heading" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7A5F2E] dark:text-[#C2A163] mb-3">
                Key takeaways
              </h2>
              <ul className="space-y-2 text-[15px] leading-relaxed text-[#0A1A2E] dark:text-[#D5DCE6]">
                {post.takeaways.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-[#C2A163] mt-1.5 text-xs">◆</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="space-y-5 text-base leading-[1.8]">
            {post.body.map((b, i) => {
              switch (b.type) {
                case 'h2':
                  return (
                    <h2 key={i} className="font-['Playfair_Display'] text-2xl font-semibold text-[#0A1A2E] dark:text-white pt-4">
                      {b.text}
                    </h2>
                  );
                case 'ul':
                  return (
                    <ul key={i} className="space-y-2 pl-1">
                      {b.items.map((it, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="text-[#C2A163] mt-1.5 text-xs">◆</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  );
                case 'quote':
                  return (
                    <blockquote
                      key={i}
                      className="border-l-2 border-[#C2A163] pl-5 italic font-['Playfair_Display'] text-lg text-[#0A1A2E] dark:text-white"
                    >
                      {b.text}
                    </blockquote>
                  );
                default:
                  return <p key={i}>{b.text}</p>;
              }
            })}
          </div>

          {post.faqs && (
            <section aria-labelledby="faq-heading" className="mt-12">
              <h2 id="faq-heading" className="font-['Playfair_Display'] text-2xl font-semibold text-[#0A1A2E] dark:text-white mb-4">
                Frequently asked questions
              </h2>
              <div className="divide-y divide-[#B9C2CE]/40 dark:divide-[#1B3047] border-y border-[#B9C2CE]/40 dark:border-[#1B3047]">
                {post.faqs.map((f, i) => (
                  <div key={f.q}>
                    <h3>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        aria-expanded={openFaq === i}
                        className="w-full flex items-center justify-between gap-4 py-4 text-left font-medium text-[#0A1A2E] dark:text-white"
                      >
                        {f.q}
                        <ChevronDown className={`w-4 h-4 shrink-0 text-[#C2A163] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                      </button>
                    </h3>
                    {openFaq === i && <p className="pb-4 text-[15px] leading-relaxed">{f.a}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {post.references && (
            <aside
              aria-labelledby="references-heading"
              className="mt-12 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047]"
            >
              <h2 id="references-heading" className="font-['Playfair_Display'] text-lg font-semibold text-[#0A1A2E] dark:text-white mb-3">
                References &amp; sources
              </h2>
              <p className="text-sm mb-3">
                This article summarises third-party research. Original data and credit belong to the publishers below.
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                {post.references.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 text-[#7A5F2E] dark:text-[#C2A163] hover:underline break-words"
                    >
                      {r.label}
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </article>

        <section aria-labelledby="related-heading" className="border-t border-[#B9C2CE]/30 dark:border-[#1B3047]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-8">
              <h2 id="related-heading" className="font-['Playfair_Display'] text-2xl font-semibold text-[#0A1A2E] dark:text-white">
                Keep reading
              </h2>
              <Link href="/insights" onNavigate={onNavigate} className="text-sm font-medium text-[#7A5F2E] dark:text-[#C2A163] flex items-center gap-1 hover:underline">
                All insights <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Card key={p.slug} post={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </section>
        <NewsletterSection />
        <CtaBand />
      </main>
    </div>
  );
}

export function InsightsPage({ slug, onNavigate }: InsightsPageProps) {
  const post = slug ? getInsight(slug) : undefined;
  if (post) return <Article post={post} onNavigate={onNavigate} />;
  return <Listing onNavigate={onNavigate} />;
}
