import pytest

from datetime import timedelta

from engine.command.bus import Bus
from engine.query.conditions.prefix import Prefix
from engine.query.queries import Queries
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.models.process import Process
from engine.enums.command_category import CommandCategory
from suites.coding.modules.workers.commands.report_stopped_worker_runs.report_stopped_worker_runs import SOURCE_KEY_PREFIX
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_settings import SILENT_RECOVERY_ATTEMPTS, STOPPED_WORKER_RUN_MINUTES, WORKER_RESUME_LIMIT
from suites.coding.modules.workers.ticks.stopped_worker_runs import StoppedWorkerRuns
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON, ended, main_agent_lines, missing_program, running_worker, two_task_worker, worker_story  # noqa: F401
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import SHOWN_SETTINGS, apply_work_setting, set_resume_limit
from suites.coding.modules.workers.support.worker_nudges import WORKER_RESTARTED
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_RUNS_AFTER_STOP
from engine.testing.expectations.expected_nudge import expected_nudge
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT

TEST_ROWS_REASON = "the test reads every row it checks"

MARKS = "chat-mark list --environment 1"


def merger_texts(story) -> list[str]:
    return [line.text for line in story.story_rows(MergerLine)]


def background_run(story) -> Process:
    story.run(f"setting set {WORKER_TEST_LIMIT} 0 --environment main")
    part = PartSpec("make test", "make", False, CommandCategory.TEST_RUN)
    run = story.container.get(Bus).run(StartProcess(story.worker.id, None, "make test", "/work", CommandCategory.TEST_RUN, 30, [part]), story.worker, environment_id=1)
    story.expect_success(f"process background {run.id}", actor=story.worker)
    return run


def worker_label(story) -> str:
    return f"worker:{agent_number(story, story.worker.id)}"


@pytest.mark.parametrize("resume_limit, restart_line_count, main_agent_line_count", [(3, 1, 0), (0, 0, 1)])
def test_a_stopped_worker_shows_a_card_and_is_restarted_with_one_line_to_the_merger_or_at_its_resume_limit_named_once_to_the_main_agent(two_task_worker, resume_limit, restart_line_count, main_agent_line_count):
    story = two_task_worker
    set_resume_limit(story.container, resume_limit)
    story.expect_success(MERGER_ON, actor=story.user)
    ended(story)
    story.run_listeners()
    merger_lines = tuple(story.story_rows(MergerLine))
    lines = main_agent_lines(story)
    story.expect_rows("tasks left" in story.run(MARKS).output_text, len(merger_lines) == restart_line_count, lines.count(f"{worker_label(story)} ended with") == main_agent_line_count,
                      not expected_nudge(WORKER_RESTARTED).matches_text(lines), all(line.environment_id == 1 for line in merger_lines), detail=f"{merger_texts(story)} | {lines}")


def test_a_stop_by_another_agent_shows_a_card_and_sends_no_line(two_task_worker):
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    story.expect_success(f"agent end {story.worker.id}", actor=story.agent)
    story.run_listeners()
    story.expect_rows(merger_texts(story) == [], "tasks left" in story.run(MARKS).output_text, f"{worker_label(story)} ended with" not in main_agent_lines(story), detail=str(merger_texts(story)))


def test_a_worker_whose_run_still_goes_shows_no_card_and_sends_no_line(two_task_worker):
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    background_run(story)
    ended(story)
    story.run_listeners()
    story.expect_rows(merger_texts(story) == [], "tasks left" not in story.run(MARKS).output_text, detail=str(merger_texts(story)))


def stopped_run_lines(story) -> tuple[MergerLine, ...]:
    return tuple(story.container.get(Queries).query(MergerLine).matching(Prefix("source_key", SOURCE_KEY_PREFIX)).every_row(TEST_ROWS_REASON))


def test_a_person_sets_the_resume_limit_on_the_workers_screen_and_the_next_stop_follows_it(two_task_worker):
    story = two_task_worker
    story.expect_success(MERGER_ON, actor=story.user)
    story.expect_text(SHOWN_SETTINGS, WORKER_RESUME_LIMIT, STOPPED_WORKER_RUN_MINUTES, SILENT_RECOVERY_ATTEMPTS, actor=story.user)
    apply_work_setting(story, SILENT_RECOVERY_ATTEMPTS, 1)
    apply_work_setting(story, WORKER_RESUME_LIMIT, 0)
    ended(story)
    story.run_listeners()
    lines = main_agent_lines(story)
    story.expect_rows(lines.count(f"{worker_label(story)} ended with") == 1, merger_texts(story) == [], detail=lines)


def test_a_stopped_worker_whose_run_goes_on_past_the_minutes_set_on_the_workers_screen_is_one_line_to_the_merger_until_the_run_ends(two_task_worker):
    story = two_task_worker
    apply_work_setting(story, STOPPED_WORKER_RUN_MINUTES, 5)
    story.expect_success(MERGER_ON, actor=story.user)
    run = background_run(story)
    ended(story)
    story.advance(timedelta(minutes=4))
    StoppedWorkerRuns()(story.container)
    story.expect_rows(stopped_run_lines(story) == (), detail="the minutes a user set have not gone by")
    story.advance(timedelta(minutes=2))
    StoppedWorkerRuns()(story.container)
    StoppedWorkerRuns()(story.container)
    lines = stopped_run_lines(story)
    story.expect_rows(len(lines) == 1, expected_nudge(WORKER_RUN_RUNS_AFTER_STOP).matches_text(lines[0].text), lines[0].outcome is None,
                      lines[0].worker_id == story.worker.id, "waits on output" not in main_agent_lines(story), detail=f"{lines} | {main_agent_lines(story)}")
    story.container.get(Bus).run(EndProcess(run.id, 0, 10, 1), story.worker, environment_id=1)
    StoppedWorkerRuns()(story.container)
    story.expect_rows(stopped_run_lines(story)[0].outcome is AskOutcome.MOOT, detail=str(stopped_run_lines(story)))
