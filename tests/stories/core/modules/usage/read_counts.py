import json

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.database.actor_table import ActorTable
from core.base.database.database import Database
from core.base.repository.repository import Repository
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.modules.usage.usage import HELPER_START
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.core.support.fixtures import CheckpointPlan
from tests.stories.support.story_checks import expect_visited_limit

READ_STARTS = ("SELECT", "WITH")
READS_ALLOWED = 7
OUTLINE_READS_ALLOWED = 4
TIMELINE_READS_ALLOWED = 2
INSPECT_READS_ALLOWED = 3


def read_selects(story, line: str) -> list[str]:
    story.container.get(ActorTable).row_owner(story.agent.id)
    connection = story.container.get(Database).connection
    statements: list[str] = []
    connection.set_trace_callback(statements.append)
    story.run(line, actor=story.agent)
    connection.set_trace_callback(None)
    return [statement for statement in statements if statement.lstrip().upper().startswith(READ_STARTS)]


def rows_loaded(story, line: str) -> int:
    story.container.get(ActorTable).row_owner(story.agent.id)
    database_counts = story.container.get(Database).repeated_work
    previous_count = database_counts.rows
    story.run(line, actor=story.agent)
    return database_counts.rows - previous_count


def test_the_nudge_list_loads_one_row_for_each_nudge_however_often_it_was_said(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    previous_count = rows_loaded(story, "nudge list --json")
    repository, context = story.container.get(Repository), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        for number in range(6):
            repository.save(NudgeRecord(session_agent_id=story.agent.id, creator_id=story.agent.id, key="samples.said", text=f"said {number}", delivery_count=1, last_delivered_at=story.clock.timestamp()), context)
    expect_rows_loaded(story, "nudge list --json", previous_count + 1)


def test_the_plan_outline_reads_its_tasks_with_their_titles_and_workers_from_one_view(new_story):
    story = new_story(fixture=CheckpointPlan)
    reads = read_selects(story, "plan outline 1 --json")
    expect_visited_limit(reads, OUTLINE_READS_ALLOWED)
    expect_absent_startswith_statement_reads("SELECT * FROM tasks WHERE id IN", reads)


def test_the_plan_timeline_reads_one_page_of_events_from_one_view(new_story):
    story = new_story(fixture=CheckpointPlan)
    reads = read_selects(story, "plan timeline 1 --json")
    expect_visited_limit(reads, TIMELINE_READS_ALLOWED)
    expect_total_minimum(story, "plan timeline 1 --json", 1)


def test_the_plan_timeline_pages_its_events_fifty_to_a_page(new_story):
    story = new_story(fixture=CheckpointPlan)
    for number in range(60):
        story.run(f'task log 1 "line {number}"', actor=story.agent)
    first = json.loads(story.run("plan timeline 1 --json", actor=story.agent).output_text)
    second = json.loads(story.run("plan timeline 1 --page 2 --json", actor=story.agent).output_text)
    expect_events_total(first, 61, second, 1, (50, True, True))


def test_the_task_inspection_reads_the_task_and_one_view_row_for_its_waits_logs_and_openers(new_story):
    story = new_story(fixture=CheckpointPlan)
    reads = read_selects(story, "task inspect 1 --json")
    expect_visited_limit(reads, INSPECT_READS_ALLOWED)


def test_the_agents_window_reads_the_same_number_of_queries_for_one_agent_and_for_five(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    first_run = read_selects(story, "usage agents --environment main --json")
    for number in range(2, 6):
        story.run(HELPER_START.format(parent=story.agent.id).replace("s-2", f"s-{number + 1}"), actor=story.agent)
    five = read_selects(story, "usage agents --environment main --json")
    expect_visited_limit(five, len(first_run))
    expect_visited_limit(first_run, READS_ALLOWED)


def test_usage_show_reads_pending_worker_reviews_once_for_several_workers(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    for number in range(2, 6):
        story.expect_success(f"agent start s-{number} claude worker --environment main", actor=story.agent)
    reads = read_selects(story, "usage show --environment main --json")
    story.expect_rows(sum("FROM worker_work_reviews" in statement for statement in reads) <= 1)
    result = story.run("usage show --environment main --json", actor=story.agent)
    story.expect_rows(result.code == 0, len(json.loads(result.output_text)["agents"]) == 5)


def expect_rows_loaded(story, line: str, expected) -> None:
    actual = rows_loaded(story, line)
    assert actual == expected, actual


def expect_events_total(first, number, second, number_2, expected) -> None:
    actual = (len(first['events']), first['total'] >= number, len(second['events']) >= number_2)
    assert actual == expected, actual


def expect_total_minimum(story, text, expected) -> None:
    actual = json.loads(story.run(text, actor=story.agent).output_text)['total']
    assert actual >= expected, actual


def expect_absent_startswith_statement_reads(text, reads) -> None:
    actual = any((statement.startswith(text) for statement in reads))
    assert not actual, actual
