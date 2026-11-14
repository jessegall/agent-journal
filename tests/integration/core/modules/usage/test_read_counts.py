import json

import pytest

from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.messages.commands.read_message.read_message import ReadMessage
from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.actor_table import ActorTable
from engine.repository.repository import Repository
from tests.integration.support.fixture_journal import FixtureJournal
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.core.support.fixtures import CheckpointPlan

READ_STARTS = ("SELECT", "WITH")
TIMELINE_READS_ALLOWED = 2
INSPECT_READS_ALLOWED = 3


@pytest.fixture
def started_task(played) -> FixtureJournal:
    return played(StartedTaskBuilder)


@pytest.fixture
def checkpoint_plan(played) -> FixtureJournal:
    return played(CheckpointPlan)


def read_selects(played: FixtureJournal, line: str) -> list[str]:
    played.container.get(ActorTable).row_owner(played.agent.id)
    connection = played.journal.database.connection
    statements: list[str] = []
    connection.set_trace_callback(statements.append)
    played.run(line, actor=played.agent)
    connection.set_trace_callback(None)
    return [statement for statement in statements if statement.lstrip().upper().startswith(READ_STARTS)]


def rows_loaded(played: FixtureJournal, line: str) -> int:
    played.container.get(ActorTable).row_owner(played.agent.id)
    counts = played.journal.database.repeated_work
    previous_count = counts.rows
    played.run(line, actor=played.agent)
    return counts.rows - previous_count


def test_the_nudge_list_loads_one_row_for_each_nudge_however_often_it_was_said(started_task):
    previous_count = rows_loaded(started_task, "nudge list --json")
    repository, context = started_task.container.get(Repository), Context(Actor.core(), started_task.clock.timestamp(), ReadMessage(1))
    with started_task.journal.database.transaction():
        for number in range(6):
            repository.save(NudgeRecord(session_agent_id=started_task.agent.id, creator_id=started_task.agent.id, key="samples.said", text=f"said {number}",
                                        delivery_count=1, last_delivered_at=started_task.clock.timestamp()), context)
    assert rows_loaded(started_task, "nudge list --json") == previous_count + 1


def test_the_plan_timeline_reads_one_page_of_events_from_one_view(checkpoint_plan):
    assert len(read_selects(checkpoint_plan, "plan timeline 1 --json")) <= TIMELINE_READS_ALLOWED
    assert json.loads(checkpoint_plan.run("plan timeline 1 --json", actor=checkpoint_plan.agent).output_text)["total"] >= 1


def test_the_plan_timeline_pages_its_events_fifty_to_a_page(checkpoint_plan):
    for number in range(60):
        checkpoint_plan.run(f'task log 1 "line {number}"', actor=checkpoint_plan.agent)
    first = json.loads(checkpoint_plan.run("plan timeline 1 --json", actor=checkpoint_plan.agent).output_text)
    second = json.loads(checkpoint_plan.run("plan timeline 1 --page 2 --json", actor=checkpoint_plan.agent).output_text)
    assert (len(first["events"]), first["total"] >= 61, len(second["events"]) >= 1) == (50, True, True)


def test_the_task_inspection_reads_the_task_and_one_view_row_for_its_waits_logs_and_openers(checkpoint_plan):
    assert len(read_selects(checkpoint_plan, "task inspect 1 --json")) <= INSPECT_READS_ALLOWED


def test_usage_show_reads_pending_worker_reviews_once_for_several_workers(started_task):
    for number in range(2, 6):
        started_task.expect_success(f"agent start s-{number} claude worker --environment main", actor=started_task.agent)
    reads = read_selects(started_task, "usage show --environment main --json")
    assert sum("FROM worker_work_reviews" in statement for statement in reads) <= 1
    outcome = started_task.run("usage show --environment main --json", actor=started_task.agent)
    assert outcome.code == 0 and len(json.loads(outcome.output_text)["agents"]) == 5
