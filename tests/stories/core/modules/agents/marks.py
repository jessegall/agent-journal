from tests.stories.core.modules.chat.support.v4_looks import SUBAGENT, expect_declared_appearance
import pytest

from core.base.change.event_log import EventLog
from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.base.change.created import Created
from core.base.query.queries import Queries
from core.modules.helpers.listeners.helper_job_mark_listener import HelperJobMarkListener
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_absent_marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_main_agent_started_shows_no_helper_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run_listeners()
    expect_absent_marks_text(story, "Subagent")
    expect_absent_marks_text(story, "Started journal")


def test_the_agents_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=BuilderStarted)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.agents"), environment_id=1)


def test_the_helper_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(fixture=BuilderStarted), SUBAGENT)


@pytest.fixture
def researcher_dispatched(new_story):
    story = new_story(fixture=BuilderStarted)
    sample = HookSamples.helper().with_raw({"tool_use_id": "t-1", "tool_input": {"subagent_type": "journal-researcher", "model": "haiku", "description": "Read the cart", "prompt": "Find where totals are counted"}})
    story.hook("s-1", sample)
    story.run_listeners()
    return story, sample
