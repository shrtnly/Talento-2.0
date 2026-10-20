import type { Insight, InsightBlock, InsightFaq, InsightReference } from './insights';

interface GuideInput {
  slug: string;
  country: string;
  excerpt: string;
  date: string;
  image: string;
  imageAlt: string;
  overview: string;
  law: string[];
  costs: string[];
  talent: string[];
  visas: string[];
  models: string[];
  tips: string[];
  faqs: InsightFaq[];
  references: InsightReference[];
  readMinutes?: number;
}

const DISCLAIMER =
  'This guide is general information based on publicly available sources and our market experience. It is not legal, tax or immigration advice. Rules, thresholds and rates change, so confirm current requirements with the relevant authority or a qualified local adviser before you hire.';

function guide(g: GuideInput): Insight {
  const body: InsightBlock[] = [
    { type: 'p', text: g.overview },
    { type: 'h2', text: `Employment law essentials in ${g.country}` },
    { type: 'ul', items: g.law },
    { type: 'h2', text: 'Payroll, contributions and benefits' },
    { type: 'ul', items: g.costs },
    { type: 'h2', text: 'Where the talent is and how to source it' },
    { type: 'ul', items: g.talent },
    { type: 'h2', text: `Hiring foreign nationals in ${g.country}` },
    { type: 'ul', items: g.visas },
    { type: 'h2', text: `Ways to hire in ${g.country}` },
    { type: 'ul', items: g.models },
    { type: 'h2', text: 'Practical tips from our search desk' },
    { type: 'ul', items: g.tips },
    { type: 'p', text: DISCLAIMER },
  ];

  return {
    slug: g.slug,
    title: `How to Hire in ${g.country}: Complete Employer Guide (2026)`,
    excerpt: g.excerpt,
    category: 'Global Hiring',
    date: g.date,
    readMinutes: g.readMinutes ?? 7,
    image: g.image,
    imageAlt: g.imageAlt,
    author: 'TALENTO Search Desk',
    authorRole: 'Executive search consultants',
    keywords: [
      `hire in ${g.country}`,
      `${g.country} employer guide`,
      `recruitment ${g.country}`,
      `employment law ${g.country}`,
      'global hiring',
    ],
    kind: 'curated',
    takeaways: [
      g.law[0],
      g.costs[0],
      `Confirm current rules with ${g.country}'s official sources or a local adviser before hiring.`,
    ],
    body,
    faqs: g.faqs,
    references: g.references,
  };
}

