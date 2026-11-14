import pytest

from engine.event.event_log import EventLog
from engine.event.touched import Touched
from engine.database.database import Database
from core.modules.sequences.listeners.sequence_end_listener import SequenceEndListener
from core.modules.sequences.listeners.sequence_row_trigger_listener import SequenceRowTriggerListener
from tests.stories.core.modules.sequences.plan_sequence import StandardSequences
from tests.stories.core.support import story_lines as lines
from tests.stories.support.story_checks import expect_value


@pytest.mark.parametrize("listener_type", [SequenceRowTriggerListener, SequenceEndListener])
def test_an_event_no_sequence_names_reads_no_sequence_or_run_rows(open_plan_sequence, listener_type):
    story = open_plan_sequence
    story.expect_success('message send "Unrelated" --environment main', actor=story.user)
    logged = story.container.get(EventLog).latest_event("message.create")
    listener = story.container.get(listener_type)
    listener.handle(Touched(), logged)
    database = story.container.get(Database)
    start = database.repeated_work.points()
    listener.handle(Touched(), logged)
    cost = database.repeated_work.points().minus(start)
    expect_value(cost.tables["sequences"], 0)
    expect_value(cost.tables["sequence_runs"], 0)


@pytest.fixture
def open_plan_sequence(new_story):
    story = new_story(fixture=StandardSequences)
    story.run(lines.NEW_PLAN, actor=story.agent)
    story.run_listeners()
    return story
