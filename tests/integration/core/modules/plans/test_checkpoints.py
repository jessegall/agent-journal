from core.modules.plans.models.phase import Phase
import json
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.environment.environment_names import EnvironmentNames
from core.modules.tasks.commands.close_task.close_task import CloseTask
from engine.testing.examples.hook_samples import HookSamples
from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run_handler import StartCheckpointRunHandler
from core.modules.plans.ticks.plan_state_sweep import PlanStateSweep
from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.server.support.server_client import server_story
from core.modules.plans.nudges.checkpoint_finished_nudge import CheckpointFinishedNudge
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.plan_reviews.support.plan_review_settings import QUICK_REVIEW_SETTING
from tests.stories.support.story_checks import expect_value
from tests.integration.support.fixture_journal import FixtureJournal

REACHES = "checkpoint-reach list --json --oldest --environment main"
PASSES = "checkpoint-pass list --json --oldest --environment main"
OUTLINE = "plan outline 1 --environment main"
PHASE_TEST = "pytest tests/build.py"
CHECKPOINT_TERMS = "only a checkpoint phase has a test of its own: add --checkpoint"
UNRUN_TERMS = "not run: this phase is not a checkpoint"


def pass_reach(story: FixtureJournal, reach_id: int) -> None:
    story.expect_success(f"checkpoint-reach passed {reach_id}", actor=Actor.core())
    story.run_listeners()


def close(story: FixtureJournal, *task_ids: int) -> None:
    for task_id in task_ids:
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f'task close {task_id} --outcome "done"', actor=story.agent)
    story.run_listeners()


def plan_of_phases(story: FixtureJournal, *phases: tuple[str, bool, int]) -> None:
    story.run(lines.NEW_PLAN)
    for number, (title, is_checkpoint, task_count) in enumerate(phases, 1):
        story.run(f'phase make --plan 1 "{title}"{" --checkpoint" if is_checkpoint else ""}')
        for task_number in range(1, task_count + 1):
            task_id = story.new_row_id(f'task make "{title} {task_number}" --environment main')
            story.run(f"phase place {task_id} --phase {number}")
    ready_plan(story, actor=story.user)
    for move in ("approve", "start"):
        story.run(f"plan {move} 1 --environment main", actor=story.user)


class WindowsPlan(StoryFixture):
    """A started plan 1 with phases Read (1), Write (2), Check (3, a checkpoint), Polish (4) and Ship (5), each
    with one task that has the number of its phase."""

    parent = UserJoined

    def steps(self, story: FixtureJournal) -> None:
        plan_of_phases(story, ("Read", False, 1), ("Write", False, 1), ("Check", True, 1), ("Polish", False, 1), ("Ship", False, 1))


class ReachedCheckpoint(StoryFixture):
    """The plan of WindowsPlan with tasks 1, 2 and 3 closed by the main agent, so the checkpoint of phase 3 is
    reached and its run has not ended."""

    parent = WindowsPlan

    def steps(self, story: FixtureJournal) -> None:
        close(story, 1, 2, 3)


class PassedCheckpoint(StoryFixture):
    """The plan of ReachedCheckpoint after the journal ended the run of phase 3 as passed."""

    parent = ReachedCheckpoint

    def steps(self, story: FixtureJournal) -> None:
        pass_reach(story, 1)


class UnflaggedPlan(StoryFixture):
    """A started plan 1 with phases Build (1) and Ship (2), neither a checkpoint, each with one task."""

    parent = UserJoined

    def steps(self, story: FixtureJournal) -> None:
        plan_of_phases(story, ("Build", False, 1), ("Ship", False, 1))


class FlaggedEndPlan(StoryFixture):
    """A started plan 1 with phases Build (1) and Ship (2, a checkpoint), each with one task."""

    parent = UserJoined

    def steps(self, story: FixtureJournal) -> None:
        plan_of_phases(story, ("Build", False, 1), ("Ship", True, 1))


class FirstOfTwoReached(StoryFixture):
    """A started plan 1 with two checkpoint phases in a row, Build (1) and Check (2), each with one task; task
    1 is closed, so the checkpoint of phase 1 is reached."""

    parent = UserJoined

    def steps(self, story: FixtureJournal) -> None:
        plan_of_phases(story, ("Build", True, 1), ("Check", True, 1))
        close(story, 1)


