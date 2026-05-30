# Agent Corner: The Workshop That Built Itself

*A new column on what coding agents make possible — starting with the site you may have already seen.*

By Mark Williams

---

A few weeks ago, the VAILL team ran a workshop for Vanderbilt Law faculty on AI coding agents — what they are, what they actually do, and how someone with no technical background can put them to work in legal scholarship and practice. The companion resource we built for that workshop is now public, at [**vaillagentsworkshop.org**](https://vaillagentsworkshop.org/).

That site is the artifact. If you work in legal academia, I hope you can use it — or borrow pieces for your own needs. This post is about something different: how it came to exist at all, and why that is worth talking about.

I produced every word, every page, every tweak on the site in conversation with Claude Code. Most readers already know that agentic coding tools have gotten better. But after six months of intentional practice with them, I want to use this Substack to talk about what I am building, and more importantly, what I am learning. That is the point of **Agent Corner** — a new series here on *The AI of Law* where I will work through these projects in public.

## What actually happened

I did not start from a blank page. The site's architecture, theme, and several of the foundational sections were adapted from [claudeblattman](https://github.com/chrisblattman/claudeblattman), an open-source project by Chris Blattman, a political economist at the University of Chicago who built an AI workflow system for his own research and shared it under the MIT license. Without that foundation I would not have built the site at all. What is new is that I could absorb it, adapt it, and substantially rewrite it without needing to learn the frameworks behind it.

The work itself was a long, branching conversation with Claude Code. I would describe what I wanted — a new section on legal practice, a tone that does not patronize law professors, a navigation that mirrors how lawyers think about their work — and Claude wrote the markdown, edited the CSS, restructured the navigation, and committed the changes. I read, verified, corrected, and rejected anything that did not sound like us. I never opened the CSS file myself.

When new releases landed mid-project — most notably Anthropic's [claude-for-legal plugin suite](https://github.com/anthropics/claude-for-legal) in May — I could read the announcement, see what was there, and add a section to the site in an evening, without breaking what was already built.

## Why six months ago this was not possible

Coding agents existed in late 2025. The stack that made this site achievable on evenings and weekends did not.

Claude Code became capable enough to handle multi-file refactors and small design judgments without producing brittle output that breaks the next time you ask for a change. Anthropic shipped a plugins-and-skills model that lets an agent read a custom configuration profile, learn a project's house style, and stay on-voice across sessions. The [Cowork interface](https://www.anthropic.com/news/claude-cowork) dropped the friction of running agents low enough that someone without a terminal background can direct one to do real work.

Individually, none of those changes was dramatic. Together they crossed a threshold. This site is what life on the other side of that threshold looks like — for one professor, on one project.

That is part of what Cat described in [*The Gift of Latency*](https://aioflaw.substack.com/p/the-gift-of-latency): the technology arrives in pieces, not as a wave, and the gaps between the pieces are where we choose what to build.

## What I want you to take from this

If you have a project sitting in your "I would do this if I had a developer" pile, pull it out. The category of work that requires a developer is smaller than it was six months ago, and the cost of being wrong is an afternoon. The site is the evidence.

None of this replaces knowing what you want to make. This project worked because I knew what a good faculty resource needs to contain, what would feel patronizing to a law professor, and what arguments belong in the introduction. Claude could not have produced that. It could produce the artifact once I knew what I was asking for.

The tools are capable now. What they amount to depends on what we do with them.

---

*Have a project you have been putting off because it felt like it needed a developer? Drop it in the comments. The next Agent Corner post will pick one and walk through how I would approach it.*
