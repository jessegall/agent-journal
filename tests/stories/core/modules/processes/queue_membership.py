from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.process_queue_read import queue_page
from tests.stories.core.modules.processes.support.process_samples import end_run, start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value


class QueuedWorker(StoryFixture):
    """One run takes the only spot, no reader is asked for, and a worker is the agent that runs commands."""

    parent = UserBuilder

    def steps(self, story) -> None:
        story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
        story.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main", actor=story.user)
        story.expect_success("setting set journal.core.processes.readers-forced false --environment main", actor=story.user)
        story.agent = Actor(story.new_row_id("agent start queued-tester claude worker --environment main"), ActorType.AGENT)


def test_finished_reads_and_searches_of_any_agent_stay_out_of_the_queue(new_story):
    story = new_story(fixture=UserBuilder)
    for role in ("main", "worker"):
        if role == "worker":
            story.agent = Actor(story.new_row_id("agent start queue-reader claude worker --environment main"), ActorType.AGENT)
        for category in (CommandCategory.READ, CommandCategory.SEARCH):
            process = start_process(story, "rg cart src", category=category)
            end_run(story, process, "cart.py\n")
            page = queue_page(story)
            expect_value(page["running"], [])
            expect_value(page["waiting"], [])
            expect_value(page["recent"], [])
            expect_value(page["recent_total"], 0)


def test_a_queued_test_moves_from_waiting_to_running_to_recent_even_after_newer_reads(new_story):
    story = new_story(fixture=QueuedWorker)
    first = start_process(story, "pytest first.py", category=CommandCategory.TEST_RUN)
    second = start_process(story, "pytest second.py", category=CommandCategory.TEST_RUN)
    story.expect_text("usage bars --environment main --json", '"processes": 2', actor=story.user)
    page = queue_page(story)
    expect_value([row["id"] for row in page["running"]], [first.id])
    expect_value([row["id"] for row in page["waiting"]], [second.id])
    end_run(story, first, "passed\n")
    page = queue_page(story)
    expect_value([row["id"] for row in page["running"]], [second.id])
    expect_value([row["id"] for row in page["recent"]], [first.id])
    for number in range(3):
        read = start_process(story, f"cat file-{number}.py", category=CommandCategory.READ)
        end_run(story, read, "cart\n")
    page = queue_page(story, "--recent 1")
    expect_value([row["id"] for row in page["recent"]], [first.id])
    expect_value(page["recent_total"], 1)


def test_main_agent_tests_and_builds_remain_visible(new_story):
    story = new_story(fixture=UserBuilder)
    for category in (CommandCategory.TEST_RUN, CommandCategory.BUILD):
        process = start_process(story, "make cart && cd .", category=category)
        expect_value(process.is_queue_run, False)
        page = queue_page(story)
        expect_value([row["id"] for row in page["running"]], [process.id])
        story.expect_success(f"process part-end {process.id} --position 2 --exit-code 0", actor=story.agent)
        end_run(story, process, "passed\n")
        expect_value(queue_page(story)["recent"][0]["id"], process.id)


def test_the_bar_counts_only_the_runs_the_queue_holds(new_story):
    story = new_story(fixture=QueuedWorker)
    start_process(story, "journal task list", category=CommandCategory.JOURNAL)
    start_process(story, "rg cart src", category=CommandCategory.SEARCH)
    story.expect_text("usage bars --environment main --json", '"processes": 0', actor=story.user)
    first = start_process(story, "pytest first.py", category=CommandCategory.TEST_RUN)
    start_process(story, "pytest second.py", category=CommandCategory.TEST_RUN)
    story.expect_text("usage bars --environment main --json", '"processes": 2', actor=story.user)
    expect_value(queue_page(story)["total"], 2)
    end_run(story, first, "passed\n")
    story.expect_text("usage bars --environment main --json", '"processes": 1', actor=story.user)
    expect_value(queue_page(story)["total"], 1)