class EmptyCheckpointPlan(StoryFixture):
    """A started plan 1 whose checkpoint phase Gate (1) has no task, followed by phase Ship (2) with task 1."""

    parent = UserJoined

    def steps(self, story: FixtureJournal) -> None:
        plan_of_phases(story, ("Gate", True, 0), ("Ship", False, 1))


class TwoCheckpointsPlan(StoryFixture):
    """A started plan 1 with two checkpoint phases in a row, Build (1) and Check (2), each with one task."""

    parent = UserJoined

    def steps(self, story: FixtureJournal) -> None:
        plan_of_phases(story, ("Build", True, 1), ("Check", True, 1))




@pytest.fixture(autouse=True)
def blocked_runs(monkeypatch) -> None:
    """The stories of this file end the run of a reach themselves, as a suite that runs tests does: the journal
    starts no run."""
    monkeypatch.setattr(StartCheckpointRunHandler, "handle", lambda handler, command, context: None)


def rows(story: FixtureJournal, line: str) -> list[dict[str, object]]:
    outcome = story.run(line, actor=story.user)
    assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
    return json.loads(outcome.output_text)["rows"]


def reaches(story: FixtureJournal) -> list[tuple[object, object]]:
    return [(row["phase_id"], row["task_ids"]) for row in rows(story, REACHES)]


def test_167_a_flagged_phase_is_a_checkpoint_and_the_end_of_the_plan_is_one_without_a_flag(played):
    story = played(WindowsPlan)
    story.expect_text(OUTLINE, "checkpoint of phase 3: waits for tasks 1, 2, 3", "checkpoint of phase 5: waits for tasks 4, 5", actor=story.user)


@pytest.mark.parametrize("fixture", [UnflaggedPlan, FlaggedEndPlan])
def test_168_a_plan_has_one_checkpoint_at_its_end_whether_its_last_phase_is_flagged_or_not(played, fixture):
    story = played(fixture)
    close(story, 1)
    story.expect_rows(reaches(story) == [], detail=str(reaches(story)))
    close(story, 2)
    story.expect_rows(reaches(story) == [(2, "1,2")], detail=str(reaches(story)))


def test_169_the_window_of_a_checkpoint_is_the_tasks_placed_after_the_checkpoint_before_it(played):
    story = played(PassedCheckpoint)
    close(story, 4, 5)
    story.expect_rows(reaches(story) == [(3, "1,2,3"), (5, "4,5")], detail=str(reaches(story)))


def test_170_a_later_phase_stays_closed_while_the_checkpoint_is_reached_and_has_not_passed(played):
    story = played(ReachedCheckpoint)
    story.expect_success("task show 4", "state: open")
    story.expect_text(OUTLINE, "waits for the tests of phase 3", actor=story.user)


