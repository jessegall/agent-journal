---
name: journal-plan-dispatch
description: How the main agent gets a plan made: it dispatches a functional designer and then a planner; read it when the user asks for a plan
---

# Getting a plan made

When the user asks for a plan, you do not design it or write it yourself. Two helpers do it, one after the other, so a
strong model does the thinking once and a cheaper one writes the plan.

1. Start the functional designer with `journal helper start journal-functional-designer --brief "<what the user asked>"`.
   Its report names a design document.
2. When it reports, start the planner with `journal helper start journal-planner --brief "Make the plan from doc <n>"`.
   Its report names the plan, which waits for the user's approval.

Tell the user in one line when the document is there and when the plan is ready. How the two helpers do their work is
theirs: give them the request and the document number, nothing more.

## When helpers are switched off

When the user switches helpers off, the helper start is refused. Then make the plan yourself with the journal commands:
read the skills journal-planning and journal-plans first.
