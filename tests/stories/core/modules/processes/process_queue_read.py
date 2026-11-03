import json

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderWithUser


def queue_page(story, flags=""):
    return json.loads(story.run(f"queue list --environment-id 1 --json {flags}", actor=story.user).output_text)


def test_the_process_queue_lists_worker_commands_waiting_and_running_and_uses_an_edited_limit(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.expect_success("setting set journal.core.processes.readers-forced false --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start queue-worker claude worker --environment main"), ActorType.AGENT)
    first = start_process(story, "make package", category=CommandCategory.BUILD, is_queued=True)
    second = start_process(story, "python check_cart.py", category=CommandCategory.CHECK, is_queued=True)
    start_process(story, "ls cart", category=CommandCategory.READ)
    page = queue_page(story)
    story.expect_rows(page["parallel_limit"] == 1, page["total"] == 2,
                      page["used_slots"] == 1, page["waiting_count"] == 1,
                      [row["id"] for row in page["running"]] == [first.id],
                      [row["id"] for row in page["waiting"]] == [second.id],
                      [row["id"] for row in page["rows"]] == [first.id, second.id],
                      [row["is_queued"] for row in page["rows"]] == [False, True],
                      [row["category"] for row in page["rows"]] == [CommandCategory.BUILD.value, CommandCategory.CHECK.value],
                      all(row["worker_id"] == story.agent.id and row["output_id"] == row["id"] for row in page["rows"]),
                      page["rows"][1]["line"] == "python check_cart.py")
    story.expect_success(f"setting set {page['limit_setting']} 2 --environment main", actor=story.user)
    third = start_process(story, "make site", category=CommandCategory.BUILD, is_queued=True)
    page = queue_page(story)
    story.expect_rows(page["parallel_limit"] == 2,
                      [row["is_queued"] for row in page["rows"]] == [False, False, True])
    end_run(story, first, "built\n")
    page = queue_page(story)
    story.expect_rows([row["id"] for row in page["rows"]] == [second.id, third.id],
                      all(not row["is_queued"] for row in page["rows"]))
    limited = queue_page(story, "--limit 1 --page 2")
    story.expect_rows(limited["total"] == 2, limited["page"] == 2, limited["size"] == 1,
                      [row["id"] for row in limited["rows"]] == [third.id])
    story.expect_success(f"output peek {third.id} --all", actor=story.user)


def test_the_inspector_lists_every_waiting_command_beyond_the_default_page(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success("setting set journal.core.processes.run-batch-size 0 --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start long-queue-worker claude worker --environment main"), ActorType.AGENT)
    processes = [start_process(story, f"make package-{number}", category=CommandCategory.BUILD, is_queued=True) for number in range(51)]
    page = queue_page(story)
    story.expect_rows(len(page["rows"]) == 50, page["waiting_count"] == 51,
                      [row["id"] for row in page["waiting"]] == [process.id for process in processes])
