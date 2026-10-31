import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.modules.chat.support.mark_samples import marks_text, module_actor


def test_an_agent_reporting_it_is_stuck_shows_an_impasse_mark_after_the_commit(new_story):
    story = new_story(fixture=LeadStarted)
    story.expect_success("wait stuck 'the build server is down'", actor=story.agent)
    story.run_listeners()
    assert "Stuck: the build server is down" in marks_text(story), marks_text(story)


def test_the_waits_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=LeadStarted)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(1, TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.waits"))
