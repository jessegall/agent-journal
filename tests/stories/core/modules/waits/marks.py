from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.chat.support.v4_looks import REPORTED_WAIT, expect_declared_appearance
import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.modules.chat.support.mark_samples import marks_text, module_actor, expect_marks_text


def test_an_agent_reporting_it_is_stuck_shows_an_impasse_mark_after_the_commit(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_success("wait stuck 'the build server is down'", actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Stuck: the build server is down")


def test_the_waits_module_writes_only_its_own_marks(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.waits"), environment_id=1)


def test_the_impasse_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(SAMPLES, fixture=LeadStarted), REPORTED_WAIT)
