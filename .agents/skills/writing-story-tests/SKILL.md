---
name: writing-story-tests
description: Write stories of agent behaviour, using this checkout's real commands, hooks and StoryFixture API.
---

# Writing story tests

Write the behaviour as stories. Cover the ordinary case, the relevant row states and callers,
refusals and recovery. Put related cases in one file under `tests/stories/core/modules/<module>/` or
`tests/stories/suites/coding/modules/<module>/`, following the neighbouring files.

## Use the API in this checkout

Tests receive the `new_story` pytest fixture. Start with `new_story(fixture=SomeStoryFixture)`.
Read `src/core/testing/story.py`, `src/core/testing/story_fixture.py` and a nearby story before adding a helper.
The available fixtures live in `tests/stories/core/support/` and module-specific `support/` folders.

```python
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


def test_a_started_task_names_its_holder(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_text("task show 1", "state: started", f"holder_id: {story.agent.id}", actor=story.agent)
```

`story.run(command, actor=actor)` runs the real console and returns a `LineOutcome` with `code` and `output_text`.
Use `expect_success` for complete output lines, `expect_text` for substrings, `expect_refusal` for a refused write,
and `expect_rows` for row checks. Set settings through their real commands. Read JSON with `--json` when checking a
structured response. Exercise hooks through `HookSamples` and `story.hook`, `expect_hook_allowed` or
`expect_hook_refusal`. Check nudges through their declaration rather than copying their prose.

Shared setup belongs in a `StoryFixture` subclass with `parent`, `steps(story)` and `expect(story)`, or a pytest fixture
for runtime resources that cannot be cached in a database fixture. Reuse the closest existing fixture. The overlap
check rejects stories in one file that share two or more first steps; fixture setup does not count as story steps.
Each test body starts with the action that distinguishes its case.

Drive state changes through the public command or hook that owns them. Do not write a command's rows directly to make
its test pass. Use the existing `Story` methods; there is no `@story` decorator, `story.agents` collection or
`story.agent_runs` API in this checkout. A helper belongs in the relevant support module or in `engine.testing` when it
serves all stories. Unit tests cover individual building blocks, rather than replacing stories of agent behaviour.

## Run the affected stories

Run the file and the affected neighbouring files when the behaviour is written:

```sh
.venv/bin/python -m pytest tests/stories/suites/coding/modules/workers/status.py -q
```

After a failure, run the failed
tests by name and the files changed since. Workers run only the tests of their changes; the main agent owns any
required full-suite run. The `journal suite` command is unavailable in this checkout.

A worker's background run is watched automatically. Continue independent work or stop and receive its result when
it ends. A worker does not need a Monitor or repeated status reads.
