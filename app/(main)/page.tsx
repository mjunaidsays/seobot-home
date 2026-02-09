import dynamic from "next/dynamic";
import BetaSignupForm from "@/components/BetaSignupForm";
import Logo from "@/components/Logo";

const InteractiveDemo = dynamic(
  () => import("@/components/InteractiveDemo"),
  {
    loading: () => (
      <div className="mt-16 max-w-3xl mx-auto">
        <div className="rounded-xl border border-[#E0DBD2] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#F8F6F1] border-b border-[#E0DBD2]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-yellow-300" />
              <div className="w-3 h-3 rounded-full bg-green-300" />
            </div>
            <div className="h-5 w-48 bg-[#E0DBD2] rounded animate-pulse" />
          </div>
          <div className="p-6 space-y-4">
            <div className="h-4 w-3/4 bg-[#EDEAD6] rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-[#EDEAD6] rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-[#EDEAD6] rounded animate-pulse" />
          </div>
        </div>
      </div>
    ),
  }
);

const SmoothScrollAnchors = dynamic(
  () => import("@/components/SmoothScrollAnchors"),
  { ssr: false }
);

const SectionTracker = dynamic(
  () => import("@/components/SectionTracker"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="landing-page-scope bg-[#F8F6F1] text-[#1A1A19]">
      <SmoothScrollAnchors />
      <SectionTracker />
      {/* ============================================================ */}
      {/* NAV — Logo only, no login (no product to log into yet)       */}
      {/* ============================================================ */}
      <nav className="sticky top-0 z-50 bg-[#F8F6F1]/80 backdrop-blur-md border-b border-[#E0DBD2]">
        <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center">
          <Logo />
        </div>
      </nav>

      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section data-track-section="hero" className="pt-24 pb-20 overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDEAD6] text-[#706B63] text-xs font-semibold uppercase tracking-wider mb-8 border border-[#E0DBD2]">
            <div className="w-2 h-2 rounded-full bg-[#166534] animate-pulse"></div>
            Beta Access Open
          </div>

          {/* Qualifier */}
          <p className="text-base text-[#706B63] font-medium mb-6">For directory founders scaling location pages across hundreds of cities.</p>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.08] mb-6 text-[#1A1A19] font-display tracking-tight">
            500 location pages. Zero rankings.<br />
            <span className="text-gradient italic">We fix that in under an hour.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-[#706B63] max-w-2xl mx-auto mb-14 leading-relaxed font-sans">
            You built the directory. You uploaded the data. But Google sees 500 pages of identical copy — and it&apos;s ranking none of them.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href="#mechanism" data-cta-name="See the Difference" data-cta-location="hero" className="px-8 py-3.5 bg-[#C2410C] text-white rounded-lg font-semibold hover:bg-[#9A3412] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
              See the Difference
              <span className="material-icons-outlined text-sm">arrow_downward</span>
            </a>
            <a href="#get-access" data-cta-name="Get Free Beta Access" data-cta-location="hero" className="px-8 py-3.5 bg-white border border-[#E0DBD2] text-[#706B63] rounded-lg font-semibold hover:bg-[#EDEAD6] transition-all flex items-center gap-2">
              Get Free Beta Access
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#A39E95] font-medium">
            <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">credit_card_off</span> No credit card required</span>
            <span>·</span>
            <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">group</span> Limited to 75 beta members</span>
          </div>

          {/* Animated App Mockup */}
          <InteractiveDemo />

        </div>
      </section>

      {/* ============================================================ */}
      {/* PROBLEM / COMPARISON                                          */}
      {/* ============================================================ */}
      <section data-track-section="problem" className="py-28 bg-[#F8F6F1] overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#C2410C] font-bold text-xs uppercase tracking-widest mb-3 block font-sans">Why your pages aren&apos;t ranking</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A19] mb-6">
              Google demands unique content. <br />
              <span className="text-[#A39E95]">You have 500 identical pages.</span>
            </h2>
            <p className="text-[#706B63] max-w-2xl mx-auto text-lg leading-relaxed">
              Your directory is built. Your data is ready. But every location page needs genuinely different content — and right now, the options are painful.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">

            {/* Pain card */}
            <div className="transform -rotate-1 md:-rotate-2 bg-[#FDF2F0] rounded-2xl p-8 border-2 border-dashed border-[#E8B4A8] relative opacity-[0.85] hover:opacity-100 transition-all duration-300 group origin-bottom-right">
              <div className="flex items-center gap-3 mb-6 border-b border-[#E8B4A8]/40 pb-4">
                <div className="w-8 h-8 rounded bg-[#FDE8E4] flex items-center justify-center text-[#991B1B]">
                  <span className="material-icons-outlined text-sm">close</span>
                </div>
                <h3 className="font-bold text-[#A39E95] text-sm tracking-wide uppercase font-sans">Current Workflow</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 text-[#706B63] text-base">
                  <span className="material-icons-outlined text-[#C2410C]/50 text-base mt-0.5">remove_circle_outline</span>
                  <span>Three weeks of copy-pasting city names into ChatGPT. Page 1 and page 47 read identically.</span>
                </li>
                <li className="flex gap-3 text-[#706B63] text-base">
                  <span className="material-icons-outlined text-[#C2410C]/50 text-base mt-0.5">remove_circle_outline</span>
                  <span>Every page opens with &quot;Welcome to {"{City}"}, where you&apos;ll find...&quot; — and Google notices.</span>
                </li>
                <li className="flex gap-3 text-[#706B63] text-base">
                  <span className="material-icons-outlined text-[#C2410C]/50 text-base mt-0.5">remove_circle_outline</span>
                  <span>$15,000 to freelancers who deliver the same filler with different city names swapped in.</span>
                </li>
                <li className="flex gap-3 text-[#706B63] text-base">
                  <span className="material-icons-outlined text-[#991B1B]/60 text-base mt-0.5">warning</span>
                  <span>You check Search Console. Most of your pages aren&apos;t even indexed. Duplicate content penalty.</span>
                </li>
              </ul>
              <div className="absolute inset-0 bg-[#706B63]/5 pointer-events-none rounded-2xl mix-blend-multiply"></div>
            </div>

            {/* Solution card */}
            <div className="bg-white rounded-2xl p-10 border-2 border-[#166534] shadow-2xl relative z-10 transform md:scale-105">
              <div className="flex items-center gap-3 mb-8 border-b border-[#E0DBD2] pb-6">
                <div className="w-10 h-10 rounded-lg bg-[#166534] flex items-center justify-center text-white shadow-lg shadow-green-100">
                  <span className="material-icons-outlined text-xl">auto_awesome</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A19] text-lg font-sans">With Seoscribed</h3>
                  <p className="text-xs text-[#A39E95]">The Local Context Engine</p>
                </div>
              </div>
              <ul className="space-y-5">
                <li className="flex gap-4 items-start">
                  <div className="mt-0.5 bg-[#DCFCE7] p-0.5 rounded-full text-[#166534]">
                    <span className="material-icons-outlined text-sm font-bold block">check</span>
                  </div>
                  <span className="text-[#1A1A19] text-base font-medium">Upload CSV, generate 500 pages instantly.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-0.5 bg-[#DCFCE7] p-0.5 rounded-full text-[#166534]">
                    <span className="material-icons-outlined text-sm font-bold block">check</span>
                  </div>
                  <span className="text-[#1A1A19] text-base font-medium">Location-aware context (landmarks, facts).</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-0.5 bg-[#DCFCE7] p-0.5 rounded-full text-[#166534]">
                    <span className="material-icons-outlined text-sm font-bold block">check</span>
                  </div>
                  <span className="text-[#1A1A19] text-base font-medium">Built-in uniqueness scoring per page.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="mt-0.5 bg-[#DCFCE7] p-0.5 rounded-full text-[#166534]">
                    <span className="material-icons-outlined text-sm font-bold block">check</span>
                  </div>
                  <span className="text-[#1A1A19] text-base font-medium">Done in under 1 hour. Free during beta.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MECHANISM — Local Context Engine                              */}
      {/* ============================================================ */}
      <section id="mechanism" data-track-section="mechanism" className="py-24 bg-white border-b border-[#E0DBD2]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDEAD6] border border-[#E0DBD2] text-[#C2410C] text-xs font-bold uppercase tracking-wider mb-8">
            <span className="material-icons-outlined text-sm">memory</span>
            The Local Context Engine
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A19] mb-6">
            Why it works when ChatGPT doesn&apos;t.
          </h2>
          <p className="text-lg text-[#706B63] leading-relaxed mb-8 max-w-2xl mx-auto">
            ChatGPT writes from its training data. Feed it 500 cities and you get 500 versions of the same generic paragraph. Seoscribed&apos;s <span className="font-semibold text-[#1A1A19]">Local Context Engine</span> researches each location individually — pulling real neighborhoods, landmarks, demographic data, local institutions, and market stats — then weaves them into content that reads like it was written by someone who actually lives there.
          </p>

          {/* Before / After */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            <div className="text-left bg-[#FDF2F0] border border-[#E8B4A8] rounded-xl p-5 relative">
              <div className="text-[10px] font-bold text-[#991B1B] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-icons-outlined text-xs">close</span> ChatGPT Output — Austin, TX
              </div>
              <p className="text-base text-[#706B63] leading-relaxed italic">
                &quot;Welcome to Austin, TX, where you&apos;ll find a wide range of quality dental providers. Austin is known for its vibrant culture and growing population. Whether you need a routine cleaning or cosmetic dentistry, Austin has many great options to choose from...&quot;
              </p>
            </div>
            <div className="text-left bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 relative">
              <div className="text-[10px] font-bold text-[#166534] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-icons-outlined text-xs">check</span> Seoscribed Output — Austin, TX
              </div>
              <p className="text-base text-[#1A1A19] leading-relaxed italic">
                &quot;From Austin&apos;s vibrant South Congress district to family practices expanding near Round Rock and Cedar Park, the city&apos;s 964,000 residents have access to a growing network fueled by UT Austin&apos;s dental school pipeline...&quot;
              </p>
            </div>
          </div>
          <p className="text-base text-[#A39E95] leading-relaxed max-w-2xl mx-auto">
            Same city. Same prompt. Completely different output — because one researched, the other guessed.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* OFFER — Free beta access                                      */}
      {/* ============================================================ */}
      <section data-track-section="offer" className="py-28 bg-[#141413] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-[#C2410C] via-[#9A3412] to-[#C2410C] opacity-60"></div>
        <div className="max-w-[1120px] mx-auto px-6 text-center relative z-10">

          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider mb-8 border border-white/10">
            Join the Beta
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your directory deserves <br />
            <span className="text-[#C2410C]">content as unique as each city.</span>
          </h2>
          <p className="text-[#A39E95] mb-8 max-w-lg mx-auto text-lg leading-relaxed">
            Join as a founding member. Free access during beta — we&apos;ll generate a sample page for your niche within 24 hours.
          </p>

          {/* Access card */}
          <div id="get-access" className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 backdrop-blur-sm scroll-mt-8">

            <p className="text-sm text-[#C2410C] font-bold uppercase tracking-wider mb-6">Free Beta Access Includes</p>

            {/* Value stack */}
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-3 text-base text-[#A39E95]">
                <span className="material-icons-outlined text-[#166534] text-base">check_circle</span>
                Unlimited page generation
              </div>
              <div className="flex items-center gap-3 text-base text-[#A39E95]">
                <span className="material-icons-outlined text-[#166534] text-base">check_circle</span>
                Built-in uniqueness scoring per page
              </div>
              <div className="flex items-center gap-3 text-base text-[#A39E95]">
                <span className="material-icons-outlined text-[#166534] text-base">check_circle</span>
                Direct CMS push (WordPress, Webflow, more)
              </div>
              <div className="flex items-center gap-3 text-base text-[#A39E95]">
                <span className="material-icons-outlined text-[#166534] text-base">check_circle</span>
                Free sample page for your niche within 24 hours
              </div>
              <div className="flex items-center gap-3 text-base text-[#A39E95]">
                <span className="material-icons-outlined text-[#166534] text-base">check_circle</span>
                Priority support & feature requests
              </div>
            </div>

            {/* EMAIL + CTA */}
            <BetaSignupForm />

            <p className="text-sm text-[#A39E95] mt-3">No credit card. No commitment. If the output doesn&apos;t meet your standard, just walk away.</p>
          </div>

          {/* Scarcity */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#166534]/20 border border-[#166534]/40 rounded-full text-[#4ADE80] text-[10px] font-bold uppercase tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></div>
              Beta limited to 75 founding members
            </div>
            <p className="text-sm text-[#A39E95] mt-3 max-w-sm mx-auto">Capped at 75 to maintain generation quality and give every founding member hands-on support.</p>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ                                                            */}
      {/* ============================================================ */}
      <section data-track-section="faq" className="py-28 bg-[#F8F6F1]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#C2410C] font-bold text-xs uppercase tracking-widest mb-3 block font-sans">Before you commit</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A19]">
              Answers to what you&apos;re already thinking.
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-[#E0DBD2]">
              <div className="flex gap-4">
                <span className="text-[#C2410C] font-bold text-base mt-0.5">1</span>
                <div>
                  <h4 className="font-bold text-[#1A1A19] text-base mb-2 font-sans">How is this different from ChatGPT?</h4>
                  <p className="text-base text-[#706B63] leading-relaxed">
                    ChatGPT generates one page at a time. Loop it with a script and every page still sounds the same. Seoscribed pulls real local context — landmarks, neighborhoods, demographics — to make each page genuinely distinct.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-[#E0DBD2]">
              <div className="flex gap-4">
                <span className="text-[#C2410C] font-bold text-base mt-0.5">2</span>
                <div>
                  <h4 className="font-bold text-[#1A1A19] text-base mb-2 font-sans">Will Google flag AI-generated content?</h4>
                  <p className="text-base text-[#706B63] leading-relaxed">
                    Google penalizes duplicate content, not AI content itself. Every page gets a uniqueness score before publish. If any page is too similar to another, you&apos;ll see it first.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-[#E0DBD2]">
              <div className="flex gap-4">
                <span className="text-[#C2410C] font-bold text-base mt-0.5">3</span>
                <div>
                  <h4 className="font-bold text-[#1A1A19] text-base mb-2 font-sans">Can I see a sample before I decide?</h4>
                  <p className="text-base text-[#706B63] leading-relaxed">
                    Yes. Every founding member gets a free sample page generated for their niche within 24 hours of signing up. If the output doesn&apos;t meet your standard, no commitment — you&apos;re in beta, not a contract.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inline CTA after FAQ */}
          <div className="mt-12 text-center">
            <a href="#get-access" data-cta-name="Get Free Beta Access" data-cta-location="faq" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C2410C] text-white rounded-lg font-semibold hover:bg-[#9A3412] transition-all shadow-lg">
              Get Free Beta Access
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                        */}
      {/* ============================================================ */}
      <footer className="py-10 bg-[#141413] border-t border-[#2A2A28]">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#706B63]">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p>© 2026 Seoscribed. All rights reserved.</p>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a className="hover:text-white transition-colors" href="/privacy">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
