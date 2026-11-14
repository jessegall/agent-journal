from tests.stories.core.modules.processes.support.roomy_fixtures import RoomyBuilderStarted, RoomyUserBuilder
from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import expect_marks_text
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.modules.processes.support.cadence_probe import (TICK, HelperBesideWorker, agent_run, cadence_lines, cadence_tick,
                                                                       expect_informed, has_cadence_record, kept_lines, session_run, emitted, running_run, side_run,
                                                                       labelled_tick, ticks, informed, waiting_run, worker_agent)
from tests.stories.core.modules.processes.background import SavedBuildMoved, SilentVitestRun, expect_streaming_line, expect_without_hint
from tests.stories.core.modules.processes.hang_watch import HANG_SECONDS, ActiveBuild, expect_looks, started_tree, watch_tick
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from core.modules.processes.support.process_nudges import SILENT_RUN
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.processes.support.process_nudges import RUN_SPARSE
from core.modules.processes.support.process_nudges import SILENT_SAVED_RUN
from core.modules.processes.support.process_nudges import STALLED_RUN
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from core.modules.processes.models.enums.process_setting import ProcessSetting

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
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    process = moved_run(story, "python3 tools/deploy.py staging", category=CommandCategory.BUILD)
    expect_without_hint(story)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, SILENT_RUN.nudge(output=process.id, seconds=30, hint='it may hold its output back: print with flush=True, or run it with python3 -u').text)


def test_a_silent_test_gets_its_hint_once_and_again_when_it_stops_printing(new_story):
    story = new_story(fixture=SilentVitestRun)
    process = running_run(story)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, "run vitest with --reporter=verbose")
    story.advance(TICK)
    cadence_tick(story)
    expect_without_hint(story)
    emitted(story, process, "first line\n")
    cadence_tick(story)
    for _ in range(STOPPED_WRITING // TICK):
        story.advance(TICK)
        cadence_tick(story)
    expect_streaming_line(story, STALLED_RUN.nudge(output=process.id, seconds=120, hint='run vitest with --reporter=verbose').text)


def test_a_silent_saved_command_is_told_to_fix_its_alias(new_story):
    story = new_story(fixture=SavedBuildMoved)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, SILENT_SAVED_RUN.nudge(name='build-npm', seconds=30).text)


def titled(story, process, title: str, actor=None) -> None:
    story.expect_success(f'output title {process.id} "{title}"', actor=actor or story.agent)