export const countryGuides: Insight[] = [
  guide({
    slug: 'how-to-hire-in-india',
    country: 'India',
    excerpt:
      'Labour codes, provident fund, notice periods and work visas: what employers need to know before building a team in India.',
    date: '2026-10-19',
    image: '/insights/hire-india.jpg',
    imageAlt: 'Modern business district skyline in India at golden hour',
    overview:
      'India offers one of the largest and most diverse talent pools in the world, with strong depth in software, engineering, finance, healthcare and a growing market for senior leaders in Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune and Chennai. Competition for experienced professionals is intense, and long notice periods mean timelines need careful planning.',
    law: [
      'India has been consolidating its central labour laws into four labour codes covering wages, industrial relations, social security and occupational safety. Check the current implementation status and any state-level rules.',
      'State Shops and Establishments Acts commonly set working hours, leave and public holidays, and they vary by state.',
      'A written appointment letter is standard practice and should cover role, pay, probation, notice and confidentiality.',
      'Notice periods of one to three months are common, and longer for leadership roles. Buy-out arrangements are often negotiated.',
      'Post-employment non-compete clauses are generally difficult to enforce under Indian contract law, so rely on confidentiality and non-solicitation terms.',
    ],
    costs: [
      'Employer contribution to the Employees\' Provident Fund is commonly 12% of eligible basic wages, subject to the applicable rules.',
      'Employees State Insurance applies below a wage threshold, and gratuity is typically payable after five years of continuous service.',
      'Candidates usually compare the full CTC: fixed pay, variable pay, health insurance and retirement benefits.',
      'Professional tax and tax deducted at source (TDS) are handled through payroll and vary by state and employee.',
    ],
    talent: [
      'Professional networks and referrals are the main route for mid and senior hires.',
      'Campus hiring works well for entry-level pipelines in technology and management.',
      'Executive search is valuable for leadership roles where candidates are passive and notice periods are long.',
      'Expect counter-offers; keep candidates engaged between offer and joining.',
    ],
    visas: [
      'Foreign nationals generally need an employment visa tied to a sponsoring employer, along with registration formalities after arrival.',
      'Authorities have historically applied a minimum salary threshold for employment visas, so check the current requirement.',
      'Plan visa timelines into your start date and consider whether a local entity is required.',
    ],
    models: [
      'Direct hire through an Indian subsidiary: full control, but requires entity setup and compliance filings.',
      'Employer of Record: a partner employs staff on your behalf while you direct the work.',
      'Search partner: for leadership and specialist roles, with a placement fee model.',
    ],
    tips: [
      'Verify credentials and employment history through professional background checks.',
      'Budget for notice-period buy-outs when a candidate is at a critical stage of a project.',
      'Offer clarity on location, hybrid policy and growth path, which strongly influence acceptance.',
    ],
    faqs: [
      {
        q: 'How long are notice periods in India?',
        a: 'One to three months is common for professional roles, and longer for senior leaders. The exact period depends on the employment contract.',
      },
      {
        q: 'Do I need a local entity to hire in India?',
        a: 'Direct employment normally requires a local entity. An Employer of Record can be an alternative while you test the market.',
      },
    ],
    references: [
      { label: 'Ministry of Labour & Employment, Government of India', url: 'https://labour.gov.in/' },
      { label: 'Employees\' Provident Fund Organisation (EPFO)', url: 'https://www.epfindia.gov.in/' },
    ],
  }),
  guide({
    slug: 'how-to-hire-in-vietnam',
    country: 'Vietnam',
    excerpt:
      'Probation limits, social insurance, the 13th-month salary custom and work permits: a practical employer guide to hiring in Vietnam.',
    date: '2026-10-18',
    image: '/insights/hire-vietnam.jpg',
    imageAlt: 'Ho Chi Minh City skyline and river at dusk',
    overview:
      'Vietnam is one of Southeast Asia\'s fastest-growing economies, with a young workforce and strong demand in technology, manufacturing, logistics, finance and consumer sectors. Ho Chi Minh City, Hanoi and Da Nang are the main hiring hubs. The Labour Code of 2019 is the primary framework for employers.',
    law: [
      'Employment contracts must be in writing and are typically either fixed-term or indefinite-term under the Labour Code.',
      'Probation periods are capped by the level of the role, with longer limits for roles requiring higher qualifications and managerial positions. Confirm the current caps before drafting contracts.',
      'The standard working week is up to 48 hours, with overtime regulated and paid at premium rates.',
      'Statutory annual leave and public holidays apply, and termination must follow the grounds and notice rules in the Labour Code.',
      'Internal labour regulations must be registered once an employer reaches the size threshold.',
    ],
    costs: [
      'Employers and employees both contribute to social, health and unemployment insurance, based on insurable salary. Employer contributions add a meaningful percentage on top of gross pay, so model total cost carefully.',
      'A 13th-month salary or year-end bonus is customary in many companies, even where not strictly mandatory.',
      'Personal income tax is progressive and generally withheld through payroll.',
      'Many employers add private health insurance and allowances to stay competitive.',
    ],
    talent: [
      'Technology and engineering talent is concentrated in Ho Chi Minh City and Hanoi.',
      'Professional social networks and referrals work well for mid-level hires.',
      'Bilingual professionals with English, Japanese or Korean skills are in high demand.',
      'For senior positions, search partners help reach passive leaders.',
    ],
    visas: [
      'Foreign employees generally need a work permit, or an exemption certificate, in addition to an appropriate visa and temporary residence card.',
      'Requirements usually relate to experience, qualifications and the type of role, such as manager, executive or expert.',
      'Allow several weeks for document legalisation and processing.',
    ],
    models: [
      'Set up a local entity to employ staff directly and manage payroll and insurance filings.',
      'Use an Employer of Record to hire without an entity while you validate the market.',
      'Engage an executive search firm for leadership and specialist hires.',
    ],
    tips: [
      'Be explicit about gross versus net salary in offers, because candidates often think in net terms.',
      'Include the 13th-month bonus policy in the offer letter if you offer it.',
      'Keep contract language available in Vietnamese as well as English.',
    ],
    faqs: [
      {
        q: 'Is a 13th-month salary mandatory in Vietnam?',
        a: 'It is widely practised and often expected, but the legal position depends on the contract and company policy. Confirm with a local adviser.',
      },
      {
        q: 'Can foreigners work in Vietnam without a work permit?',
        a: 'Some categories are exempt, but most foreign employees need a work permit or an exemption certificate.',
      },
    ],
    references: [
      { label: 'Ministry of Labour, Invalids and Social Affairs (Vietnam)', url: 'https://www.molisa.gov.vn/' },
    ],
  }),
  guide({
    slug: 'how-to-hire-in-the-uk',
    country: 'the UK',
    excerpt:
      'Right-to-work checks, written terms, holiday entitlement, pensions and employer National Insurance: your guide to hiring in the United Kingdom.',
    date: '2026-10-17',
    image: '/insights/hire-uk.jpg',
    imageAlt: 'London skyline and financial district along the Thames at dusk',
    overview:
      'The United Kingdom has a mature, highly skilled labour market, with London, Manchester, Edinburgh, Birmingham and Bristol as major hubs for finance, technology, life sciences and professional services. Employers benefit from strong talent but must comply with detailed employment, tax and right-to-work rules.',
    law: [
      'Employers must check every new hire\'s right to work in the UK before they start, and keep records of the checks.',
      'Employees are entitled to a written statement of employment particulars on or before their first day.',
      'Statutory minimum holiday is 5.6 weeks per year, which can include bank holidays.',
      'Employees acquire unfair dismissal protection after a qualifying service period, and notice and redundancy rules apply. Employment law is evolving, so check current reforms.',
      'Contracts commonly include probation, notice, confidentiality, and sometimes restrictive covenants that must be reasonable to be enforceable.',
    ],
    costs: [
      'Employers pay secondary Class 1 National Insurance contributions on salary above a threshold, and the rate and threshold change with budgets.',
      'Automatic pension enrolment requires employers to enrol eligible staff and pay minimum contributions.',
      'Statutory sick pay, parental leave and National Minimum or Living Wage obligations apply.',
      'Many employers add private medical cover, bonus and share schemes to compete for talent.',
    ],
    talent: [
      'Professional networks and specialist job boards are widely used for mid-level hires.',
      'Executive search is common for senior roles in finance, technology and healthcare.',
      'Hybrid working is an expected part of the offer for many professionals.',
      'Notice periods of one to three months are typical, and longer for leaders.',
    ],
    visas: [
      'Most overseas workers need sponsorship under the points-based immigration system, which requires a sponsor licence.',
      'Roles must meet skill and salary requirements that are updated periodically.',
      'Employers are responsible for sponsor duties, including reporting and record keeping.',
    ],
    models: [
      'Employ directly through a UK company registered for PAYE.',
      'Use an Employer of Record to hire quickly without establishing a local entity.',
      'Use contractors for project work, taking care to assess employment status correctly.',
    ],
    tips: [
      'Get contract templates reviewed by a UK employment lawyer.',
      'Document your selection criteria to support fair, non-discriminatory hiring.',
      'Plan for notice periods when setting a target start date.',
    ],
    faqs: [
      {
        q: 'What checks are required before a UK hire starts?',
        a: 'A right-to-work check, with a record kept, must be completed before employment begins. Many employers also run reference and background checks.',
      },
      {
        q: 'Can I hire overseas candidates directly in the UK?',
        a: 'Yes, if you hold a sponsor licence and the role meets the requirements of the relevant visa route.',
      },
    ],
    references: [
      { label: 'GOV.UK: Employing people', url: 'https://www.gov.uk/employing-people' },
      { label: 'GOV.UK: Check a job applicant\'s right to work', url: 'https://www.gov.uk/check-job-applicant-right-to-work' },
    ],
  }),
  guide({
    slug: 'how-to-hire-in-china',
    country: 'China',
    excerpt:
      'Written contracts, probation rules, social insurance and the housing fund: key points for employers hiring in mainland China.',
    date: '2026-10-16',
    image: '/insights/hire-china.jpg',
    imageAlt: 'Shanghai financial skyline across the river at dusk',
    overview:
      'China offers vast and varied talent, from engineering and manufacturing to finance, e-commerce and AI, concentrated in Shanghai, Beijing, Shenzhen, Guangzhou and Hangzhou. The Labour Contract Law is employee-protective, so compliance from day one is essential.',
    law: [
      'A written employment contract must be signed within one month of the start date. Failing to do so can lead to penalties, including additional wages.',
      'Probation length depends on the contract term, with longer maximums for longer contracts, and probation can generally be used only once per employee.',
      'After consecutive fixed-term contracts, employees may become entitled to an open-ended contract.',
      'Termination must rely on lawful grounds, and economic compensation may be payable based on length of service.',
      'Working hours, overtime and statutory holidays are regulated, and work rules should be properly communicated to staff.',
    ],
    costs: [
      'Employers contribute to mandatory social insurance (pension, medical, unemployment, work injury and maternity), with rates varying by city.',
      'A housing provident fund contribution is generally required and also varies by location.',
      'Contribution bases are linked to local average wages, so cost modelling should be city-specific.',
      'Annual bonuses, often tied to a thirteenth-month practice, are common in many sectors.',
    ],
    talent: [
      'Local recruitment platforms and professional networks are heavily used in China.',
      'University recruitment is a major pipeline for technology and engineering.',
      'For senior and cross-border roles, executive search helps identify leaders with international experience.',
      'Candidates value stability, career growth and brand reputation in the market.',
    ],
    visas: [
      'Foreign employees typically need a work permit and a residence permit for work, with eligibility tied to qualifications, experience and role classification.',
      'Processing involves multiple authorities, so allow adequate lead time.',
      'The employer must usually be a registered entity in China.',
    ],
    models: [
      'Establish a wholly foreign-owned enterprise or other entity to employ staff directly.',
      'Use an Employer of Record to employ staff through a local entity while you build a presence.',
      'Use executive search for leadership roles and specialist technical hires.',
    ],
    tips: [
      'Sign contracts on time and keep thorough records, since disputes are heavily document-based.',
      'Have contracts and work rules available in Chinese.',
      'Check city-level policies for social insurance and housing fund details.',
    ],
    faqs: [
      {
        q: 'What happens if I do not sign a contract within one month?',
        a: 'Employers can face penalties, including paying additional wages for the period without a written contract. Always sign promptly.',
      },
      {
        q: 'Can I hire in China without a local entity?',
        a: 'Directly, no. An Employer of Record can employ staff on your behalf through its local entity.',
      },
    ],
    references: [
      { label: 'The State Council of the People\'s Republic of China (English)', url: 'https://english.www.gov.cn/' },
    ],
  }),
  guide({
    slug: 'how-to-hire-in-singapore',
    country: 'Singapore',
    excerpt:
      'CPF contributions, Key Employment Terms, Employment Pass rules and fair hiring practices: a practical guide to hiring in Singapore.',
    date: '2026-10-15',
    image: '/insights/hire-singapore.jpg',
    imageAlt: 'Singapore Marina Bay business district skyline at twilight',
    overview:
      'Singapore is a leading regional hub for finance, technology, shipping, life sciences and regional headquarters. The talent market is highly competitive and international, and the regulatory framework is clear but strictly enforced.',
    law: [
      'The Employment Act sets baseline protections, and employers must provide Key Employment Terms in writing within a set period of the start date.',
      'Minimum annual leave, public holidays, sick leave and working-hour rules apply based on the employee\'s coverage.',
      'Notice periods and termination terms follow the contract, or the statutory minimum where none is stated.',
      'The Tripartite Guidelines on Fair Employment Practices require non-discriminatory hiring and job advertising.',
      'Retrenchment benefits are guided by tripartite advisories rather than fixed statutory amounts, so confirm current guidance.',
    ],
    costs: [
      'Employers contribute to the Central Provident Fund (CPF) for Singapore citizens and permanent residents, with rates depending on age and wage level.',
      'Foreign employees on work passes generally do not receive CPF contributions.',
      'Skills Development Levy and, for foreign workers, work pass levies may apply.',
      'Common benefits include medical insurance, annual wage supplement and performance bonuses.',
    ],
    talent: [
      'Professional networks, specialist job boards and executive search are widely used.',
      'The market is multinational, so experience with regional scope is a common requirement.',
      'Salary expectations are high, particularly in finance and technology.',
      'Employers are generally expected to advertise roles fairly before applying for certain work passes.',
    ],
    visas: [
      'Common work passes include the Employment Pass for professionals and the S Pass for mid-skilled staff.',
      'The Employment Pass uses a points-based framework and salary thresholds, which are updated periodically.',
      'Employers may need to advertise the role on the national job portal before applying for an Employment Pass.',
    ],
    models: [
      'Incorporate a Singapore company to hire directly, with a local director requirement.',
      'Use an Employer of Record to employ staff through a local entity.',
      'Use search partners for regional leadership and specialist roles.',
    ],
    tips: [
      'Check Employment Pass eligibility early, because salary thresholds and assessment criteria are updated.',
      'Be transparent about the full package, since candidates compare base, bonus and benefits closely.',
      'Document fair selection practices to align with tripartite guidelines.',
    ],
    faqs: [
      {
        q: 'Do employers pay CPF for foreign employees?',
        a: 'CPF applies to Singapore citizens and permanent residents. Foreign work pass holders generally do not receive employer CPF contributions.',
      },
      {
        q: 'Do I need to advertise a job before hiring a foreigner?',
        a: 'For many Employment Pass applications, employers are expected to advertise the role fairly first. Check the current requirements.',
      },
    ],
    references: [
      { label: 'Ministry of Manpower, Singapore: Employment practices', url: 'https://www.mom.gov.sg/employment-practices' },
    ],
  }),
  guide({
    slug: 'how-to-hire-in-malaysia',
    country: 'Malaysia',
    excerpt:
      'Employment Act coverage, EPF and SOCSO contributions, and expatriate passes: what employers should know before hiring in Malaysia.',
    date: '2026-10-14',
    image: '/insights/hire-malaysia.jpg',
    imageAlt: 'Kuala Lumpur city skyline with illuminated towers at dusk',
    overview:
      'Malaysia combines a multilingual, cost-competitive workforce with strong sectors in manufacturing, electronics, finance, shared services and technology. Kuala Lumpur, Penang and Johor are the main hubs. Recent amendments have broadened the reach of the Employment Act.',
    law: [
      'The Employment Act 1955 sets baseline terms, and recent amendments have extended core protections to all employees, with some provisions still tied to wage thresholds.',
      'The standard working week has been reduced under recent amendments, and overtime rules apply to covered employees.',
      'Statutory maternity and paternity leave, annual leave and public holidays apply.',
      'Termination must follow contractual notice or statutory minimums, and dismissal should be for just cause.',
      'Probation and notice terms should be set out clearly in the written contract.',
    ],
    costs: [
      'Employers contribute to the Employees Provident Fund (EPF), with the rate depending on the employee\'s wage and status.',
      'SOCSO (social security) and the Employment Insurance System (EIS) contributions also apply to eligible employees.',
      'A Human Resources Development Fund levy applies to some employers.',
      'Annual bonuses are common, and many employers also provide medical and insurance benefits.',
    ],
    talent: [
      'Professional networks and online job platforms are standard for mid-level hiring.',
      'Multilingual candidates in English, Malay, Mandarin and Tamil are common, which suits regional roles.',
      'Shared services and technology talent is concentrated around Kuala Lumpur and Penang.',
      'Executive search helps reach senior leaders in regulated industries.',
    ],
    visas: [
      'Expatriates generally need an Employment Pass or a similar category, with the employer as sponsor.',
      'Eligibility depends on salary, qualifications and the role, and categories have different criteria.',
      'Employers may need to show that local talent was considered for the role.',
    ],
    models: [
      'Establish a Malaysian company to employ staff directly.',
      'Use an Employer of Record to hire without a local entity.',
      'Use a search partner for management and specialist positions.',
    ],
    tips: [
      'Confirm whether wage-linked provisions of the Employment Act apply to the role.',
      'Check the current EPF rates and the expatriate pass requirements before making an offer.',
      'Keep written records of working hours and overtime for covered employees.',
    ],
    faqs: [
      {
        q: 'Do foreign employees contribute to EPF in Malaysia?',
        a: 'The rules for foreign workers differ from those for citizens and permanent residents. Check current EPF guidance for your case.',
      },
      {
        q: 'Does the Employment Act apply to managers?',
        a: 'Recent amendments extended core protections to all employees, though some provisions depend on wage levels. Confirm for each role.',
      },
    ],
    references: [
      { label: 'Ministry of Human Resources, Malaysia', url: 'https://www.mohr.gov.my/' },
      { label: 'Employees Provident Fund (KWSP)', url: 'https://www.kwsp.gov.my/' },
    ],
  }),
  guide({
    slug: 'how-to-hire-in-the-uae',
    country: 'the UAE (Dubai)',
    excerpt:
      'Mainland versus free zone, fixed-term contracts, end-of-service gratuity and Emiratisation: a clear guide to hiring in Dubai and the UAE.',
    date: '2026-10-13',
    image: '/insights/hire-uae.jpg',
    imageAlt: 'Dubai Downtown financial skyline with modern towers at sunset',
    overview:
      'The United Arab Emirates, led by Dubai and Abu Dhabi, is a global magnet for talent across finance, real estate, aviation, technology and trade. The workforce is highly international. Where you set up, mainland or free zone, shapes which rules apply and who regulates your hiring.',
    law: [
      'Private-sector employment is governed by the federal labour law, with free zones often having their own additional regulations.',
      'Contracts are fixed-term, are lodged through the labour ministry system, and should state role, pay and notice.',
      'A probation period is permitted up to a statutory maximum, and notice requirements apply to termination during and after probation.',
      'Standard working hours, annual leave and sick leave entitlements apply, and working hours can be reduced during Ramadan.',
      'Companies above a certain size in the mainland are subject to Emiratisation targets for skilled roles.',
    ],
    costs: [
      'End-of-service gratuity is payable based on length of service and basic salary.',
      'Employers must provide health insurance in certain emirates such as Dubai and Abu Dhabi.',
      'Salaries are paid through the Wage Protection System, which tracks timely payment.',
      'Typical packages include housing and transport allowances, annual flights and education support for senior hires.',
    ],
    talent: [
      'The market is international, with large pools of South Asian, Middle Eastern, European and Southeast Asian professionals.',
      'Executive search and professional networks are the main routes for senior roles.',
      'Candidates value tax-free income, but also growth, stability and package clarity.',
      'Moves between employers are frequent, so retention planning matters.',
    ],
    visas: [
      'Employers generally sponsor an employment visa and Emirates ID for each foreign employee, with a medical test and insurance.',
      'Free zones issue their own visas, while mainland companies work through the federal system.',
      'Golden Visas and other long-term options exist for certain professionals and investors.',
    ],
    models: [
      'Mainland company for broad access to the local market.',
      'Free zone company with simplified setup for specific industries.',
      'Employer of Record to hire without establishing a legal entity.',
    ],
    tips: [
      'Decide between mainland and free zone early because it affects licensing, visas and hiring rules.',
      'Spell out allowances and gratuity entitlements clearly in the offer.',
      'Check current Emiratisation requirements and deadlines for your company size.',
    ],
    faqs: [
      {
        q: 'What is Emiratisation?',
        a: 'It is a government programme that requires certain private companies to employ a growing share of UAE nationals in skilled roles.',
      },
      {
        q: 'Is there personal income tax in the UAE?',
        a: 'There is currently no personal income tax on employment income, but employers should confirm current tax rules and any social contributions for nationals.',
      },
    ],
    references: [
      { label: 'Ministry of Human Resources and Emiratisation (UAE)', url: 'https://www.mohre.gov.ae/' },
    ],
  }),
  guide({
    slug: 'how-to-hire-in-thailand',
    country: 'Thailand',
    excerpt:
      'Probation, severance, social security and work permits: everything an employer should know before hiring in Thailand.',
    date: '2026-10-12',
    image: '/insights/hire-thailand.jpg',
    imageAlt: 'Bangkok modern business district skyline at dusk',
    overview:
      'Thailand has a large workforce, a strong manufacturing and tourism base, and growing technology, finance and regional headquarters activity centred on Bangkok and the Eastern Economic Corridor. The Labour Protection Act is the main framework for private-sector employers.',
    law: [
      'Employment can be agreed verbally or in writing, but a written contract in Thai and English is strongly advised.',
      'Probation is commonly up to 119 days, since employees who pass 120 days become entitled to statutory severance.',
      'Severance pay is calculated on length of service when employment is terminated without cause.',
      'Working hours, overtime, annual leave and public holidays are regulated, and work rules are required once an employer reaches a size threshold.',
      'Notice is generally given at least one pay period ahead, and termination terms should follow the Labour Protection Act.',
    ],
    costs: [
      'Employers and employees contribute to the Social Security Fund, with contributions based on wage ceilings that are updated periodically.',
      'A workmen\'s compensation fund contribution applies to employers.',
      'Many companies provide a year-end bonus and private health insurance as common benefits.',
      'Personal income tax is progressive and withheld through payroll.',
    ],
    talent: [
      'Online job platforms and professional networks are widely used for mid-level hiring.',
      'Bilingual and trilingual professionals with English, Japanese or Chinese are in demand.',
      'Search firms support leadership hiring for multinational and regional roles.',
      'Candidates often value location, stability and the reputation of the employer.',
    ],
    visas: [
      'Foreign employees generally need a non-immigrant visa and a work permit issued under Thai regulations.',
      'Companies usually need minimum capital and local-employee ratios to support foreign work permits, so check current criteria.',
      'Investment-promoted companies may benefit from more flexible arrangements.',
    ],
    models: [
      'Register a Thai company to employ staff directly.',
      'Use an Employer of Record to hire without establishing an entity.',
      'Use a search partner for management and specialist hires.',
    ],
    tips: [
      'Keep probation inside the 119-day window if you want to avoid severance liability.',
      'Provide bilingual contracts and policies for clarity.',
      'Plan work permit processing time into start dates for foreign hires.',
    ],
    faqs: [
      {
        q: 'How long can probation last in Thailand?',
        a: 'Probation commonly runs up to 119 days. Employees who complete 120 days become entitled to statutory severance if terminated without cause.',
      },
      {
        q: 'Do I need a work permit for a foreign employee?',
        a: 'Yes, foreign nationals generally need a work permit and an appropriate visa to work legally in Thailand.',
      },
    ],
    references: [
      { label: 'Ministry of Labour, Thailand', url: 'https://www.mol.go.th/en/' },
    ],
  }),
];
