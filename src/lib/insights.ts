import { countryGuides } from './countryGuides';

export interface InsightReference {
  label: string;
  url: string;
}

export type InsightBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string };

export interface InsightFaq {
  q: string;
  a: string;
}

export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  image: string;
  imageAlt: string;
  author: string;
  authorRole: string;
  keywords: string[];
  /** 'original' = written by TALENTO; 'curated' = summarised from external sources */
  kind: 'original' | 'curated';
  takeaways?: string[];
  body: InsightBlock[];
  faqs?: InsightFaq[];
  references?: InsightReference[];
}

export const SITE_URL = 'https://talento.agency';

export const CATEGORIES = [
  'Executive Search',
  'Hiring Strategy',
  'Talent Market',
  'Global Hiring',
  'HR & Leadership',
  'Career Advice',
  'News & Updates',
] as const;

const TEAM = { author: 'TALENTO Editorial Team', authorRole: 'Search & advisory practitioners' };
const SEARCH = { author: 'TALENTO Search Desk', authorRole: 'Executive search consultants' };

const baseInsights: Insight[] = [
  {
    slug: 'introducing-talento-insights',
    title: 'Introducing TALENTO Insights: Practical Hiring Guidance from the Search Desk',
    excerpt:
      'Why we started publishing, what you can expect, and how we separate our own experience from third-party research.',
    category: 'News & Updates',
    date: '2026-10-20',
    readMinutes: 3,
    image: '/insights/news-update.jpg',
    imageAlt: 'Modern architectural corporate skyscraper at dusk matching TALENTO executive brand',
    ...TEAM,
    keywords: ['TALENTO insights', 'recruitment blog', 'executive search articles'],
    kind: 'original',
    takeaways: [
      'Insights is where TALENTO shares what we learn from live searches.',
      'Articles are either written by our team or clearly marked as summaries with sources.',
      'New guides are published regularly on hiring, leadership and careers.',
    ],
    body: [
      {
        type: 'p',
        text: 'Every week our consultants answer the same kinds of questions: how long should a senior search take, what should we pay, how do we keep a new leader from leaving in year one. Insights is our attempt to answer them in the open, so more teams can hire with confidence.',
      },
      { type: 'h2', text: 'What you will find here' },
      {
        type: 'ul',
        items: [
          'Executive search: how confidential, research-led hiring really works.',
          'Hiring strategy: process, scorecards and metrics that improve quality of hire.',
          'Talent market: trends and local context for Bangladesh and the wider region.',
          'HR and leadership: onboarding, retention and building strong teams.',
          'Career advice: practical guidance for candidates at every level.',
        ],
      },
      { type: 'h2', text: 'How we handle sources' },
      {
        type: 'p',
        text: 'When an article builds on research from another organisation, we say so, summarise it in our own words, and link to the original so you can read the full report. Everything else reflects our own experience and opinions.',
      },
    ],
  },
  {
    slug: 'what-is-executive-search',
    title: 'What Is Executive Search, and When Should Your Company Use It?',
    excerpt:
      'Executive search is a targeted, confidential way to hire senior leaders. Here is how it works and when it beats traditional recruiting.',
    category: 'Executive Search',
    date: '2026-10-12',
    readMinutes: 5,
    image: '/insights/executive-search.jpg',
    imageAlt: 'Senior leaders interviewing a candidate in a modern boardroom',
    ...SEARCH,
    keywords: ['executive search', 'headhunting', 'leadership recruitment', 'C-suite hiring'],
    kind: 'original',
    takeaways: [
      'Executive search proactively approaches leaders who are not job hunting.',
      'It suits business-critical, confidential or hard-to-fill senior roles.',
      'A good process defines outcomes first, then maps the market in depth.',
    ],
    body: [
      {
        type: 'p',
        text: 'Executive search is a specialised recruitment approach used to fill senior, high-impact roles such as CEO, CTO, CFO, and country or functional heads. Instead of waiting for applications, a search partner proactively identifies, approaches, and evaluates leaders who are often not looking for a new job.',
      },
      { type: 'h2', text: 'How executive search differs from standard recruiting' },
      {
        type: 'ul',
        items: [
          'Proactive: candidates are mapped and approached directly, including passive talent.',
          'Confidential: sensitive replacements or new strategic roles can be handled discreetly.',
          'Consultative: the brief, scorecard, and compensation are shaped with your leadership team.',
          'Assessed in depth: leadership, culture fit, and track record are verified, not assumed.',
        ],
      },
      { type: 'h2', text: 'When it makes sense to use a search partner' },
      {
        type: 'p',
        text: 'Consider executive search when the role is business-critical, when the talent pool is small, when confidentiality matters, or when previous hiring attempts have stalled. A wrong senior hire is expensive in salary, lost momentum, and team morale.',
      },
      { type: 'h2', text: 'What a good search process looks like' },
      {
        type: 'ul',
        items: [
          'Discovery call to define outcomes, not just a job description.',
          'Market mapping and a confidential outreach plan.',
          'Structured interviews and reference checks.',
          'Shortlist presentation, offer support, and onboarding follow-up.',
        ],
      },
      {
        type: 'quote',
        text: 'The best senior hires are rarely on job boards. They are found through research, relationships, and patience.',
      },
    ],
    faqs: [
      {
        q: 'How long does an executive search usually take?',
        a: 'Most senior searches take roughly two to four months from kickoff to signed offer, depending on seniority, location and how specialised the profile is.',
      },
      {
        q: 'Is executive search only for large companies?',
        a: 'No. Growing companies often benefit most, because one senior hire can change the direction of the business.',
      },
    ],
  },
  {
    slug: 'hiring-process-that-attracts-top-talent',
    title: '7 Steps to a Hiring Process That Attracts Top Talent',
    excerpt:
      'A clear, fast and respectful hiring process wins better candidates. Use this seven-step framework to improve quality of hire.',
    category: 'Hiring Strategy',
    date: '2026-10-05',
    readMinutes: 6,
    image: '/insights/hiring-process.jpg',
    imageAlt: 'Resumes, a laptop and coffee on a recruiter desk',
    ...TEAM,
    keywords: ['hiring process', 'talent acquisition', 'quality of hire', 'recruitment strategy'],
    kind: 'original',
    takeaways: [
      'Top candidates judge your company by how you hire.',
      'Define success, score consistently and decide within 48 hours.',
      'Track time-to-hire, offer acceptance and 6-month retention.',
    ],
    body: [
      {
        type: 'p',
        text: 'Top candidates evaluate you as much as you evaluate them. A slow or unclear process signals a slow or unclear company. These seven steps help you move quickly without lowering the bar.',
      },
      { type: 'h2', text: 'The seven steps' },
      {
        type: 'ul',
        items: [
          '1. Define success: write 3-5 measurable outcomes for the first 12 months.',
          '2. Write an honest job post: clear scope, salary range, and growth path.',
          '3. Source widely: combine referrals, direct outreach, and talent communities.',
          '4. Screen with a scorecard: the same criteria for every candidate.',
          '5. Keep interviews short and structured: two to three rounds with clear owners.',
          '6. Decide fast: share feedback within 48 hours.',
          '7. Close and onboard well: a strong first 90 days protects your hiring investment.',
        ],
      },
      { type: 'h2', text: 'Measure what matters' },
      {
        type: 'p',
        text: 'Track time-to-hire, offer acceptance rate, candidate experience scores, and 6-month retention. These four metrics quickly show where your process leaks talent.',
      },
    ],
  },
  {
    slug: 'how-to-write-a-job-description',
    title: 'How to Write a Job Description That Attracts the Right Candidates',
    excerpt:
      'Most job posts list tasks and ignore outcomes. A simple structure that makes your role clear, honest and competitive.',
    category: 'Hiring Strategy',
    date: '2026-09-28',
    readMinutes: 4,
    image: '/insights/job-description.jpg',
    imageAlt: 'Person typing on a laptop next to a notebook and pen',
    ...TEAM,
    keywords: ['job description', 'job posting tips', 'attract candidates', 'hiring'],
    kind: 'original',
    takeaways: [
      'Lead with the outcomes the role must deliver, not a list of duties.',
      'Show the salary range and growth path to attract serious candidates.',
      'Keep requirements to the true must-haves.',
    ],
    body: [
      {
        type: 'p',
        text: 'A job description is your first sales page and your first filter. Vague or inflated posts attract the wrong people and push away the best ones, who have plenty of options.',
      },
      { type: 'h2', text: 'A structure that works' },
      {
        type: 'ul',
        items: [
          'Opening: two sentences on why the role exists and the impact it has.',
          'Outcomes: three to five results expected in the first year.',
          'Requirements: only what is truly essential, separated from nice-to-haves.',
          'Package: salary range, benefits, working model and location.',
          'Process: the steps and timeline so candidates know what to expect.',
        ],
      },
      { type: 'h2', text: 'Common mistakes' },
      {
        type: 'ul',
        items: [
          'Listing 15 requirements for a role that needs five.',
          'Using internal jargon and unclear titles.',
          'Hiding compensation, which lowers response from senior candidates.',
          'Describing the company in clichés instead of facts.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-hire-in-bangladesh',
    title: 'Hiring in Bangladesh: A Practical Guide for Employers',
    excerpt:
      'From sourcing and compensation to offers and onboarding, the practical points to consider when building a team in Dhaka and beyond.',
    category: 'Talent Market',
    date: '2026-09-20',
    readMinutes: 6,
    image: '/insights/hiring-bangladesh.jpg',
    imageAlt: 'Professionals collaborating in a modern office in Dhaka',
    ...TEAM,
    keywords: ['hiring in Bangladesh', 'recruitment Dhaka', 'Bangladesh talent market', 'employer guide'],
    kind: 'original',
    takeaways: [
      'Plan for a competitive market in technology, finance and leadership roles.',
      'Be clear on salary, festival bonuses and notice periods in the offer.',
      'Take local legal and tax advice before finalising contracts.',
    ],
    body: [
      {
        type: 'p',
        text: 'Bangladesh has a young, ambitious workforce and a growing pool of professionals in technology, banking, FMCG, healthcare and creative services. Hiring well still takes local knowledge. This guide covers the practical points we see employers ask about most. It is general information, not legal advice.',
      },
      { type: 'h2', text: 'Where to find talent' },
      {
        type: 'ul',
        items: [
          'Referrals from your own team and advisers, which often give the best quality.',
          'Professional networks such as LinkedIn for mid and senior profiles.',
          'University and graduate programmes for entry-level pipelines.',
          'A specialist search partner for leadership and hard-to-fill roles.',
        ],
      },
      { type: 'h2', text: 'Compensation and offers' },
      {
        type: 'p',
        text: 'Benchmark salaries against comparable roles in your sector rather than relying on a single number. Candidates also look at the full package: festival bonuses, which are customary and often expected, health coverage, flexibility and growth. Put every element in writing to avoid misunderstandings later.',
      },
      { type: 'h2', text: 'Contracts and compliance' },
      {
        type: 'p',
        text: 'Employment terms, probation, notice, leave and termination are governed by local law. Ask a qualified Bangladeshi legal or HR adviser to review your contract templates and confirm current rules, because regulations and tax treatment change over time.',
      },
      { type: 'h2', text: 'Retention starts at the offer stage' },
      {
        type: 'p',
        text: 'Explain the role, reporting line and growth path honestly. Candidates who join with realistic expectations stay longer than those who were over-sold.',
      },
    ],
    faqs: [
      {
        q: 'Should I use a recruitment agency in Bangladesh?',
        a: 'For senior or specialised roles, a search partner saves time and reaches passive candidates. For high-volume junior roles, direct hiring is often sufficient.',
      },
    ],
  },
  {
    slug: 'future-of-jobs-skills-2030',
    title: 'The Future of Jobs: What the WEF Report Means for Employers',
    excerpt:
      'The World Economic Forum expects major job and skills shifts by 2030. We summarise the findings and what hiring teams should do now.',
    category: 'Talent Market',
    date: '2026-09-10',
    readMinutes: 5,
    image: '/insights/market-trends.jpg',
    imageAlt: 'Modern city business district at dusk with glass towers',
    ...TEAM,
    keywords: ['future of jobs', 'skills 2030', 'workforce planning', 'labour market trends'],
    kind: 'curated',
    takeaways: [
      'Large-scale job creation and displacement are both expected by 2030.',
      'Technology, analytical and resilience skills are rising in demand.',
      'Skills gaps are employers\' biggest barrier to transformation.',
    ],
    body: [
      {
        type: 'p',
        text: 'The World Economic Forum\'s Future of Jobs Report 2025 surveys employers worldwide about how technology, demographics, and the economy will reshape work. This article summarises its headline themes. All figures belong to the original publication; please read the full report below for context and methodology.',
      },
      { type: 'h2', text: 'Key takeaways' },
      {
        type: 'ul',
        items: [
          'The report projects large-scale job creation alongside job displacement by 2030, with a net positive effect overall.',
          'A significant share of core skills required in existing jobs is expected to change within this period.',
          'Technology skills such as AI and big data, alongside analytical thinking and resilience, rank among the fastest-growing capabilities.',
          'Skills gaps are named by employers as the biggest barrier to business transformation.',
        ],
      },
      { type: 'h2', text: 'What hiring teams should do now' },
      {
        type: 'ul',
        items: [
          'Hire for adaptability and learning agility, not only for tools used today.',
          'Build internal upskilling pathways to reduce dependence on scarce external talent.',
          'Use skills-based assessments alongside CV screening.',
          'Plan senior and critical hires earlier, since specialised talent takes longer to find.',
        ],
      },
    ],
    references: [
      {
        label: 'World Economic Forum - The Future of Jobs Report 2025',
        url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
      },
    ],
  },
  {
    slug: 'employee-engagement-and-retention',
    title: 'Why Engagement Matters: Lessons from Gallup on Retention',
    excerpt:
      'Gallup research links employee engagement with performance and retention. A summary of its findings and practical actions for managers.',
    category: 'HR & Leadership',
    date: '2026-09-02',
    readMinutes: 4,
    image: '/insights/retention.jpg',
    imageAlt: 'Two professionals shaking hands after a successful job offer',
    ...TEAM,
    keywords: ['employee engagement', 'retention', 'Gallup', 'manager effectiveness'],
    kind: 'curated',
    takeaways: [
      'Only a minority of employees worldwide report being engaged.',
      'Managers strongly influence team engagement.',
      'Hiring for motivation and fit reduces early attrition.',
    ],
    body: [
      {
        type: 'p',
        text: 'Gallup\'s State of the Global Workplace research tracks employee engagement across the world and highlights the economic cost of disengagement. This article summarises its main message; statistics should be read directly in the latest edition of the report.',
      },
      { type: 'h2', text: 'What the research suggests' },
      {
        type: 'ul',
        items: [
          'Only a minority of employees globally report being engaged at work.',
          'Managers account for a large share of the variation in team engagement.',
          'Low engagement is associated with lower productivity and higher turnover.',
        ],
      },
      { type: 'h2', text: 'Practical actions for managers' },
      {
        type: 'ul',
        items: [
          'Hold regular one-to-ones focused on growth and workload, not only status.',
          'Clarify expectations and give recognition frequently.',
          'Train new managers: promoting a strong individual contributor is not enough.',
          'Run short pulse surveys and act visibly on the results.',
        ],
      },
      {
        type: 'p',
        text: 'Retention starts at hiring. Recruiting people whose motivations match the role and culture reduces early attrition and strengthens engagement from day one.',
      },
    ],
    references: [
      {
        label: 'Gallup - State of the Global Workplace',
        url: 'https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx',
      },
    ],
  },
  {
    slug: 'onboarding-first-90-days',
    title: 'Onboarding Senior Hires: A 90-Day Plan That Protects Your Investment',
    excerpt:
      'The first three months decide whether a new leader succeeds. A simple 30-60-90 framework for managers and HR teams.',
    category: 'HR & Leadership',
    date: '2026-08-24',
    readMinutes: 5,
    image: '/insights/onboarding.jpg',
    imageAlt: 'A manager welcoming a new employee at their desk',
    ...SEARCH,
    keywords: ['onboarding', '90 day plan', 'new leader integration', 'employee retention'],
    kind: 'original',
    takeaways: [
      'Plan onboarding before the offer is accepted.',
      'Days 1-30 are for listening; 31-60 for early wins; 61-90 for ownership.',
      'Schedule check-ins with the hiring manager at weeks 2, 6 and 12.',
    ],
    body: [
      {
        type: 'p',
        text: 'A senior hire is not complete when the contract is signed. Many failed hires are really failed onboardings: unclear expectations, missing introductions, and no early feedback. A structured plan fixes most of that.',
      },
      { type: 'h2', text: 'Days 1-30: learn and connect' },
      {
        type: 'ul',
        items: [
          'Meet key stakeholders, customers and team members.',
          'Review strategy, numbers and open risks.',
          'Agree what success looks like at day 90 and day 180.',
        ],
      },
      { type: 'h2', text: 'Days 31-60: deliver early wins' },
      {
        type: 'ul',
        items: [
          'Pick two or three visible, achievable priorities.',
          'Start addressing quick fixes and clarify decision rights.',
          'Share initial observations with the leadership team.',
        ],
      },
      { type: 'h2', text: 'Days 61-90: take ownership' },
      {
        type: 'ul',
        items: [
          'Present a 12-month plan with measurable targets.',
          'Review team structure and talent needs.',
          'Collect feedback from both the hire and the manager.',
        ],
      },
    ],
  },
  {
    slug: 'ai-in-recruitment',
    title: 'Using AI in Recruitment Without Losing the Human Touch',
    excerpt:
      'AI can speed up sourcing and screening, but judgment, fairness and relationships still decide great hires. Where to automate and where not to.',
    category: 'Hiring Strategy',
    date: '2026-08-12',
    readMinutes: 5,
    image: '/insights/ai-recruiting.jpg',
    imageAlt: 'Professional analysing data dashboards on a laptop in a modern office',
    ...TEAM,
    keywords: ['AI recruitment', 'recruitment technology', 'candidate screening', 'ethical hiring'],
    kind: 'original',
    takeaways: [
      'Use AI for drafting, scheduling and organisation.',
      'Keep people in charge of shortlists and decisions.',
      'Review tools for bias and document how they are used.',
    ],
    body: [
      {
        type: 'p',
        text: 'AI tools now help with job descriptions, résumé parsing, interview scheduling, and talent mapping. Used well, they free recruiters to spend more time on what machines cannot do: assessing motivation, building trust, and advising clients.',
      },
      { type: 'h2', text: 'Good places to use AI' },
      {
        type: 'ul',
        items: [
          'Drafting and improving job descriptions.',
          'Scheduling and candidate communication.',
          'Summarising notes and organising pipelines.',
          'Market and competitor mapping for search projects.',
        ],
      },
      { type: 'h2', text: 'Where humans must stay in charge' },
      {
        type: 'ul',
        items: [
          'Final shortlisting and hiring decisions.',
          'Assessing leadership, ethics, and cultural contribution.',
          'Reviewing tools for bias and documenting how they are used.',
          'Delivering feedback and negotiating offers.',
        ],
      },
      {
        type: 'quote',
        text: 'Technology finds candidates faster. People help them say yes for the right reasons.',
      },
    ],
  },
  {
    slug: 'salary-negotiation-guide',
    title: 'Salary Negotiation for Candidates: A Calm, Practical Guide',
    excerpt:
      'How to research your worth, frame your ask and negotiate an offer without damaging the relationship.',
    category: 'Career Advice',
    date: '2026-07-30',
    readMinutes: 5,
    image: '/insights/salary-negotiation.jpg',
    imageAlt: 'Two professionals in a calm discussion across a table',
    ...TEAM,
    keywords: ['salary negotiation', 'job offer', 'career advice', 'compensation'],
    kind: 'original',
    takeaways: [
      'Research ranges and know your minimum before the conversation.',
      'Discuss the whole package, not only base salary.',
      'Stay collaborative: you are negotiating a long-term relationship.',
    ],
    body: [
      {
        type: 'p',
        text: 'Negotiation feels uncomfortable, yet most employers expect it for professional roles. Handled respectfully, it shows you understand your value and helps both sides start on the right footing.',
      },
      { type: 'h2', text: 'Before the conversation' },
      {
        type: 'ul',
        items: [
          'Benchmark the role using peers, advisers and recruiters.',
          'Decide your target, your walk-away point and your priorities.',
          'List your strongest, evidence-backed achievements.',
        ],
      },
      { type: 'h2', text: 'During the conversation' },
      {
        type: 'ul',
        items: [
          'Express enthusiasm first, then raise your request calmly.',
          'Anchor on value and market data rather than personal needs.',
          'Consider bonus, title, flexibility, learning budget and review timing.',
          'Ask for the final offer in writing.',
        ],
      },
      { type: 'h2', text: 'What to avoid' },
      {
        type: 'p',
        text: 'Avoid ultimatums, bluffing about competing offers, or revealing a bottom line too early. If the answer is no, ask what it would take to revisit compensation in six months.',
      },
    ],
  },
  {
    slug: 'building-high-performing-teams',
    title: 'Building a High-Performing Team: Hire for Skill, Will and Fit',
    excerpt:
      'Great teams combine capability, motivation and culture add. Learn how to evaluate all three during the hiring process.',
    category: 'HR & Leadership',
    date: '2026-07-14',
    readMinutes: 4,
    image: '/insights/team-culture.jpg',
    imageAlt: 'Diverse team collaborating around a table in a bright office',
    ...TEAM,
    keywords: ['team building', 'culture fit', 'high performing teams', 'hiring for potential'],
    kind: 'original',
    takeaways: [
      'Assess skill, will and fit together, not in isolation.',
      'Look for culture add rather than "like me".',
      'Never skip references for senior hires.',
    ],
    body: [
      {
        type: 'p',
        text: 'Skills can be trained, but motivation and values are harder to change. High-performing teams are built by evaluating three things together: skill (can they do it), will (do they want to do it), and fit (will they strengthen the team).',
      },
      { type: 'h2', text: 'How to assess each dimension' },
      {
        type: 'ul',
        items: [
          'Skill: work samples, case discussions, and verified achievements.',
          'Will: ask about choices they made, what energises them, and why this role.',
          'Fit: explore how they collaborate, handle disagreement, and give feedback.',
        ],
      },
      { type: 'h2', text: 'Avoid common traps' },
      {
        type: 'ul',
        items: [
          'Confusing "like me" with culture fit; look for culture add instead.',
          'Over-weighting a polished interview style.',
          'Skipping references for senior hires.',
        ],
      },
    ],
  },
];

export const insights: Insight[] = [...baseInsights, ...countryGuides];

export const getInsight = (slug: string) => insights.find((i) => i.slug === slug);
