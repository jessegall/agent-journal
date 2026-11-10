---
name: StoriesStayInTheStoryKit
description: Load it before writing or changing a story under tests/stories, so a story works only through the story kit and a refactor of the journal cannot break it while the journal still works.
summary: A story drives the journal through story.run, hooks, the clock and the viewer routes; it never reads story.container or .database, takes monkeypatch, builds a Statement or imports a journal package outside engine.testing.
tier: mandatory
languages: [python]
---

# Stories stay in the story kit

A story tells whether the journal works. It can only do that when it touches what a person or an agent touches: a
command, a hook, the clock and a viewer route. A story that reaches into the journal's own classes breaks when
those classes move, even though the journal still works.

## When it fires

In a file under `tests/stories` that is not a `*_browser.py`:

- **`story-reads-journal-internals`** - `story.container` or a `.database` read.
- **`story-takes-monkeypatch`** - a `monkeypatch` parameter.
- **`story-builds-a-statement`** - a `Statement(` call, which is SQL written in a story.
- **`story-imports-journal-internals`** - an import from `core`, `suites`, `server`, `install` or `tunnels` other
  than `engine.testing`.

## How to fix it

- Run a command with `story.run(...)` and check it with `expect_success`, `expect_text`, `expect_refusal` or
  `expect_rows`.
- Send a hook with `story.hook` and the `HookSamples`, and check it with `expect_hook_allowed` or
  `expect_hook_refusal`.
- Move time with `story.advance`, never with a patched clock.
- Set a setting through its command. Set up shared state in a `StoryFixture`, which lives in `engine.testing` or in
  `tests.stories` support code.
- When the kit lacks what the story needs, add it to `engine.testing` once, for every story, instead of reaching
  inside in one story.
