import os

from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.timestamp import Timestamp
from datetime import datetime, timezone
from core.modules.processes.support.output_folder import OutputFolder
from core.base.driver.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_the_process_queue_runs_live_in_the_viewer_with_saved_controls_and_inline_output(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success("setting set journal.core.processes.readers-forced false --environment main")
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start browser-worker claude worker --environment main"), ActorType.AGENT)
    task_id = story.new_row_id('task make "Build the package" --brief "Build and check the package" --environment main', actor=story.user)
    story.expect_success(f"task start {task_id}", actor=story.agent)
    finished = start_process(story, "make previous", category=CommandCategory.BUILD)
    end_run(story, finished, "package built\n")
    running = start_process(story, "make package", category=CommandCategory.BUILD)
    waiting = start_process(story, "make checks", category=CommandCategory.TEST_RUN)
    for process in (running, waiting):
        story.container.get(OutputFolder).beat(process.id, Timestamp(datetime.now(timezone.utc)))
    story.run_listeners()
    story.expect_text("queue list --json --environment 1", '"waiting_count": 1', '"line": "make package"')
    with server_story(story) as server:
        expect_browser(server, "processQueue.browser.mjs", ["/tmp/journal-worker-464-process-queue.png"])


def test_the_process_queue_says_in_the_viewer_that_an_update_waits_and_the_commands_keep_their_order(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success("setting set journal.core.processes.readers-forced false --environment main", actor=story.user)
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start browser-worker claude worker --environment main"), ActorType.AGENT)
    running = start_process(story, "make package", category=CommandCategory.BUILD)
    waiting = start_process(story, "make checks", category=CommandCategory.TEST_RUN)
    for process in (running, waiting):
        story.container.get(OutputFolder).beat(process.id, Timestamp(datetime.now(timezone.utc)))
    story.home.run_lock.write_text(str(os.getpid()))
    with server_story(story) as server:
        expect_browser(server, "processQueueUpdate.browser.mjs", ["/tmp/journal-worker-636-process-queue-update.png"])


def test_the_queue_reads_output_from_the_end_and_loads_earlier_pages(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    finished = start_process(story, "make long-output", category=CommandCategory.BUILD)
    end_run(story, finished, "".join(f"line {number} of the run\n" for number in range(250)))
    with server_story(story) as server:
        expect_browser(server, "processQueuePages.browser.mjs", [])