def test_171_a_checkpoint_is_reached_once_when_no_task_of_its_window_is_open_started_blocked_or_in_testing(played):
    story = played(WindowsPlan)
    story.run('task cancel 1 --reason "not needed"', actor=story.user)
    story.run("task start 2", actor=story.agent)
    story.run("task test 2", actor=story.agent)
    story.run('task block 3 --reason "waits on a user"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(reaches(story) == [], detail=f"a task in testing and a blocked one hold the checkpoint: {reaches(story)}")
    story.run("task unblock 3", actor=story.agent)
    close(story, 2)
    story.run("task start 3", actor=story.agent)
    story.run_listeners()
    story.expect_rows(reaches(story) == [], detail=f"a started task holds the checkpoint: {reaches(story)}")
    close(story, 3)
    story.run_listeners()
    story.expect_rows(reaches(story) == [(3, "2,3")], detail=str(reaches(story)))


def test_178_a_pass_saves_a_pass_row_and_opens_the_tasks_of_the_later_phase(played):
    story = played(PassedCheckpoint)
    story.run("task start 4", actor=story.agent)
    story.expect_success("task show 4", "state: started")
    story.expect_rows([row["phase_id"] for row in rows(story, PASSES)] == [3], rows(story, REACHES)[0]["state"] == "passed", detail=str(rows(story, PASSES)))
    story.expect_text(f"agent-line list --agent {story.agent.id}", expected_nudge(CheckpointFinishedNudge.declared(), plan=1, phase='Check'))
    story.expect_text("task-log list --task 2", "tests passed at checkpoint phase 3", actor=story.agent)


def test_185_a_checkpoint_phase_with_no_task_passes_at_once_and_the_later_phase_is_open(played):
    story = played(EmptyCheckpointPlan)
    story.run_listeners()
    story.run(lines.TASK_START, actor=story.agent)
    story.expect_success("task show 1", "state: started")
    story.expect_rows([row["phase_id"] for row in rows(story, PASSES)] == [1], reaches(story) == [], detail=str(rows(story, PASSES)))


def test_185_two_checkpoint_phases_in_a_row_each_have_a_window_of_one_phase(played):
    story = played(FirstOfTwoReached)
    story.expect_rows(reaches(story) == [(1, "1")], detail=str(reaches(story)))
    pass_reach(story, 1)
    close(story, 2)
    story.expect_rows(reaches(story) == [(1, "1"), (2, "2")], detail=str(reaches(story)))


def test_186_tasks_the_main_agent_closes_without_ever_starting_them_count_as_done_for_the_checkpoint(played):
    story = played(FlaggedEndPlan)
    story.expect_success("task show 2", "state: open")
    close(story, 2, 1)
    story.expect_rows(reaches(story) == [(2, "1,2")], detail=str(reaches(story)))


def test_190_a_person_reads_in_the_plan_whether_a_checkpoint_waits_runs_or_has_passed(played):
    story = played(TwoCheckpointsPlan)
    story.expect_text(OUTLINE, "checkpoint of phase 1: waits for tasks 1", actor=story.user)
    close(story, 1)
    story.expect_text(OUTLINE, "checkpoint of phase 1: running", actor=story.user)
    pass_reach(story, 1)
    story.expect_text(OUTLINE, "checkpoint of phase 1: passed", "checkpoint of phase 2: waits for tasks 2", actor=story.user)


def test_191_a_task_added_to_a_window_after_its_run_started_is_not_in_that_run_and_joins_the_next(played):
    story = played(ReachedCheckpoint)
    added_id = story.new_row_id('task make "Write more" --environment main')
    story.run(f"phase place {added_id} --phase 2")
    story.expect_rows(reaches(story) == [(3, "1,2,3")], detail=str(reaches(story)))
    pass_reach(story, 1)
    close(story, added_id)
    story.expect_rows(reaches(story) == [(3, "1,2,3"), (3, f"1,2,{added_id},3")], detail=str(reaches(story)))


def test_187_the_main_agent_has_a_task_in_testing_run_early_and_the_early_pass_opens_no_phase(played):
    story = played(WindowsPlan)
    story.run(lines.TASK_START, actor=story.agent)
    story.run("task test 1", actor=story.agent)
    story.expect_success("plan check 1 --environment main", "checkpoint of phase 3: the tests of tasks 1 run early", actor=story.agent)
    reach = rows(story, REACHES)[0]
    story.expect_rows((reach["phase_id"], reach["task_ids"], reach["is_early"]) == (3, "1", True), detail=str(reach))
    pass_reach(story, 1)
    story.expect_rows(rows(story, PASSES) == [], detail="an early run opens no phase")


def test_188_a_plan_check_with_no_task_in_testing_says_so_and_saves_no_reach(played):
    story = played(WindowsPlan)
    story.expect_success("plan check 1 --environment main", "nothing to run: no task of the window is committed", actor=story.agent)
    story.expect_rows(reaches(story) == [], detail=str(reaches(story)))


def test_190_a_failed_run_names_its_tasks_and_the_progress_of_a_plan_names_each_checkpoint(played):
    story = played(FirstOfTwoReached)
    story.expect_success("checkpoint-reach failed 1 --failed-task-ids 1", actor=Actor.core())
    story.expect_text(OUTLINE, "checkpoint of phase 1: failed: tasks 1", actor=story.user)
    story.expect_text("plan progress 1 --environment main", "checkpoint of phase 1: failed: tasks 1", "checkpoint of phase 2: waits for tasks 2", actor=story.user)


def test_192_a_checkpoint_whose_run_failed_is_reached_again_when_its_returned_task_is_closed_again(played):
    story = played(ReachedCheckpoint)
    story.expect_success("checkpoint-reach failed 1 --failed-task-ids 3", actor=Actor.core())
    story.expect_success("task reopen 3", actor=story.user)
    story.run_listeners()
    refailed = [row["state"] for row in rows(story, REACHES)]
    close(story, 3)
    story.expect_rows(refailed == ["failed"], [row["state"] for row in rows(story, REACHES)] == ["failed", "running"], detail=str(rows(story, REACHES)))


def test_197_a_test_command_on_a_phase_that_is_no_checkpoint_is_refused_and_a_checkpoint_phase_takes_one(played):
    story = played(UserJoined)
    story.run(lines.NEW_PLAN)
    story.expect_refusal(f'phase make --plan 1 "Build" --test "{PHASE_TEST}"', CHECKPOINT_TERMS)
    story.expect_success('phase make --plan 1 "Build"')
    story.expect_refusal(f'phase edit 1 --test-command "{PHASE_TEST}"', CHECKPOINT_TERMS)
    story.expect_success(f'phase make --plan 1 "Check" --checkpoint --test "{PHASE_TEST}"')
    story.expect_rows([phase.test_command for phase in story.story_rows(Phase)] == ["", PHASE_TEST])


def test_198_a_test_command_an_older_journal_stored_on_a_phase_that_is_no_checkpoint_is_kept_and_shown_as_not_run(played):
    story = played(UnflaggedPlan)
    story.container.get(Database).update(Statement("UPDATE phases SET test_command = ? WHERE id = 1", [PHASE_TEST]))
    story.expect_text("phase show 1 --environment main", PHASE_TEST, actor=story.user)
    story.expect_text(OUTLINE, UNRUN_TERMS, actor=story.user)


def test_190_the_plan_view_gets_a_line_on_how_each_checkpoint_stands_and_on_a_test_that_is_not_run(played):
    story = played(ReachedCheckpoint)
    story.container.get(Database).update(Statement("UPDATE phases SET test_command = ? WHERE id = 1", [PHASE_TEST]))
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        inspected = server.viewer_line_value(cookie, {"window": "plans.plans", "line": ["plan", "inspect", "1"], "environment": "main"})
    lines = inspected["checkpoint_lines"]
    story.expect_rows("checkpoint of phase 3: running" in lines, "checkpoint of phase 5: waits for tasks 4, 5" in lines, "test of phase 1 not run: this phase is not a checkpoint" in lines, detail=str(lines))


QUICK_REVIEW = f"setting set {QUICK_REVIEW_SETTING} true --environment main"
REVIEWS = "checkpoint-review list --json --oldest --environment main"


def stop_with_report(text: str):
    stop = HookSamples.stop()
    return stop.with_raw({**stop.body["raw"], "last_assistant_message": text})


def test_a_passed_checkpoint_launches_its_read_only_reviewer_on_the_sonnet_model_and_keeps_its_report(played):
    story = played(ReachedCheckpoint)
    story.expect_success(QUICK_REVIEW, actor=story.user)
    story.expect_rows(rows(story, REVIEWS) == [], detail="no review before the tests pass")
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), request_count=2)
    pass_reach(story, 1)
    launcher.drain_requests()
    launcher.server.close()
    review = rows(story, REVIEWS)[0]
    story.expect_rows((review["plan_id"], review["phase_id"], review["program"], review["program_model"], review["report"]) == (1, 3, "claude", "sonnet", ""), detail=str(review))
    story.expect_text(f"agent show {agent_number(story, review['reviewer_id'])}", "role: helper", "access: read", "program_model: sonnet", actor=story.user)
    expect_value(len(launcher.starts), 1)
    command = " ".join(launcher.starts[0]["command"])
    story.expect_rows("sonnet" in command, "phase Check of plan 1" in command, detail=command)
    reviewer = story.row(Agent, review["reviewer_id"])
    story.hook(reviewer.session, stop_with_report("Matches the brief; the polish step is missing."))
    story.run_listeners()
    story.expect_rows(rows(story, REVIEWS)[0]["report"] == "Matches the brief; the polish step is missing.", detail=str(rows(story, REVIEWS)))


