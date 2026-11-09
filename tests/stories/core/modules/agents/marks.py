from tests.stories.core.modules.chat.support.v4_looks import SUBAGENT, expect_declared_appearance
import pytest

from core.base.command.bus import Bus
from engine.errors.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_absent_marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_agents_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=BuilderStarted)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.agents"), environment_id=1)


def test_the_helper_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(fixture=BuilderStarted), SUBAGENT)
