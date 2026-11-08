from core.base.driver.command_category import CommandCategory
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_output_2, expect_value

RESUME = HookSamples.session_start().with_raw({"source": "resume"})
COMPACTION = HookSamples.session_start().with_raw({"source": "compact"})
MEMORY = "1 memories to read"
WORKING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))


def kept_memory_story(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('memory make "Keep the totals in cents" --weight 5 --environment main', actor=story.agent)
    return story


def test_a_resumed_session_gets_no_start_lines_but_the_one_saying_it_continues(new_story):
    story = kept_memory_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    expect_lines_hook(story, "s-1", RESUME, [continued_line(story)])


def continued_line(story) -> str:
    return f"you are back in a conversation that went on before, session {story.agent.id}: say so to the user in a line, in your voice; then carry on with what was in hand, or ask what to do"


def test_a_main_agent_that_was_working_is_idle_when_started_again_and_told_once_that_it_continues(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_allowed("s-1", WORKING)
    hook_calls = story.container.get(HookCallQuery)
    expect_value(bool(hook_calls.is_idle(story.agent.id, story.clock.timestamp())), False)
    expect_lines_hook(story, "s-1", RESUME, [continued_line(story)])
    expect_value(bool(hook_calls.is_idle(story.agent.id, story.clock.timestamp())), True)
    expect_lines_hook(story, "s-1", WORKING, [])


def test_a_first_start_gets_the_memories(new_story):
    story = kept_memory_story(new_story)
    story.expect_hook_allowed("s-2", HookSamples.session_start().with_fields(session="s-2"), MEMORY)


def test_a_start_after_a_compaction_gets_the_memories(new_story):
    story = kept_memory_story(new_story)
    story.expect_hook_allowed("s-1", COMPACTION, MEMORY)


def test_a_resumed_session_makes_no_start_skill_due(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run_listeners()
    listed_rows = story.run(f"agent-skill list --agent {story.agent.id}", actor=story.agent).output_text
    story.hook("s-1", RESUME)
    story.run_listeners()
    expect_output_2(story, f"agent-skill list --agent {story.agent.id}", listed_rows)


def expect_lines_hook(story, text, item, expected) -> None:
    actual = story.hook(text, item).lines
    assert actual == expected, actual
