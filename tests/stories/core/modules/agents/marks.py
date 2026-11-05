from tests.stories.core.modules.chat.support.v4_looks import SUBAGENT, expect_declared_appearance
import pytest

from core.base.change.event_log import EventLog
from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.drivers.commands.bind_helper_dispatch.bind_helper_dispatch import BindSubagentDispatch
from core.base.change.created import Created
from core.base.query.queries import Queries
from core.modules.helpers.listeners.helper_job_mark_listener import HelperJobMarkListener
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_absent_marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_dispatch_shows_one_mark_with_its_instruction_and_it_finishes_in_place(researcher_dispatched):
    story, sample = researcher_dispatched
    expect_marks_text(story, "Started journal-researcher . haiku: Read the cart")
    story.expect_text("chat-mark show 1", "detail: Find where totals are counted", "state: shown")
    story.hook("s-1", sample.with_fields(event="post_tool_use"))
    story.run_listeners()
    expect_mark_count(story, 1)
    expect_marks_text(story, "Finished journal-researcher")
    story.expect_text("chat-mark show 1", "state: ended")


def test_a_dispatch_that_was_launched_in_the_background_stays_dispatched_after_the_tool_answers(researcher_dispatched):
    story, sample = researcher_dispatched
    launched = sample.with_fields(event="post_tool_use").with_raw({**sample.body["raw"], "tool_response": {"isAsync": True, "status": "async_launched"}})
    story.hook("s-1", launched)
    story.run_listeners()
    expect_marks_text(story, "Started journal-researcher . haiku: Read the cart")
    story.expect_text("chat-mark show 1", "state: shown")


def test_a_change_to_a_finished_dispatch_leaves_its_ended_mark_alone(researcher_dispatched):
    story, sample = researcher_dispatched
    story.hook("s-1", sample.with_fields(event="post_tool_use"))
    story.run_listeners()
    events = [event for event in story.container.get(EventLog).events_past(0) if event.event.startswith("helper_job")]
    story.container.get(HelperJobMarkListener).handle(Created(story.container.get(Queries).query(HelperJob).find(events[-1].row_id)), events[-1])
    story.expect_text("chat-mark show 1", "state: ended")


def test_a_dispatch_mark_opens_its_helper_once_that_has_started(researcher_dispatched):
    story, sample = researcher_dispatched
    story.expect_absent("chat-mark show 1", "target_model: agents")
    helper = story.new_row_id(f"agent start s-sub claude helper --parent {story.agent.id} --environment main")
    story.container.get(Bus).run(BindSubagentDispatch(story.agent.id, "journal-researcher", helper), story.agent, environment_id=1)
    story.run_listeners()
    story.expect_text("chat-mark show 1", "target_model: agents", f"target_id: {helper}")
    story.hook("s-1", sample.with_fields(event="post_tool_use"))
    story.run_listeners()
    story.expect_text("chat-mark show 1", "state: ended", "target_model: agents", f"target_id: {helper}")


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
