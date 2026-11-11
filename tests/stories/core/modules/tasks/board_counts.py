import json
from datetime import timedelta

from engine.database.database import Database
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.modules.tasks.board import board_totals
from tests.stories.support.story_checks import expect_value

LEGAL_MODULE = "tests.stories.fixtures.acme_legal.module:AcmeLegalModule"


def test_the_board_counts_each_group_once_including_added_states_and_cursor_pages(new_story):
    story = new_story(LEGAL_MODULE, fixture=UserJoined)
    cancelled_before = board_totals(story)["cancelled"]
    for number in range(1, 7):
        story.expect_success(f'task make "Counted task {number}" --environment main', actor=story.user)
    story.expect_success("task hold 3", actor=story.user)
    story.expect_success('task cancel 4 --reason "finished"', actor=story.user)
    story.advance(timedelta(seconds=1))
    story.expect_success('task cancel 5 --reason "finished"', actor=story.user)

    groups, counts = counted_board(story, "--limit 1")
    expect_value(len(counts), len(groups))
    expect_value(len(set(counts)), len(groups))
    state_groups = {group["state"]: group for group in groups}
    expect_value(state_groups["open"]["total"], 3)
    expect_value([row["id"] for row in state_groups["open"]["rows"]], [6])
    expect_value(state_groups["legal-hold"]["total"], 1)
    expect_value([row["id"] for row in state_groups["legal-hold"]["rows"]], [3])
    expect_value(state_groups["cancelled"]["total"], cancelled_before + 2)
    expect_value([row["id"] for row in state_groups["cancelled"]["rows"]], [5])

    older, counts = counted_board(story, "--state open --before-id 6 --limit 1")
    expect_value(len(counts), 1)
    expect_value(older[0]["total"], 3)
    expect_value([row["id"] for row in older[0]["rows"]], [2])

    finished, counts = counted_board(story, f'--state cancelled --before-closed-at {state_groups["cancelled"]["rows"][0]["closed_at"]} --limit 1')
    expect_value(len(counts), 1)
    expect_value(finished[0]["total"], cancelled_before + 2)
    expect_value([row["id"] for row in finished[0]["rows"]], [4])


def counted_board(story, arguments):
    connection = story.container.get(Database).connection
    statements = []
    connection.set_trace_callback(statements.append)
    try:
        answer = story.run(f"task board --environment main --json {arguments}", actor=story.user)
    finally:
        connection.set_trace_callback(None)
    expect_value(answer.code, 0)
    counts = [statement for statement in statements if "count(" in statement.lower() and "FROM task_cards" in statement]
    return json.loads(answer.output_text)["groups"], counts
