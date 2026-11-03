import json

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.repository.repository import Repository
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.modules.usage.usage import HELPER_START
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask
from tests.stories.core.support.fixtures import PlanWithCheckpoint

READ_STARTS = ("SELECT", "WITH")
READS_ALLOWED = 6
OUTLINE_READS_ALLOWED = 4
TIMELINE_READS_ALLOWED = 2
INSPECT_READS_ALLOWED = 2


def selects_of(story, line: str) -> list[str]:
    connection = story.container.get(Database).connection
    seen: list[str] = []
    connection.set_trace_callback(seen.append)
    story.run(line, actor=story.agent)
    connection.set_trace_callback(None)
    return [statement for statement in seen if statement.lstrip().upper().startswith(READ_STARTS)]


def rows_loaded(story, line: str) -> int:
    tally = story.container.get(Database).tally
    before = tally.rows
    story.run(line, actor=story.agent)
    return tally.rows - before


def test_the_nudge_list_loads_one_row_for_each_nudge_however_often_it_was_said(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    before = rows_loaded(story, "nudge list --json")
    repository, context = story.container.get(Repository), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        for number in range(6):
            repository.save(NudgeRecord(agent_id=story.agent.id, creator_id=story.agent.id, key="samples.said", text=f"said {number}", delivery_count=1, last_delivered_at=story.clock.timestamp()), context)
    assert rows_loaded(story, "nudge list --json") == before + 1


def test_the_plan_outline_reads_its_tasks_with_their_titles_and_workers_from_one_view(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    reads = selects_of(story, "plan outline 1 --json")
    assert len(reads) <= OUTLINE_READS_ALLOWED and not any(statement.startswith("SELECT * FROM tasks WHERE id IN") for statement in reads), len(reads)


def test_the_plan_timeline_reads_one_page_of_events_from_one_view(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    reads = selects_of(story, "plan timeline 1 --json")
    assert len(reads) <= TIMELINE_READS_ALLOWED, len(reads)
    assert json.loads(story.run("plan timeline 1 --json", actor=story.agent).output_text)["total"] >= 1


def test_the_plan_timeline_pages_its_events_fifty_to_a_page(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    for number in range(60):
        story.run(f'task log 1 "line {number}"', actor=story.agent)
    first = json.loads(story.run("plan timeline 1 --json", actor=story.agent).output_text)
    second = json.loads(story.run("plan timeline 1 --page 2 --json", actor=story.agent).output_text)
    assert (len(first["events"]), first["total"] >= 61, len(second["events"]) >= 1) == (50, True, True)


def test_the_task_inspection_reads_the_task_and_one_view_row_for_its_waits_logs_and_openers(new_story):
    story = new_story(fixture=PlanWithCheckpoint)
    reads = selects_of(story, "task inspect 1 --json")
    assert len(reads) <= INSPECT_READS_ALLOWED, len(reads)


def test_the_agents_window_reads_the_same_number_of_queries_for_one_agent_and_for_five(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    one = selects_of(story, "usage agents --environment main --json")
    for number in range(2, 6):
        story.run(HELPER_START.format(parent=story.agent.id).replace("s-2", f"s-{number + 1}"), actor=story.agent)
    five = selects_of(story, "usage agents --environment main --json")
    assert len(five) == len(one) and len(one) <= READS_ALLOWED, (len(one), len(five))
