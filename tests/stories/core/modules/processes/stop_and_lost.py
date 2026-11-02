from core.base.leftover_process import LeftoverProcess
import subprocess
import time
from datetime import timedelta

from tests.stories.core.modules.processes.background import NOTHING
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run, start_process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.support.coding_fixtures import BuilderStarted

ORPHAN_LINE = "process 1 was lost: its shell is gone"


def test_a_stop_kills_the_group_of_the_runner_and_ends_a_wait_on_the_process(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "sleep 60")
    group = subprocess.Popen(["sh", "-c", "sleep 60; true", "journal-run", f"processes/{process.id}/run.sh"], start_new_session=True)
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
    assert any(ORPHAN_LINE in line for line in story.hook("s-1", NOTHING).lines)


def test_a_run_whose_runner_pid_is_gone_is_lost_at_the_next_tick_after_ten_seconds(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    ended_program = subprocess.Popen(["true"])
    ended_program.wait()
    story.container.get(OutputFolder).write_pid(process.id, ended_program.pid)
    story.container.get(OutputFolder).beat(process.id, story.clock.timestamp())
    story.advance(timedelta(seconds=5))
    story.tick("s-1")
    story.expect_success("process show 1", "state: background", actor=story.agent)
    story.advance(timedelta(seconds=6))
    story.tick("s-1")
    story.expect_success("process show 1", "state: orphaned", actor=story.agent)


def test_a_run_ended_lost_has_what_is_left_of_its_group_killed(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    group = subprocess.Popen(["sh", "-c", "sleep 60; true", "journal-run", f"processes/{process.id}/run.sh"], start_new_session=True)
    try:
        folder = story.container.get(OutputFolder)
        folder.write_pid(process.id, group.pid)
        folder.beat(process.id, story.clock.timestamp())
        story.advance(timedelta(seconds=100))
        story.tick("s-1")
        deadline = time.monotonic() + 5
        while group.poll() is None and time.monotonic() < deadline:
            time.sleep(0.05)
        assert group.poll() is not None, "the group of the lost run is still alive"
    finally:
        group.kill()
        group.wait()


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


def test_a_pid_gone_to_another_program_is_not_killed(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    second = subprocess.Popen(["sleep", "60"], start_new_session=True)
    try:
        folder = story.container.get(OutputFolder)
        folder.write_pid(process.id, second.pid)
        folder.beat(process.id, story.clock.timestamp())
        story.advance(timedelta(seconds=100))
        story.tick("s-1")
        story.expect_success("process show 1", "state: orphaned", actor=story.agent)
        time.sleep(0.2)
        assert second.poll() is None, "another program with the pid was killed"
    finally:
        second.kill()
        second.wait()


def test_the_first_tick_after_a_machine_slept_ends_nothing_lost(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    folder = story.container.get(OutputFolder)
    folder.beat(process.id, story.clock.timestamp())
    story.tick("s-1")
    story.advance(timedelta(seconds=600))
    story.tick("s-1")
    story.expect_success("process show 1", "state: background", actor=story.agent)
    story.advance(timedelta(seconds=60))
    story.tick("s-1")
    story.expect_success("process show 1", "state: orphaned", actor=story.agent)


def test_a_lost_run_whose_leader_died_still_has_its_children_killed(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    leader = subprocess.Popen(["sh", "-c", "sleep 60 & echo $!; exit 0"], stdout=subprocess.PIPE, text=True, start_new_session=True)
    child_pid = int(leader.stdout.readline())
    leader.wait()
    leader.stdout.close()
    try:
        folder = story.container.get(OutputFolder)
        folder.write_pid(process.id, leader.pid)
        folder.beat(process.id, story.clock.timestamp())
        story.advance(timedelta(seconds=100))
        story.tick("s-1")
        deadline = time.monotonic() + 5
        while LeftoverProcess.command_line(child_pid) and time.monotonic() < deadline:
            time.sleep(0.05)
        assert not LeftoverProcess.command_line(child_pid), "the child of the dead leader is still alive"
    finally:
        subprocess.run(["kill", "-9", str(child_pid)], capture_output=True, check=False)
