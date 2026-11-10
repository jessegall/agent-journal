import pytest

from engine.change.event_log import EventLog
from engine.change.touched import Touched
from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.sequences.listeners.sequence_end_listener import SequenceEndListener
from core.modules.sequences.listeners.sequence_row_trigger_listener import SequenceRowTriggerListener
from tests.stories.core.modules.sequences.plan_sequence import StandardSequences
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value


@pytest.mark.parametrize("name,matched_events,unmatched_events", [
    ("documents.reply-links", ["message.create"],
     ("message.update", "task.update", "doc.create", "agent.create", "proof.queue")),
    ("workers.tests", ("proof.queue", "proof.run", "process.finish", "affected_test.create", "affected_test.update"),
     ("proof.check", "task.start", "affected_test.delete")),
])
def test_the_registry_names_only_the_events_the_listener_handles(new_story, name, matched_events, unmatched_events):
    story = new_story(fixture=UserBuilder)
    entry = next(listener for listener in story.container.get(Registry).listeners if listener.name == name)
    expect_value(all(entry.event.matches(event) for event in matched_events), True)
    expect_value(any(entry.event.matches(event) for event in unmatched_events), False)


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
