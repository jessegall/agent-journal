from datetime import timedelta

from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.skills.agent_skills import NOTES_FILE, started

RULE = "skills.already-loaded"
SKIP = f'refusal skip {RULE} --reason "the text was cut from my context" --environment main'
LOADED = "loaded in your context already"


def skill_read(story):
    path = str(story.home.project_folder / NOTES_FILE)
    return HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [path], "diff": None}).with_fields(session="s-1")


def loaded_story(new_story):
    story = started(new_story)
    story.expect_hook_allowed("s-1", skill_read(story))
    story.run_listeners()
    return story


def test_a_second_load_in_the_same_context_is_refused_and_a_confirmed_skip_lets_it_through(new_story):
    story = loaded_story(new_story)
    story.expect_hook_refusal("s-1", skill_read(story), LOADED)
    story.advance(timedelta(seconds=1))
    story.expect_text(SKIP, "held", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_success('refusal confirm 1 --tried "read it again after it left my context" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_hook_allowed("s-1", skill_read(story))


def test_after_a_compaction_the_load_passes_again(new_story):
    story = loaded_story(new_story)
    story.hook("s-1", HookSamples.sample("compact"))
    story.run_listeners()
    story.expect_hook_allowed("s-1", skill_read(story))
