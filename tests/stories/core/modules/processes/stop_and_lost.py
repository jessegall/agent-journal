import pytest

from core.base.leftover_process import LeftoverProcess
import subprocess
import select
from datetime import timedelta

from tests.stories.core.modules.processes.background import NOTHING
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run, start_process
from core.base.command.bus import Bus
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.run_end_recovery import RunEndRecovery
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_handler, expect_poll_second, expect_value_4

GROUP_END_SECONDS = 5

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
        group.wait(timeout=GROUP_END_SECONDS)
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
    story.expect_hook_allowed("s-1", NOTHING, ORPHAN_LINE)


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


def test_a_run_ended_lost_has_what_is_left_of_its_group_killed(orphaned_process_group):
    group = orphaned_process_group
    group.wait(timeout=GROUP_END_SECONDS)


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


def test_a_pid_gone_to_another_program_is_not_killed(reused_process_pid):
    story, second = reused_process_pid
    story.expect_success('process show 1', 'state: orphaned', actor=story.agent)
    story.run_listeners()
    expect_poll_second(second, None)


def test_a_run_that_ended_unseen_frees_its_spot_with_no_tick_of_its_agent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "make build")
    ended_program = subprocess.Popen(["true"])
    ended_program.wait()
    folder = story.container.get(OutputFolder)
    folder.write_pid(process.id, ended_program.pid)
    folder.write_output(process.id, 1, "done\n")
    folder.write_status(process.id, 1, 0)
    folder.write_end(process.id, 0)
    story.advance(timedelta(seconds=11))
    expect_end_recovery(story, True)
    story.expect_success("process show 1", "state: finished", "exit_code: 0", actor=story.agent)
    story.expect_text("process-part list --process 1", "finished")


def test_a_run_whose_runner_is_alive_is_left_to_report_its_own_end(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "make build")
    second = subprocess.Popen(["sleep", "60"], start_new_session=True)
    try:
        folder = story.container.get(OutputFolder)
        folder.write_pid(process.id, second.pid)
        folder.write_end(process.id, 0)
        RunEndRecovery()(story.container)
        story.expect_absent("process show 1", "state: finished", actor=story.agent)
    finally:
        second.kill()
        second.wait()


def test_a_run_whose_runner_died_with_no_end_is_lost_with_no_tick_of_its_agent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    ended_program = subprocess.Popen(["true"])
    ended_program.wait()
    folder = story.container.get(OutputFolder)
    folder.write_pid(process.id, ended_program.pid)
    folder.beat(process.id, story.clock.timestamp())
    RunEndRecovery()(story.container)
    story.expect_success("process show 1", "state: background", actor=story.agent)
    story.advance(timedelta(seconds=11))
    RunEndRecovery()(story.container)
    story.expect_success("process show 1", "state: orphaned", actor=story.agent)




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


def test_a_lost_run_whose_leader_died_still_has_its_children_killed(orphaned_process_child):
    child_pid, child_output = orphaned_process_child
    readable, _, _ = select.select([child_output], [], [], GROUP_END_SECONDS)
    expect_value_4(readable)
    expect_absent_child_output(child_output)
    expect_absent_command_leftover_process(child_pid)


@pytest.fixture
def background_build(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make build")
    return story, process


@pytest.fixture
def orphaned_process_group(background_build):
    story, process = background_build
    group = subprocess.Popen(['sh', '-c', 'sleep 60; true', 'journal-run', f'processes/{process.id}/run.sh'], start_new_session=True)
    try:
        folder = story.container.get(OutputFolder)
        folder.write_pid(process.id, group.pid)
        folder.beat(process.id, story.clock.timestamp())
        story.advance(timedelta(seconds=100))
        story.tick('s-1')
        story.run_listeners()
        yield group
    finally:
        group.kill()
        group.wait()


@pytest.fixture
def reused_process_pid(background_build):
    story, process = background_build
    second = subprocess.Popen(['sleep', '60'], start_new_session=True)
    try:
        folder = story.container.get(OutputFolder)
        folder.write_pid(process.id, second.pid)
        folder.beat(process.id, story.clock.timestamp())
        story.advance(timedelta(seconds=100))
        story.tick('s-1')
        story.run_listeners()
        yield story, second
    finally:
        second.kill()
        second.wait()


@pytest.fixture
def orphaned_process_child(background_build):
    story, process = background_build
    leader = subprocess.Popen(['sh', '-c', 'sleep 60 & echo $!; exit 0'], stdout=subprocess.PIPE, text=True, start_new_session=True)
    child_pid = int(leader.stdout.readline())
    leader.wait()
    try:
        folder = story.container.get(OutputFolder)
        folder.write_pid(process.id, leader.pid)
        folder.beat(process.id, story.clock.timestamp())
        story.advance(timedelta(seconds=100))
        story.tick('s-1')
        story.run_listeners()
        yield child_pid, leader.stdout
    finally:
        subprocess.run(['kill', '-9', str(child_pid)], capture_output=True, check=False)
        leader.stdout.close()


def test_a_run_no_runner_ever_started_is_lost_past_the_limit_with_no_tick_of_its_agent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    start_process(story, "make build")
    expect_end_recovery(story, False)
    story.advance(timedelta(seconds=120))
    expect_end_recovery(story, True)
    story.expect_success("process show 1", "state: orphaned", actor=story.agent)


def test_a_run_the_runner_reported_first_is_passed_over_and_the_others_still_end(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    reported = start_process(story, "make build")
    second = start_process(story, "make docs")
    ended_program = subprocess.Popen(["true"])
    ended_program.wait()
    folder = story.container.get(OutputFolder)
    for process in (reported, second):
        folder.write_pid(process.id, ended_program.pid)
        folder.write_end(process.id, 0)
    story.advance(timedelta(seconds=11))
    handler = RunEndRecovery()
    original = handler.commands

    def stale_commands(container, process):
        commands = original(container, process)
        if process.id == reported.id:
            story.container.get(Bus).run(EndProcess(process.id, 0, 0, 0), story.agent, environment_id=1)
        return commands

    handler.commands = stale_commands
    expect_handler(handler, story, True)
    story.expect_success(f"process show {second.id}", "state: finished", actor=story.agent)


def expect_end_recovery(story, expected) -> None:
    actual = RunEndRecovery()(story.container)
    assert actual is expected, actual


def expect_absent_command_leftover_process(child_pid) -> None:
    actual = LeftoverProcess.command_line(child_pid)
    assert not actual, actual


def expect_absent_child_output(child_output) -> None:
    actual = child_output.read()
    assert not actual, actual
