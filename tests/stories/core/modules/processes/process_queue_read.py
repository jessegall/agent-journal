import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_total_cost_less
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from core.modules.processes.models.enums.process_setting import ProcessSetting

QUEUE_READ_POINTS = 60


def queue_page(story, flags=""):
    return json.loads(story.run(f"queue list --environment 1 --json {flags}", actor=story.user).output_text)


def test_a_queue_read_costs_the_same_with_many_ended_runs(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    for number in range(40):
        end_run(story, start_process(story, f"make old-{number}", category=CommandCategory.BUILD), "built\n")
    database = story.container.get(Database)
    start = database.repeated_work.points()
    page = queue_page(story)
    cost = database.repeated_work.points().minus(start)
    expect_running_2(page, [])
    expect_total_cost_less(cost, QUEUE_READ_POINTS)


def test_the_process_queue_lists_worker_commands_waiting_and_running_and_uses_an_edited_limit(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success(f"setting set {ProcessSetting.LANE_CAPACITY_LONG.key} 4 --environment main", actor=story.user)
    story.expect_success(f"setting set {WORKER_TEST_LIMIT} 0 --environment main", actor=story.user)
    story.expect_success(f"setting set {ProcessSetting.READERS_FORCED.key} false --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start queue-worker claude worker --environment main"), ActorType.AGENT)
    first = start_process(story, "make package", category=CommandCategory.BUILD)
    second = start_process(story, "python check_cart.py", category=CommandCategory.TEST_RUN)
    start_process(story, "ls cart", category=CommandCategory.READ)
    page = queue_page(story)
    story.expect_rows(page["parallel_limit"] == 4, page["total"] == 2,
                      page["used_slots"] == 1, page["waiting_count"] == 1,
                      [row["id"] for row in page["running"]] == [first.id],
                      [row["id"] for row in page["waiting"]] == [second.id],
                      [row["id"] for row in page["rows"]] == [first.id, second.id],
                      [row["queued_at"] is not None for row in page["rows"]] == [False, True],
                      [row["category"] for row in page["rows"]] == [CommandCategory.BUILD.value, CommandCategory.TEST_RUN.value],
                      all(row["owner_agent_id"] == story.agent.id and row["output_id"] == row["id"] for row in page["rows"]),
                      page["rows"][1]["line"] == "python check_cart.py")
    story.expect_rows([limit["title"] for limit in page["suite_limits"]] == ["Test limit per worker command"])
    story.expect_success(f"setting set {page['suite_limits'][0]['key']} 500 --environment main", actor=story.user)
    story.expect_rows(queue_page(story)["suite_limits"][0]["value"] == 500)
    story.expect_success(f"setting set {WORKER_TEST_LIMIT} 0 --environment main", actor=story.user)
    story.expect_success(f"setting set {page['limit_setting']} 8 --environment main", actor=story.user)
    third = start_process(story, "make site", category=CommandCategory.BUILD)
    page = queue_page(story)
    story.expect_rows(page["parallel_limit"] == 8,
                      [row["queued_at"] is not None for row in page["rows"]] == [False, False, True])
    end_run(story, first, "built\n")
    page = queue_page(story)
    story.expect_rows([row["id"] for row in page["rows"]] == [second.id, third.id],
                      all(row["queued_at"] is None for row in page["rows"]))
    limited = queue_page(story, "--limit 1 --page 2")
    story.expect_rows(limited["total"] == 2, limited["page"] == 2, limited["size"] == 1,
                      [row["id"] for row in limited["rows"]] == [third.id])
    story.expect_success(f"output peek {third.id} --all", actor=story.user)


def expect_running_2(page, expected) -> None:
    actual = page['running']
    assert actual == expected, actual