def test_two_checkpoint_reviews_get_sessions_of_their_own(played):
    story = played(FirstOfTwoReached)
    story.expect_success(QUICK_REVIEW, actor=story.user)
    pass_reach(story, 1)
    close(story, 2)
    pass_reach(story, 2)
    reviewers = [row["reviewer_id"] for row in rows(story, REVIEWS)]
    sessions = {story.row(Agent, reviewer).session for reviewer in reviewers}
    story.expect_rows(len(reviewers) == 2, len(sessions) == 2, detail=str(reviewers))


def test_a_checkpoint_with_the_review_off_starts_no_reviewer(played):
    story = played(PassedCheckpoint)
    story.expect_rows(rows(story, REVIEWS) == [], detail=str(rows(story, REVIEWS)))


def started_checkpoint_plan(story: FixtureJournal, plan_id: int, environment: str) -> int:
    """Makes plan plan_id in the environment, with one checkpoint phase holding one task, starts it and returns the task."""
    story.expect_success(f'plan make "Plan {plan_id}" --environment {environment}', actor=story.user)
    story.expect_success(f'phase make --plan {plan_id} "Check" --checkpoint --environment {environment}', actor=story.user)
    task_id = story.new_row_id(f'task make "Task {plan_id}" --environment {environment}', actor=story.user)
    story.expect_success(f"phase place {task_id} --phase {plan_id} --environment {environment}", actor=story.user)
    story.expect_success(f'task waits-on-nothing {task_id} --why "the order does not matter in this story" --environment {environment}', actor=story.user)
    story.run(f"plan ready {plan_id} --environment {environment}", story.user)
    story.run(f'plan ready {plan_id} --environment {environment} --skip-guard plans.one-task-phase --skip-reason "one task is enough in this story"', story.user)
    for move in ("approve", "start"):
        story.expect_success(f"plan {move} {plan_id} --environment {environment}", actor=story.user)
    return task_id