def test_a_sparse_pytest_run_keeps_running_and_after_printing_often_is_told_only_once_it_stops_writing(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    process = moved_run(story, SLOW_TESTS, CommandCategory.TEST_RUN)
    titled(story, process, "Running the slow tests")
    ticks(story, 120, process, every=50)
    expect_informed(story, MAIN, RUN_SPARSE.nudge(output=process.id, seconds=50, hint='run pytest without -q').text)
    story.expect_text(f"process show {process.id}", "state: background", actor=story.agent)
    ticks(story, 80, process, every=10)
    silent = cadence_lines(informed(story, MAIN))
    ticks(story, 120, process)
    expect_informed(story, MAIN, f"Output {process.id} has written nothing for 120s and is still running")
    story.expect_rows(silent == [], detail="\n".join(silent))


def test_a_read_only_helper_is_told_its_own_run_is_sparse(new_story):
    story = new_story(fixture=HelperBesideWorker)
    helper = helper_agent(story)
    process = agent_run(story, helper, "pytest tests/search -q", CommandCategory.TEST_RUN)
    titled(story, process, "Running the search tests", Actor(helper.id, ActorType.AGENT))
    ticks(story, 120, process, every=40)
    expect_informed(story, helper.session, f"Output {process.id} prints about once every 40s, too sparse for a reader")


def test_a_helpers_and_a_workers_runs_that_print_nothing_for_30_seconds_are_told_they_do_not_stream(new_story):
    story = new_story(fixture=HelperBesideWorker)
    helper, worker = helper_agent(story), worker_agent(story)
    scan = agent_run(story, helper, "python3 tools/scan.py", CommandCategory.BUILD)
    build = agent_run(story, worker, "make build", CommandCategory.BUILD)
    titled(story, build, "Building the worker branch", Actor(worker.id, ActorType.AGENT))
    ticks(story, 30, build)
    expect_informed(story, helper.session, SILENT_RUN.nudge(output=scan.id, seconds=30, hint='it may hold its output back').text)
    expect_informed(story, worker.session, SILENT_RUN.nudge(output=build.id, seconds=30, hint='make it print its steps').text)


def test_only_a_silent_go_test_over_several_packages_is_told_and_runs_printing_lines_or_a_progress_bar_never_are(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    silent = moved_run(story, "go test ./cart/... ./orders/...", CommandCategory.TEST_RUN)
    lines = moved_run(story, "make release", CommandCategory.BUILD)
    progress_line = moved_run(story, "make images", CommandCategory.BUILD)
    titled(story, silent, "Running the package tests")
    progress_text = ""
    received: list[str] = []
    for step in range(20):
        progress_text += "\r[" + "#" * (step % 20) + "] working"
        emitted(story, progress_line, progress_text)
        ticks(story, 10, lines, every=10, text="compiled one more file\n" * 10)
        received += cadence_lines(informed(story, MAIN))
    story.expect_rows(len(received) == 1, expected_nudge(SILENT_RUN, seconds=30, hint='run').matches_text(received[0]),
                      detail="\n".join(received))


def test_a_busy_silent_build_is_told_it_does_not_stream_and_is_never_asked_to_be_looked_at(new_story):
    story = new_story(fixture=ActiveBuild)
    titled(story, running_run(story), "Building the project")
    tree = started_tree(story, 12.0)
    for _ in range(40):
        story.advance(TICK)
        tree.used += 1
        watch_tick(story)
        cadence_tick(story)
    expect_informed(story, MAIN, "Output 1 printed nothing for 30s, so it is not streaming")
    expect_looks(story, 0)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_a_waiting_agent_has_the_sparse_line_kept_without_a_wake_until_its_next_hook(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    process = moved_run(story, "pytest tests/nightly -q", CommandCategory.TEST_RUN)
    story.hook(MAIN, HookSamples.stop())
    ticks(story, 120, process, every=60)
    story.expect_text(f"agent-line list --agent {story.agent.id} --json", expected_nudge(RUN_SPARSE), '"wakes_agent": false', actor=story.agent)
    expect_informed(story, MAIN, f"Output {process.id} prints about once every 60s")


def test_a_busy_agent_is_told_the_sparse_line_once_with_its_next_tool_use(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    process = moved_run(story, "pytest tests/e2e -q", CommandCategory.TEST_RUN)
    lines: list[str] = []
    for step in range(1, 15):
        lines += informed(story, MAIN)
        ticks(story, 10, process, every=10 if step % 4 == 0 else 0)
    lines += informed(story, MAIN)
    sparse = [line for line in lines if "too sparse for a reader" in line]
    story.expect_rows(len(sparse) == 1, detail="\n".join(lines))


NON_STREAMING = "so it is not streaming"
SPARSE_KEY = f"{ProcessSetting.SPARSE_SECONDS.key}"


def test_a_silent_run_is_told_again_only_after_ten_minutes_at_most_three_times_and_is_still_held_and_stopped(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    process = moved_run(story, "make dist", CommandCategory.BUILD)
    titled(story, process, "Building the dist folder")
    ticks(story, 600)
    first = kept_lines(story).count(NON_STREAMING)
    ticks(story, 40)
    second = kept_lines(story).count(NON_STREAMING)
    ticks(story, 1260)
    story.expect_rows((first, second, kept_lines(story).count(NON_STREAMING)) == (1, 2, 3), detail=kept_lines(story))
    story.expect_hook_refusal(MAIN, HookSamples.edit("cart.py"), f"Output {process.id} printed nothing for")
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=HANG_SECONDS + 10))
    watch_tick(story)
    story.expect_text(f"process show {process.id}", "state: stopped", actor=story.agent)


def test_two_sparse_runs_are_told_in_one_line_right_after_their_silence_was_told(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    first = moved_run(story, "pytest tests/a -q", CommandCategory.TEST_RUN)
    second = moved_run(story, "pytest tests/b -q", CommandCategory.TEST_RUN)
    titled(story, first, "Running the first tests")
    ticks(story, 120, first, second, every=50)
    expect_informed(story, MAIN, "printed nothing for 30s", f"outputs {first.id}, {second.id} print too seldom for a reader to follow: run pytest without -q")


def test_a_run_that_ended_and_a_run_that_was_stopped_are_told_nothing(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    ended = moved_run(story, "make assets", CommandCategory.BUILD)
    stopped = moved_run(story, "make fonts", CommandCategory.BUILD)
    story.expect_success(f"output stop {stopped.id}", actor=story.agent)
    end_run(story, ended, "")
    ticks(story, 60)
    story.expect_rows(NON_STREAMING not in kept_lines(story), detail=kept_lines(story))


def test_plugin_person_and_lookup_runs_are_never_judged_while_a_started_test_is(new_story):
    story = install_runner(new_story(fixture=RoomyUserBuilder))
    skipped = [side_run(story, story.user, "make deploy", CommandCategory.BUILD), side_run(story, story.agent, "make lint", CommandCategory.CHECK, plugin="sample"),
               *(side_run(story, story.agent, line, category) for line, category in (("grep -rn cart src", CommandCategory.SEARCH), ("cat notes", CommandCategory.READ),
                                                                                      ("sed -i s/a/b/ notes", CommandCategory.EDIT), ("journal task list", CommandCategory.JOURNAL)))]
    judged = side_run(story, story.agent, "pytest tests/first.py", CommandCategory.TEST_RUN)
    titled(story, judged, "Running the first tests")
    ticks(story, 60)
    lines = "\n".join(informed(story, MAIN))
    story.expect_rows(f"Output {judged.id} printed nothing" in lines, *(f"Output {process.id} printed nothing" not in lines for process in skipped), detail=lines)


def test_a_workers_queued_run_is_told_nothing_while_its_running_one_is(new_story):
    story = new_story(fixture=HelperBesideWorker)
    for setting in (f"{ProcessSetting.RUN_BATCH_SIZE.key} 1", f"{WORKER_TEST_LIMIT} 0", f"{ProcessSetting.READERS_FORCED.key} false"):
        story.expect_success(f"setting set {setting} --environment main", actor=story.user)
    worker = worker_agent(story)
    running = agent_run(story, worker, "pytest tests/api -q", CommandCategory.TEST_RUN)
    queued = waiting_run(story, worker, "pytest tests/web -q")
    ticks(story, 30)
    lines = informed(story, worker.session)
    story.expect_rows(any(f"Output {running.id} printed nothing" in line for line in lines), not any(f"Output {queued.id} " in line for line in lines), detail="\n".join(lines))


def test_a_person_entering_zero_or_a_negative_sparse_seconds_is_refused_and_nothing_changes(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal(f"setting set {SPARSE_KEY} 0 --environment main", "must be at least 1", actor=story.user)
    story.expect_refusal(f"setting set {SPARSE_KEY} -5 --environment main", "must be at least 1", actor=story.user)
    story.expect_text(f"setting show {SPARSE_KEY} --environment main", "value: 30", actor=story.user)


def test_a_run_another_agent_owns_tells_the_agent_of_its_session(new_story):
    story = new_story(fixture=HelperBesideWorker)
    worker = worker_agent(story)
    process = session_run(story, worker, "make bundle")
    titled(story, process, "Building the bundle")
    ticks(story, 30)
    expect_informed(story, MAIN, f"Output {process.id} printed nothing for 30s")
    story.expect_rows(cadence_lines(informed(story, worker.session)) == [])


def test_a_long_script_of_no_known_type_is_told_to_print_its_steps_and_its_card_shows_the_progress_of_its_new_reader(new_story):
    story = install_runner(new_story(fixture=RoomyBuilderStarted))
    process = moved_run(story, "zsh tools/move.sh")
    titled(story, process, "Moving the files")
    ticks(story, 30)
    expect_informed(story, MAIN, SILENT_RUN.nudge(output=process.id, seconds=30, hint='make it print its steps').text)
    story.expect_success('reader add move-files --commands "zsh tools/move.sh*" --lines "moved" --progress "\\[([0-9]+)/([0-9]+)\\]"', actor=story.agent)
    emitted(story, process, "[3/17] moved a.txt\n")
    labelled_tick(story, "read running outputs")
    story.expect_text(f"output show {process.id}", "progress: 17", actor=story.agent)
    expect_marks_text(story, "Moving the files")
