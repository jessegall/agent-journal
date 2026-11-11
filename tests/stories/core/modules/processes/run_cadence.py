from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.modules.processes.support.cadence_probe import (TICK, HelperBesideWorker, agent_run, cadence_tick, expect_told, has_cadence_record,
                                                                       cadence_lines, printed, running_run, ticks, told, worker_agent)
from tests.stories.core.modules.processes.background import SavedBuildMoved, SilentVitestRun, expect_streaming_line, expect_without_hint
from tests.stories.core.modules.processes.hang_watch import ActiveBuild, expect_looks, started_tree, watch_tick
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

MAIN = "s-1"
SLOW_TESTS = "pytest tests/slow -q"


def test_a_read_command_is_not_watched(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "cat notes", category=CommandCategory.READ)
    cadence_tick(story)
    story.expect_rows(not has_cadence_record(story, process))


FIRST_OUTPUT = timedelta(seconds=30)
STOPPED_WRITING = timedelta(seconds=120)


def test_a_python_run_that_prints_nothing_for_30_seconds_is_told_it_is_not_streaming(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "python3 tools/deploy.py staging", category=CommandCategory.BUILD)
    expect_without_hint(story)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, f"output {process.id} printed nothing for 30 seconds, so its output is not streaming: it may hold its output back: print with flush=True, or run it with python3 -u")


def test_a_silent_test_gets_its_hint_once_and_again_when_it_stops_printing(new_story):
    story = new_story(fixture=SilentVitestRun)
    process = running_run(story)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, "run vitest with --reporter=verbose")
    story.advance(TICK)
    cadence_tick(story)
    expect_without_hint(story)
    printed(story, process, "first line\n")
    cadence_tick(story)
    for _ in range(STOPPED_WRITING // TICK):
        story.advance(TICK)
        cadence_tick(story)
    expect_streaming_line(story, f"output {process.id} has written nothing for 120 seconds and still runs: run vitest with --reporter=verbose")


def test_a_silent_saved_command_is_told_to_fix_its_alias(new_story):
    story = new_story(fixture=SavedBuildMoved)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, "alias build-npm printed nothing for 30 seconds: make it print each step; this run stays silent, the next shows its steps")


def titled(story, process, title: str, actor=None) -> None:
    story.expect_success(f'output title {process.id} "{title}"', actor=actor or story.agent)


def test_a_sparse_pytest_run_keeps_running_and_after_printing_often_is_told_only_once_it_stops_writing(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, SLOW_TESTS, CommandCategory.TEST_RUN)
    titled(story, process, "Running the slow tests")
    ticks(story, process, 120, every=50)
    expect_told(story, MAIN, f"output {process.id} prints about once every 50 seconds, so no reader can follow it: run pytest without -q")
    story.expect_text(f"process show {process.id}", "state: background", actor=story.agent)
    ticks(story, process, 80, every=10)
    quiet = cadence_lines(told(story, MAIN))
    ticks(story, process, 120)
    expect_told(story, MAIN, f"output {process.id} has written nothing for 120 seconds and still runs")
    story.expect_rows(quiet == [], detail="\n".join(quiet))


def test_a_read_only_helper_is_told_its_own_run_is_sparse(new_story):
    story = new_story(fixture=HelperBesideWorker)
    helper = helper_agent(story)
    process = agent_run(story, helper, "pytest tests/search -q", CommandCategory.TEST_RUN)
    titled(story, process, "Running the search tests", Actor(helper.id, ActorType.AGENT))
    ticks(story, process, 120, every=40)
    expect_told(story, helper.session, f"output {process.id} prints about once every 40 seconds, so no reader can follow it")


def test_a_worker_is_told_its_own_run_is_sparse(new_story):
    story = new_story(fixture=HelperBesideWorker)
    worker = worker_agent(story)
    process = agent_run(story, worker, "pytest tests/api -q", CommandCategory.TEST_RUN)
    titled(story, process, "Running the api tests", Actor(worker.id, ActorType.AGENT))
    ticks(story, process, 120, every=60)
    expect_told(story, worker.session, f"output {process.id} prints about once every 60 seconds, so no reader can follow it")


def test_a_helpers_and_a_workers_runs_that_print_nothing_for_30_seconds_are_told_they_do_not_stream(new_story):
    story = new_story(fixture=HelperBesideWorker)
    helper, worker = helper_agent(story), worker_agent(story)
    scan = agent_run(story, helper, "python3 tools/scan.py", CommandCategory.BUILD)
    build = agent_run(story, worker, "make build", CommandCategory.BUILD)
    titled(story, build, "Building the worker branch", Actor(worker.id, ActorType.AGENT))
    ticks(story, build, 30)
    expect_told(story, helper.session, f"output {scan.id} printed nothing for 30 seconds, so its output is not streaming: it may hold its output back")
    expect_told(story, worker.session, f"output {build.id} printed nothing for 30 seconds, so its output is not streaming: make it print its steps")


def test_only_a_silent_go_test_over_several_packages_is_told_and_runs_printing_lines_or_a_progress_bar_never_are(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    silent = moved_run(story, "go test ./cart/... ./orders/...", CommandCategory.TEST_RUN)
    lines = moved_run(story, "make release", CommandCategory.BUILD)
    bar = moved_run(story, "make images", CommandCategory.BUILD)
    titled(story, silent, "Running the package tests")
    bar_text = ""
    heard: list[str] = []
    for step in range(20):
        bar_text += "\r[" + "#" * (step % 20) + "] working"
        printed(story, bar, bar_text)
        ticks(story, lines, 10, every=10, text="compiled one more file\n" * 10)
        heard += cadence_lines(told(story, MAIN))
    story.expect_rows(len(heard) == 1, f"output {silent.id} printed nothing for 30 seconds, so its output is not streaming: run one package at a time, or go test -p 1" in heard[0],
                      detail="\n".join(heard))


def test_a_busy_silent_build_is_told_it_does_not_stream_and_is_never_asked_to_be_looked_at(new_story):
    story = new_story(fixture=ActiveBuild)
    titled(story, running_run(story), "Building the project")
    tree = started_tree(story, 12.0)
    for _ in range(40):
        story.advance(TICK)
        tree.used += 1
        watch_tick(story)
        cadence_tick(story)
    expect_told(story, MAIN, "output 1 printed nothing for 30 seconds, so its output is not streaming")
    expect_looks(story, 0)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_a_waiting_agent_has_the_sparse_line_kept_without_a_wake_until_its_next_hook(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest tests/nightly -q", CommandCategory.TEST_RUN)
    story.hook(MAIN, HookSamples.stop())
    ticks(story, process, 120, every=60)
    story.expect_text(f"agent-line list --agent {story.agent.id} --json", "prints about once every 60 seconds", '"wakes_agent": false', actor=story.agent)
    expect_told(story, MAIN, f"output {process.id} prints about once every 60 seconds")


def test_a_busy_agent_is_told_the_sparse_line_once_with_its_next_tool_use(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest tests/e2e -q", CommandCategory.TEST_RUN)
    lines: list[str] = []
    for step in range(1, 15):
        lines += told(story, MAIN)
        ticks(story, process, 10, every=10 if step % 4 == 0 else 0)
    lines += told(story, MAIN)
    sparse = [line for line in lines if "so no reader can follow it" in line]
    story.expect_rows(len(sparse) == 1, detail="\n".join(lines))