def test_tasks_closed_in_two_environments_in_one_round_reach_the_checkpoints_of_both(played):
    story = played(UserJoined)
    story.expect_success("environment make other /work/other", actor=story.user)
    tasks = {"main": started_checkpoint_plan(story, 1, "main"), "other": started_checkpoint_plan(story, 2, "other")}
    for environment, task_id in tasks.items():
        story.expect_success(f"task start {task_id} --environment {environment}", actor=story.user)
    for environment, task_id in tasks.items():
        story.run_command(CloseTask(task_id, "done"), story.user, environment_id=story.container.get(EnvironmentNames).environment_id(environment))
    story.run_listeners()
    for environment in tasks:
        story.expect_text(f"checkpoint-reach list --json --oldest --environment {environment}", '"state"', actor=story.user)


def test_a_plan_whose_tasks_all_ended_while_its_last_run_went_and_failed_gets_one_new_run_and_closes_on_its_pass(played):
    story = played(UserJoined)
    plan_of_phases(story, ("Ship", True, 2))
    close(story, 1, 2)
    story.advance(timedelta(minutes=1))
    story.expect_success("task reopen 2", actor=story.user)
    close(story, 2)
    story.expect_success("checkpoint-reach failed 1 --failed-task-ids 1", actor=Actor.core())
    story.run_listeners()
    stuck = [row["state"] for row in rows(story, REACHES)]
    PlanStateSweep()(story.container)
    story.run_listeners()
    PlanStateSweep()(story.container)
    story.run_listeners()
    story.expect_rows(stuck == ["failed"], [row["state"] for row in rows(story, REACHES)] == ["failed", "running"], detail=str(rows(story, REACHES)))
    pass_reach(story, 2)
    story.expect_text("plan show 1 --environment main", "state: completed", actor=story.user)
