from dataclasses import dataclass

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.messages.models.message import Message
from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.checkpoint_failures import end_run, expect_returned, produce_output
from tests.stories.suites.coding.modules.workers.checkpoint_runs import sole_branch_runs, CART_COMMAND, PASSES, REACHES, commit_tasks, merge, rows, run_lines
from tests.stories.suites.coding.modules.workers.merger import merger_agent
from tests.stories.suites.coding.modules.workers.merger_cases import running_merger
from tests.stories.suites.coding.modules.workers.stopped_with_tasks import MERGER_ON
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start, running_launcher
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, dispatched_story_worker, planned_story
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import SHOWN_SETTINGS, apply_work_setting
from suites.coding.modules.workers.support.worker_settings import PHASE_TEST_DEFERRAL_LIMIT
from tests.stories.server.support.server_client import server_story

LATER_STORIES = "tests/stories/compaction_never_twice.py"
WORKER_TEST = f"pytest tests/build.py {LATER_STORIES}"
SHORTER_TEST = "pytest tests/build.py"
DUE_TEST = f"pytest {LATER_STORIES}"
LATER_FAILURE = f"FAILED {LATER_STORIES}::test_a_second_compaction_is_refused - assert 2 == 1\n"
WHY = "its stories belong to task 4 of phase Ship"
DEFERRALS = "phase-test-deferral list --json --oldest --environment main"
LIMIT_SETTING = f"{PHASE_TEST_DEFERRAL_LIMIT}"
FIRST_RUN_SIZE = 3
REPEATED_HAND_IN = 'worker commit --wait --differences "nothing to fix: its failing test paths are deferred"'


@dataclass(frozen=True)
class FailedOwnTest:
    """A worker whose task came back from a failed own test of checkpoint phase 1, and the merger that reads it."""

    worker: StoryWorker
    merger: Actor

    @property
    def story(self):
        return self.worker.story

    def defer(self, paths: str = LATER_STORIES, flags: str = ""):
        number = agent_number(self.story, self.worker.worker.id)
        return self.story.run(f'merger defer-test {number} "{paths}" --why "{WHY}"{flags}', actor=self.merger)


def failed_checkpoint(new_story, monkeypatch, output: str, *failing_lines: str) -> FailedOwnTest:
    """Phase Build is a checkpoint whose own test also names stories written ahead for task 4 of phase Ship.
    Its three tasks are merged and its run has ended with the given tests failed; the merger runs."""
    merger_can_start(monkeypatch)
    sole_branch_runs(monkeypatch)
    worker = dispatched_story_worker(planned_story(new_story, build_test=WORKER_TEST), PHASE_DISPATCH, monkeypatch)
    worker.story.expect_success(MERGER_ON, actor=worker.story.user)
    commit_tasks(worker, TEST_LINE, "", SECOND_TEST_LINE)
    with running_launcher(worker.story):
        merge(worker)
        produce_output(worker, WORKER_TEST, output)
        end_run(worker, *failing_lines)
    merger = merger_agent(worker.story)
    if merger is None:
        return FailedOwnTest(worker, running_merger(worker.story, worker.worker))
    return FailedOwnTest(worker, Actor(merger.id, ActorType.AGENT))


def repeat_merge(worker: StoryWorker) -> None:
    """The worker asks for the merge of the task it handed in again, and that ask takes it in."""
    request_merge(worker.story, worker.worker)
    worker.story.run_listeners()


@pytest.fixture
def later_stories_failed(new_story, monkeypatch) -> FailedOwnTest:
    """The own test of checkpoint phase 1 failed only on the stories of the later task; task 3, completed
    last, came back to its worker, who asked about it."""
    case = failed_checkpoint(new_story, monkeypatch, LATER_FAILURE, WORKER_TEST)
    case.story.run('worker ask "The checkpoint test fails on stories of task 4" --about tests', actor=case.worker.worker)
    return case


@pytest.fixture
def deferred(later_stories_failed) -> FailedOwnTest:
    outcome = later_stories_failed.defer()
    assert outcome.code == 0, outcome.output_text
    return later_stories_failed


def test_214_a_merger_defers_the_stories_of_a_later_task_the_own_test_of_a_checkpoint_failed_on(later_stories_failed):
    case, story = later_stories_failed, later_stories_failed.story
    main_agent_line_count = len(case.worker.main_agent_lines())
    story.expect_text(f'merger defer-test {agent_number(story, case.worker.worker.id)} "{LATER_STORIES}" --why "{WHY}"', "until the checkpoint of phase 2", actor=case.merger)
    deferral = rows(case.worker, DEFERRALS)[0]
    story.expect_text("task-log list --task 3", WORKER_TEST, SHORTER_TEST, WHY, actor=story.agent)
    expect_returned(case.worker, 3)
    story.expect_rows((deferral["phase_id"], deferral["due_phase_id"], deferral["paths"], deferral["closed_at"]) == (1, 2, LATER_STORIES, None),
                      any("wait for the checkpoint of phase 2" in message.text for message in story.story_rows(Message)),
                      len(case.worker.main_agent_lines()) == main_agent_line_count, detail=f"{deferral} | {case.worker.worker_lines()}")


@pytest.fixture
def repeated_hand_in(deferred) -> FailedOwnTest:
    """After the deferral the worker handed its returned task in again and that work is merged: the checkpoint
    of phase 1 is reached a second time and its second run goes."""
    deferred.story.expect_success(REPEATED_HAND_IN, actor=deferred.worker.worker)
    deferred.story.run_listeners()
    repeat_merge(deferred.worker)
    return deferred


