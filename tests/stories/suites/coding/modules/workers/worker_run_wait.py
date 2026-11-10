import subprocess

import pytest

from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import QUEUE_WAIT_VARIABLE, COUNTED_QUEUE_VARIABLE
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_WAIT
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from tests.stories.core.support.coding_fixtures import BuilderHelper, OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.phase_steps import dispatched_story_worker
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data
from tests.stories.support.story_checks import expect_value, expect_value_with, expect_value_without

REAL_START_WAITED = WorkerTestLaunch.start_waited
DISPATCH = "worker dispatch --model sonnet 1 --test-command python=pytest"
TEST_RUN = "worker test python tests/cart.py"
BUILD_LINE = "make build"
BUILD_SHELL = HookSamples.shell(BUILD_LINE, ShellPart("make", CommandCategory.BUILD, ["build"]))
SEARCH_SHELL = HookSamples.shell("grep -r cart src", ShellPart("grep", CommandCategory.SEARCH, ["-r", "cart", "src"]))
OUTPUT_NUMBER_LINE = "go on with task 1, you hear when it ends"
SECONDS_SET = f"setting set {WORKER_RUN_WAIT} {{seconds}} --environment main"
LONG_OUTPUT = "".join(f"line {number}\n" for number in range(1, 301))
PIPED_TEST = HookSamples.shell("journal worker test python tests/cart.py && tail -2",
                               ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", "python", "tests/cart.py"], subcommand="worker", pipe_target=1),
                               ShellPart("tail", CommandCategory.SEARCH, ["-2"]))


@pytest.fixture
def worker(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    return dispatched_story_worker(story, DISPATCH, monkeypatch)


@pytest.fixture
def launches(worker, monkeypatch):
    """What the real launch of a worker's named test would start."""
    starts = []
    monkeypatch.setattr(WorkerTestLaunch, "start_waited", REAL_START_WAITED)
    monkeypatch.setattr(RunnerBinary, "is_installed", lambda _runner: True)
    monkeypatch.setattr(subprocess, "Popen", lambda command, **options: starts.append(command))
    return starts


def set_seconds(story, seconds) -> None:
    story.expect_success(SECONDS_SET.format(seconds=seconds), actor=story.user)


def worker_command(worker, sample=BUILD_SHELL) -> str:
    return dict(worker.story.hook(worker.session, sample).updated_input)["command"]


def newest_run(story) -> Process:
    return story.container.get(Queries).query(Process).newest().first()


def end_run_during_wait(story, text: str, exit_code: int = 0, after_sleeps: int = 1) -> None:
    def ended() -> None:
        process = newest_run(story)
        folder = story.container.get(OutputFolder)
        folder.write_output(process.id, 1, text)
        folder.write_end(process.id, exit_code)
    story.clock.call_after_sleeps(after_sleeps, ended)


def test_a_build_that_went_long_before_still_holds_a_workers_call(worker):
    first = worker_command(worker)
    worker.story.expect_success(f"process background {newest_run(worker.story).id}", actor=worker.worker)
    expect_value_with(first, "--limit 60 ")
    expect_value_without(worker_command(worker), "--background")


def test_a_negative_wait_is_refused(worker):
    worker.story.expect_refusal(SECONDS_SET.format(seconds=-1), "at least 0", actor=worker.story.user)


def test_a_named_test_past_the_wait_asks_its_run_to_go_to_the_background(worker):
    worker.story.run(TEST_RUN, actor=worker.worker)
    expect_value(worker.story.container.get(OutputFolder).has_move_request(newest_run(worker.story).id), True)


def test_a_named_test_that_ends_in_time_is_not_asked_to_move(worker):
    end_run_during_wait(worker.story, "ok\n")
    worker.story.run(TEST_RUN, actor=worker.worker)
    expect_value(worker.story.container.get(OutputFolder).has_move_request(newest_run(worker.story).id), False)


def test_a_changed_setting_changes_how_long_a_named_test_holds(worker):
    set_seconds(worker.story, 5)
    start_seconds = worker.story.clock.slept_seconds
    worker.story.run(TEST_RUN, actor=worker.worker)
    expect_value(worker.story.clock.slept_seconds - start_seconds, 5)


def test_a_named_test_launches_held_with_the_settings_queue_wait(worker, launches):
    worker.story.run(TEST_RUN, actor=worker.worker)
    worker.story.run_listeners()
    expect_value_with(launches[0], f"{QUEUE_WAIT_VARIABLE}=60")
    expect_value_without(launches[0], "--background")


def test_the_commands_card_in_the_workers_chat_shows_what_its_named_test_printed(worker):
    line = f"journal {TEST_RUN}"
    reply = worker.run_line(line, ShellPart("journal", CommandCategory.JOURNAL, TEST_RUN.split(), subcommand="worker"))
    process = worker.story.container.get(Queries).query(Process).filter(line=line).first()
    worker.story.container.get(OutputFolder).write_output(process.id, 1, "10 passed\n")
    with server_story(worker.story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        key = f"terminal-output.{reply.hook_call_id}"
        status, output = window_data(server, cookie, keys=key, window="agents.agents")
        worker.story.expect_rows(status == 200, output["keys"][key]["value"]["lines"] == ["10 passed"], detail=str(output["keys"][key]))


def test_a_named_test_with_a_pipe_gets_the_whole_output_for_the_pipe_and_the_output_number(worker):
    worker.story.hook(worker.session, PIPED_TEST)
    shell_process = newest_run(worker.story)
    end_run_during_wait(worker.story, LONG_OUTPUT)
    text = worker.story.run(TEST_RUN, actor=worker.worker, process_id=shell_process.id).output_text
    expect_value_with(text, "line 1\n")
    expect_value_with(text, "line 300")
    expect_value_with(text, f"full output saved as output {newest_run(worker.story).id}")
