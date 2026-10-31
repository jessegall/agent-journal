from tests.stories.core.modules.chat.support.v4_looks import SUBAGENT, expect_declared_look
import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import marks_text, module_actor
from tests.stories.core.support.coding_fixtures import BuilderStarted, SubagentStarted


def test_a_subagent_started_shows_a_mark_after_the_commit(new_story):
    story = new_story(fixture=SubagentStarted)
    story.run_listeners()
    assert f"Subagent {story.subagent.id} started" in marks_text(story), marks_text(story)


def test_a_main_agent_started_shows_no_subagent_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run_listeners()
    assert "Subagent" not in marks_text(story), marks_text(story)


def test_the_agents_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=BuilderStarted)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(1, TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.agents"))


def test_the_subagent_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_look(new_story(fixture=BuilderStarted), SUBAGENT)