def test_94_the_run_after_a_deferral_leaves_the_deferred_paths_out_of_the_own_test_and_passes(repeated_hand_in):
    worker, story = repeated_hand_in.worker, repeated_hand_in.story
    second_run = run_lines(worker)[FIRST_RUN_SIZE:]
    end_run(worker)
    story.expect_rows(second_run == [SHORTER_TEST], [row["state"] for row in rows(worker, REACHES)] == ["failed", "passed"], [row["phase_id"] for row in rows(worker, PASSES)] == [1],
                      detail=f"{second_run} | {rows(worker, REACHES)}")


def test_95_the_deferred_paths_run_at_the_next_checkpoint_and_the_deferral_is_closed_when_it_passed(repeated_hand_in):
    worker, story = repeated_hand_in.worker, repeated_hand_in.story
    end_run(worker)
    story.run("task start 4", actor=story.agent)
    story.expect_success('task close 4 --outcome "released"', actor=story.agent)
    story.run_listeners()
    due_run = run_lines(worker)[-1]
    open_deferral = rows(worker, DEFERRALS)[0]["closed_at"]
    end_run(worker)
    story.expect_rows(due_run == DUE_TEST, open_deferral is None, rows(worker, DEFERRALS)[0]["closed_at"] is not None, detail=f"{run_lines(worker)} | {rows(worker, DEFERRALS)}")


def test_96_a_deferral_is_refused_when_no_task_of_a_later_phase_is_left_to_wait_for(later_stories_failed):
    story = later_stories_failed.story
    story.expect_success('task cancel 4 --reason "nothing is released"', actor=story.user)
    refused = later_stories_failed.defer()
    story.expect_rows(refused.code != 0, "nothing after phase 1 is left to wait for: the failure is real, fix it" in refused.output_text, rows(later_stories_failed.worker, DEFERRALS) == [], detail=refused.output_text)


def test_98_a_deferral_that_would_leave_the_own_test_no_path_is_refused(new_story, monkeypatch):
    case = failed_checkpoint(new_story, monkeypatch, f"FAILED tests/build.py::test_build - assert 1 == 2\n{LATER_FAILURE}", WORKER_TEST)
    refused = case.defer(f"tests/build.py {LATER_STORIES}")
    case.story.expect_rows(refused.code != 0, "the test command would be left with no path" in refused.output_text, detail=refused.output_text)


def test_100_a_deferral_past_the_most_deferrals_of_one_checkpoint_is_refused_with_the_number(later_stories_failed):
    apply_work_setting(later_stories_failed.story, LIMIT_SETTING, 1)
    later_stories_failed.story.expect_text(SHOWN_SETTINGS, f"{LIMIT_SETTING}: 1", actor=later_stories_failed.story.user)
    first, second = later_stories_failed.defer(), later_stories_failed.defer("tests/build.py")
    later_stories_failed.story.expect_rows(first.code == 0, second.code != 0, "1 of 1 deferrals are used for phase 1" in second.output_text, detail=second.output_text)


def test_103_153_a_deferral_settles_the_question_of_the_worker_as_fixed_and_the_worker_card_lists_it_with_its_time(later_stories_failed):
    story = later_stories_failed.story
    requested = [row for row in rows(later_stories_failed.worker, "merger-line list --json --oldest --limit 20 --environment main") if row["topic"]]
    outcome = later_stories_failed.defer(flags=f" --ask {requested[-1]['id']}")
    resolved = next(row for row in rows(later_stories_failed.worker, "merger-line list --json --oldest --limit 20 --environment main") if row["id"] == requested[-1]["id"])
    status = story.run("worker status --json", actor=later_stories_failed.worker.worker).output_text
    story.expect_rows(outcome.code == 0, resolved["outcome"] == "fixed", f"ask {resolved['id']} was " in status, " at 09:00" in status, detail=f"{outcome.output_text} | {resolved} | {status}")


def test_106_a_deferral_is_refused_when_the_own_test_of_the_checkpoint_did_not_fail(new_story, monkeypatch):
    case = failed_checkpoint(new_story, monkeypatch, "", CART_COMMAND)
    refused = case.defer()
    case.story.expect_rows(refused.code != 0, "the own test of phase 1 did not fail: nothing to correct" in refused.output_text, detail=refused.output_text)


def test_97_101_107_a_deferred_path_a_path_that_passed_and_a_word_that_is_no_test_path_are_each_refused(deferred):
    repeated, passed, folder = deferred.defer(), deferred.defer("tests/build.py"), deferred.defer("tests/stories")
    deferred.story.expect_rows(repeated.code != 0, f"{LATER_STORIES} is already deferred" in repeated.output_text, "tests/build.py did not fail in the own test of phase 1" in passed.output_text,
                               "tests/stories did not fail in the own test of phase 1" in folder.output_text, len(rows(deferred.worker, DEFERRALS)) == 1,
                               detail=f"{repeated.output_text} | {passed.output_text} | {folder.output_text}")


def test_105_only_the_merger_defers_a_test(later_stories_failed):
    story, worker = later_stories_failed.story, later_stories_failed.worker
    refused = story.run(f'merger defer-test {agent_number(story, worker.worker.id)} "{LATER_STORIES}" --why "{WHY}"', actor=worker.worker)
    story.expect_rows(refused.code != 0, rows(worker, DEFERRALS) == [], detail=refused.output_text)


def test_153_the_plan_shows_an_open_deferral_on_its_checkpoint_phase_until_it_is_closed(deferred):
    with server_story(deferred.story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        inspected = server.viewer_line_value(cookie, {"window": "plans.plans", "line": ["plan", "inspect", "1"], "environment": "main"})
    lines = inspected["checkpoint_lines"]
    deferred.story.expect_rows(f"phase 1: own test deferred: {LATER_STORIES}, until the checkpoint of phase 2" in lines, detail=str(lines))
