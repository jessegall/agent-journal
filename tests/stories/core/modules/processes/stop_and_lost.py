import subprocess
import time
from datetime import timedelta

from tests.stories.core.modules.processes.background import NOTHING
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run, start_process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.support.coding_fixtures import BuilderStarted

LOST_LINE = "process 1 was lost: its shell is gone; journal output read 1 --summary"


def test_a_stop_kills_the_group_of_the_runner_and_ends_a_wait_on_the_process(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "sleep 60")
    group = subprocess.Popen(["sleep", "60"], start_new_session=True)
    try:
        story.container.get(OutputFolder).write_pid(process.id, group.pid)
        story.run("wait on 'the sleep' --target processes:1", actor=story.agent)
        story.expect_text("output stop 1", "stopped", actor=story.agent)
        story.expect_success("process show 1", "state: stopped", actor=story.agent)
        story.expect_text("wait show 1", "state: ended")
        deadline = time.monotonic() + 5
        while group.poll() is None and time.monotonic() < deadline:
            time.sleep(0.05)
        assert group.poll() is not None, "the group of the runner is still alive"
    finally:
        group.kill()
        group.wait()


def test_a_heartbeat_older_than_90_seconds_ends_the_run_lost_and_tells_the_agent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    story.container.get(OutputFolder).beat(process.id, story.clock.timestamp())
    story.advance(timedelta(seconds=60))
    story.tick("s-1")
    story.expect_success("process show 1", "state: background", actor=story.agent)
    story.advance(timedelta(seconds=40))
    story.tick("s-1")
    story.expect_success("process show 1", "state: orphaned", actor=story.agent)
    assert any(LOST_LINE in line for line in story.hook("s-1", NOTHING).lines)


def test_an_end_in_the_folder_the_server_never_heard_of_is_taken_from_the_folder(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "make build")
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, "boom\n")
    folder.write_status(process.id, 1, 3)
    folder.write_end(process.id, 3)
    story.tick("s-1")
    story.expect_success("process show 1", "state: failed", "exit_code: 3", actor=story.agent)
    story.expect_text("process-part list --process 1", "failed")
