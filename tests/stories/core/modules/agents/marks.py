from tests.stories.core.modules.chat.support.v4_looks import SUBAGENT, expect_declared_appearance
import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_dispatch_shows_one_mark_with_its_instruction_and_it_finishes_in_place(new_story):
    story = new_story(fixture=BuilderStarted)
    sample = HookSamples.subagent().with_raw({"tool_use_id": "t-1", "tool_input": {"subagent_type": "journal-researcher", "model": "haiku", "description": "Read the cart", "prompt": "Find where totals are counted"}})
    story.hook("s-1", sample)
    story.run_listeners()
    assert "Dispatched journal-researcher . haiku: Read the cart" in marks_text(story), marks_text(story)
    story.expect_text("chat-mark show 1", "detail: Find where totals are counted", "state: shown")
    story.hook("s-1", sample.with_fields(event="post_tool_use"))
    story.run_listeners()
    assert mark_count(story) == 1 and "Finished journal-researcher: Read the cart" in marks_text(story), marks_text(story)
    story.expect_text("chat-mark show 1", "state: ended")


def test_a_main_agent_started_shows_no_subagent_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run_listeners()
    assert "Subagent" not in marks_text(story) and "Dispatched" not in marks_text(story), marks_text(story)


def test_the_agents_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=BuilderStarted)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(1, TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.agents"))


def test_the_subagent_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(fixture=BuilderStarted), SUBAGENT)
