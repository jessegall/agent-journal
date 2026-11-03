from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_the_process_queue_runs_live_in_the_viewer_with_saved_controls_and_inline_output(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start browser-worker claude worker --environment main"), ActorType.AGENT)
    task_id = story.new_row_id('task make "Build the package" --brief "Build and check the package" --environment main', actor=story.user)
    story.expect_success(f"task start {task_id}", actor=story.agent)
    finished = start_process(story, "make previous", category=CommandCategory.BUILD, is_queued=True)
    end_run(story, finished, "package built\n")
    start_process(story, "make package", category=CommandCategory.BUILD, is_queued=True)
    start_process(story, "make checks", category=CommandCategory.CHECK, is_queued=True)
    story.run_listeners()
    with server_story(story) as server:
        expect_browser(server, "processQueue.browser.mjs", ["/tmp/journal-worker-464-process-queue.png"])
