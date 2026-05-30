# Agent Corner: The Workshop That Built Itself

*Introducing a new column on what coding agents make possible — starting with the site you may have already seen.*

By Mark Williams

---

A few weeks ago, the VAILL team ran a workshop for Vanderbilt Law faculty on AI coding agents — what they are, what they actually do, and how someone with no technical background can put them to work in legal teaching and practice. The companion resource we built for that workshop is now public, at [**vaillagentsworkshop.org**](https://vaillagentsworkshop.org/). You should be able to use it without ever having been in the room.

That site is the artifact. This post is about something different — how it came to exist at all, and why that is genuinely interesting.

Because the honest answer is that I did not build the site the way anyone reading this post built a website a year ago. There was no design firm. No CMS subscription. No engineer. The site is a static [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) build hosted on GitHub Pages, and I produced essentially every word, every page, every CSS tweak in conversation with Claude Code.

That sentence is also the reason I am starting a new column on this Substack called **Agent Corner**.

---

## What "Agent Corner" is

If [*What We're Actually Using AI For*](https://aioflaw.substack.com/) is about the workflows we've stitched together with the tools we already had, Agent Corner is about what becomes possible when you stop treating AI as a smarter search box and start treating it as a collaborator that can build things alongside you. It is the column where we will work through what is genuinely new — for legal educators, practitioners, librarians, clinic directors — once you take coding agents seriously.

This first post is a worked example. The site itself is the demonstration. How it got built is the lesson.

---

## What actually happened

I did not start from a blank page. The site's architecture, theme, and several of the foundational essays were adapted from [claudeblattman](https://github.com/chrisblattman/claudeblattman), an open-source project by Chris Blattman, a political economist at the University of Chicago who built an AI workflow system for his own research and shared it under the MIT license. That foundation saved months of work. It is also the kind of thing the open-source world has always done. What changed is that I was able to absorb, adapt, and substantially rewrite it without needing to learn the frameworks underneath it.

The actual work of turning Blattman's project into a guide for law faculty looked, in practice, like a long, branching conversation with Claude Code. I described what I wanted at each step — a new section on legal practice; a tone that does not patronize law professors; a navigation that mirrors how lawyers think about their work — and Claude wrote the markdown, edited the CSS, restructured the navigation, and committed the changes. I read and verified, corrected and pushed back, rejected things that did not sound like us. But I never opened the CSS file myself.

When new releases dropped mid-project — most notably Anthropic's [claude-for-legal plugin suite](https://github.com/anthropics/claude-for-legal) in May — I was able to read the announcement, understand what was there, and add a section to the site within an evening, without breaking what was already built.

---

## Why six months ago this was not possible

Coding agents existed in late 2025. But the specific stack that made this site achievable in evenings and weekends did not. Three things had to come together.

Claude Code became capable enough to handle multi-file refactors and small design judgments without producing brittle output that fell apart the next time you asked for a change. Anthropic shipped a plugins-and-skills model that let an agent read a custom configuration profile, learn a project's house style, and stay on-voice across sessions. And the [Cowork interface](https://www.anthropic.com/news/claude-cowork) lowered the friction of using agents to the point where someone without a terminal background could direct one to do real work.

Each of those was an incremental change. Together they crossed a threshold. The site you can visit right now is what living on the other side of that threshold looks like, for one professor and one project.

This is, I think, what Cat was pointing at in [*The Gift of Latency*](https://aioflaw.substack.com/p/the-gift-of-latency) — the technology is arriving in pieces, not in a single wave, and the gaps between the pieces are the windows in which we get to decide what to build. The site is what one of those decisions looks like.

---

## What I want you to take from this

Two things.

First: if you have a project sitting in your "I would do this if I had a developer" pile, take it out. Try it. The category of work that requires a developer is now genuinely smaller than it was six months ago, and the cost of being wrong is one afternoon. The site we just released is the evidence.

Second: none of this is a substitute for knowing what you want to make. The reason this project worked is that I knew what a good faculty resource needed to contain, what would feel patronizing to a law professor, and what arguments belonged in the introduction. Claude could not have produced that on its own. It could produce the artifact — once I knew what I was asking for.

That is the through-line for Agent Corner. The tools have become genuinely capable. Whether they amount to anything still depends entirely on what we choose to do with them.

---

*Have a project you have been hesitant to start because it felt like it needed a developer? Drop it in the comments. The next Agent Corner post will pick one and walk through how I would approach it.*
