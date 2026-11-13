from core.modules.plans.models.phase import Phase
import json

import pytest

from engine.actor.actor import Actor
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run_handler import StartCheckpointRunHandler
from engine.database.database import Database
from engine.database.statement import Statement
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.server.support.server_client import server_story
from core.modules.plans.support.plan_nudges import CHECKPOINT_FINISHED
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.plan_reviews.support.plan_review_settings import QUICK_REVIEW_SETTING
from core.modules.plans.support.plan_settings import WAIT_FOR_PERSON_SETTING
from tests.stories.support.story_checks import expect_value

REACHES = "checkpoint-reach list --json --oldest --environment main"
PASSES = "checkpoint-pass list --json --oldest --environment main"
OUTLINE = "plan outline 1 --environment main"
PHASE_TEST = "pytest tests/build.py"
CHECKPOINT_ONLY_WORDS = "only a checkpoint phase has a test of its own: add --checkpoint"
UNRUN_WORDS = "not run: this phase is not a checkpoint"


def pass_reach(story: Story, reach_id: int) -> None:
    story.expect_success(f"checkpoint-reach passed {reach_id}", actor=Actor.core())
    story.run_listeners()


def close(story: Story, *task_ids: int) -> None:
    for task_id in task_ids:
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f'task close {task_id} --outcome "done"', actor=story.agent)
    story.run_listeners()


def plan_of_phases(story: Story, *phases: tuple[str, bool, int]) -> None:
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

    def steps(self, story: Story) -> None:
        plan_of_phases(story, ("Read", False, 1), ("Write", False, 1), ("Check", True, 1), ("Polish", False, 1), ("Ship", False, 1))


class ReachedCheckpoint(StoryFixture):
    """The plan of WindowsPlan with tasks 1, 2 and 3 closed by the main agent, so the checkpoint of phase 3 is
    reached and its run has not ended."""

    parent = WindowsPlan

    def steps(self, story: Story) -> None:
        close(story, 1, 2, 3)


class PassedCheckpoint(StoryFixture):
    """The plan of ReachedCheckpoint after the journal ended the run of phase 3 as passed."""

    parent = ReachedCheckpoint

    def steps(self, story: Story) -> None:
        pass_reach(story, 1)


class UnflaggedPlan(StoryFixture):
    """A started plan 1 with phases Build (1) and Ship (2), neither a checkpoint, each with one task."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        plan_of_phases(story, ("Build", False, 1), ("Ship", False, 1))


class FlaggedEndPlan(StoryFixture):
    """A started plan 1 with phases Build (1) and Ship (2, a checkpoint), each with one task."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        plan_of_phases(story, ("Build", False, 1), ("Ship", True, 1))


class FirstOfTwoReached(StoryFixture):
    """A started plan 1 with two checkpoint phases in a row, Build (1) and Check (2), each with one task; task
    1 is closed, so the checkpoint of phase 1 is reached."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        plan_of_phases(story, ("Build", True, 1), ("Check", True, 1))
        close(story, 1)


class EmptyCheckpointPlan(StoryFixture):
    """A started plan 1 whose checkpoint phase Gate (1) has no task, followed by phase Ship (2) with task 1."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        plan_of_phases(story, ("Gate", True, 0), ("Ship", False, 1))


class TwoCheckpointsPlan(StoryFixture):
    """A started plan 1 with two checkpoint phases in a row, Build (1) and Check (2), each with one task."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        plan_of_phases(story, ("Build", True, 1), ("Check", True, 1))




@pytest.fixture(autouse=True)
def blocked_runs(monkeypatch) -> None:
    """The stories of this file end the run of a reach themselves, as a suite that runs tests does: the journal
    starts no run."""
    monkeypatch.setattr(StartCheckpointRunHandler, "handle", lambda handler, command, context: None)


def rows(story: Story, line: str) -> list[dict[str, object]]:
    outcome = story.run(line, actor=story.user)
    assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
    return json.loads(outcome.output_text)["rows"]


def reaches(story: Story) -> list[tuple[object, object]]:
    return [(row["phase_id"], row["task_ids"]) for row in rows(story, REACHES)]


def test_167_a_flagged_phase_is_a_checkpoint_and_the_end_of_the_plan_is_one_without_a_flag(new_story):
    story = new_story(fixture=WindowsPlan)
    story.expect_text(OUTLINE, "checkpoint of phase 3: waits for tasks 1, 2, 3", "checkpoint of phase 5: waits for tasks 4, 5", actor=story.user)


@pytest.mark.parametrize("fixture", [UnflaggedPlan, FlaggedEndPlan])
def test_168_a_plan_has_one_checkpoint_at_its_end_whether_its_last_phase_is_flagged_or_not(new_story, fixture):
    story = new_story(fixture=fixture)
    close(story, 1)
    story.expect_rows(reaches(story) == [], detail=str(reaches(story)))
    close(story, 2)
    story.expect_rows(reaches(story) == [(2, "1,2")], detail=str(reaches(story)))


def test_169_the_window_of_a_checkpoint_is_the_tasks_placed_after_the_checkpoint_before_it(new_story):
    story = new_story(fixture=PassedCheckpoint)
    close(story, 4, 5)
    story.expect_rows(reaches(story) == [(3, "1,2,3"), (5, "4,5")], detail=str(reaches(story)))


def test_170_a_later_phase_stays_closed_while_the_checkpoint_is_reached_and_has_not_passed(new_story):
    story = new_story(fixture=ReachedCheckpoint)
    story.expect_success("task show 4", "state: open")
    story.expect_text(OUTLINE, "waits for the tests of phase 3", actor=story.user)


def test_171_a_checkpoint_is_reached_once_when_no_task_of_its_window_is_open_started_blocked_or_in_testing(new_story):
    story = new_story(fixture=WindowsPlan)
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


def test_178_a_pass_saves_a_pass_row_and_opens_the_tasks_of_the_later_phase(new_story):
    story = new_story(fixture=PassedCheckpoint)
    story.run("task start 4", actor=story.agent)
    story.expect_success("task show 4", "state: started")
    story.expect_rows([row["phase_id"] for row in rows(story, PASSES)] == [3], rows(story, REACHES)[0]["state"] == "passed", detail=str(rows(story, PASSES)))
    story.expect_text(f"agent-line list --agent {story.agent.id}", expected_nudge(CHECKPOINT_FINISHED, plan=1, phase='Check'))
    story.expect_text("task-log list --task 2", "tests passed at checkpoint phase 3", actor=story.agent)


def test_185_a_checkpoint_phase_with_no_task_passes_at_once_and_the_later_phase_is_open(new_story):
    story = new_story(fixture=EmptyCheckpointPlan)
    story.run_listeners()
    story.run(lines.TASK_START, actor=story.agent)
    story.expect_success("task show 1", "state: started")
    story.expect_rows([row["phase_id"] for row in rows(story, PASSES)] == [1], reaches(story) == [], detail=str(rows(story, PASSES)))


def test_185_two_checkpoint_phases_in_a_row_each_have_a_window_of_one_phase(new_story):
    story = new_story(fixture=FirstOfTwoReached)
    story.expect_rows(reaches(story) == [(1, "1")], detail=str(reaches(story)))
    pass_reach(story, 1)
    close(story, 2)
    story.expect_rows(reaches(story) == [(1, "1"), (2, "2")], detail=str(reaches(story)))


def test_186_tasks_the_main_agent_closes_without_ever_starting_them_count_as_done_for_the_checkpoint(new_story):
    story = new_story(fixture=FlaggedEndPlan)
    story.expect_success("task show 2", "state: open")
    close(story, 2, 1)
    story.expect_rows(reaches(story) == [(2, "1,2")], detail=str(reaches(story)))


def test_190_a_person_reads_in_the_plan_whether_a_checkpoint_waits_runs_or_has_passed(new_story):
    story = new_story(fixture=TwoCheckpointsPlan)
    story.expect_text(OUTLINE, "checkpoint of phase 1: waits for tasks 1", actor=story.user)
    close(story, 1)
    story.expect_text(OUTLINE, "checkpoint of phase 1: running", actor=story.user)
    pass_reach(story, 1)
    story.expect_text(OUTLINE, "checkpoint of phase 1: passed", "checkpoint of phase 2: waits for tasks 2", actor=story.user)


def test_191_a_task_added_to_a_window_after_its_run_started_is_not_in_that_run_and_joins_the_next(new_story):
    story = new_story(fixture=ReachedCheckpoint)
    added_id = story.new_row_id('task make "Write more" --environment main')
    story.run(f"phase place {added_id} --phase 2")
    story.expect_rows(reaches(story) == [(3, "1,2,3")], detail=str(reaches(story)))
    pass_reach(story, 1)
    close(story, added_id)
    story.expect_rows(reaches(story) == [(3, "1,2,3"), (3, f"1,2,{added_id},3")], detail=str(reaches(story)))


def test_187_the_main_agent_has_a_task_in_testing_run_early_and_the_early_pass_opens_no_phase(new_story):
    story = new_story(fixture=WindowsPlan)
    story.run(lines.TASK_START, actor=story.agent)
    story.run("task test 1", actor=story.agent)
    story.expect_success("plan check 1 --environment main", "checkpoint of phase 3: the tests of tasks 1 run early", actor=story.agent)
    reach = rows(story, REACHES)[0]
    story.expect_rows((reach["phase_id"], reach["task_ids"], reach["is_early"]) == (3, "1", True), detail=str(reach))
    pass_reach(story, 1)
    story.expect_rows(rows(story, PASSES) == [], detail="an early run opens no phase")


def test_188_a_plan_check_with_no_task_in_testing_says_so_and_saves_no_reach(new_story):
    story = new_story(fixture=WindowsPlan)
    story.expect_success("plan check 1 --environment main", "nothing to run: no task of the window is committed", actor=story.agent)
    story.expect_rows(reaches(story) == [], detail=str(reaches(story)))


def test_190_a_failed_run_names_its_tasks_and_the_progress_of_a_plan_names_each_checkpoint(new_story):
    story = new_story(fixture=FirstOfTwoReached)
    story.expect_success("checkpoint-reach failed 1 --failed-task-ids 1", actor=Actor.core())
    story.expect_text(OUTLINE, "checkpoint of phase 1: failed: tasks 1", actor=story.user)
    story.expect_text("plan progress 1 --environment main", "checkpoint of phase 1: failed: tasks 1", "checkpoint of phase 2: waits for tasks 2", actor=story.user)


def test_192_a_checkpoint_whose_run_failed_is_reached_again_when_its_returned_task_is_closed_again(new_story):
    story = new_story(fixture=ReachedCheckpoint)
    story.expect_success("checkpoint-reach failed 1 --failed-task-ids 3", actor=Actor.core())
    story.expect_success("task reopen 3", actor=story.user)
    story.run_listeners()
    still_failed = [row["state"] for row in rows(story, REACHES)]
    close(story, 3)
    story.expect_rows(still_failed == ["failed"], [row["state"] for row in rows(story, REACHES)] == ["failed", "running"], detail=str(rows(story, REACHES)))


def test_197_a_test_command_on_a_phase_that_is_no_checkpoint_is_refused_and_a_checkpoint_phase_takes_one(new_story):
    story = new_story(fixture=UserJoined)
    story.run(lines.NEW_PLAN)
    story.expect_refusal(f'phase make --plan 1 "Build" --test "{PHASE_TEST}"', CHECKPOINT_ONLY_WORDS)
    story.expect_success('phase make --plan 1 "Build"')
    story.expect_refusal(f'phase edit 1 --test-command "{PHASE_TEST}"', CHECKPOINT_ONLY_WORDS)
    story.expect_success(f'phase make --plan 1 "Check" --checkpoint --test "{PHASE_TEST}"')
    story.expect_rows([phase.test_command for phase in story.story_rows(Phase)] == ["", PHASE_TEST])


def test_198_a_test_command_an_older_journal_stored_on_a_phase_that_is_no_checkpoint_is_kept_and_shown_as_not_run(new_story):
    story = new_story(fixture=UnflaggedPlan)
    story.container.get(Database).update(Statement("UPDATE phases SET test_command = ? WHERE id = 1", [PHASE_TEST]))
    story.expect_text("phase show 1 --environment main", PHASE_TEST, actor=story.user)
    story.expect_text(OUTLINE, UNRUN_WORDS, actor=story.user)


def test_190_the_plan_view_gets_a_line_on_how_each_checkpoint_stands_and_on_a_test_that_is_not_run(new_story):
    story = new_story(fixture=ReachedCheckpoint)
    story.container.get(Database).update(Statement("UPDATE phases SET test_command = ? WHERE id = 1", [PHASE_TEST]))
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        inspected = server.viewer_line_value(cookie, {"window": "plans.plans", "line": ["plan", "inspect", "1"], "environment": "main"})
    lines = inspected["checkpoint_lines"]
    story.expect_rows("checkpoint of phase 3: running" in lines, "checkpoint of phase 5: waits for tasks 4, 5" in lines, "test of phase 1 not run: this phase is not a checkpoint" in lines, detail=str(lines))


WAIT_FOR_PERSON = f"setting set {WAIT_FOR_PERSON_SETTING} true --environment main"
APPROVE = "plan approve-checkpoint 1 3 --environment main"


def test_a_passed_checkpoint_keeps_the_later_phase_closed_until_a_person_approves_it_when_the_plan_waits_for_the_person(new_story):
    story = new_story(fixture=ReachedCheckpoint)
    story.expect_success(WAIT_FOR_PERSON, actor=story.user)
    pass_reach(story, 1)
    story.expect_rows(rows(story, PASSES) == [], rows(story, REACHES)[0]["state"] == "passed", detail=str(rows(story, PASSES)))
    story.expect_text(f"agent-line list --agent {story.agent.id}", "later phases open once a user approves it on the plan card")
    story.expect_text(OUTLINE, "checkpoint of phase 3: tests passed, waits for a user", actor=story.user)
    story.expect_refusal(APPROVE, "only a user approves a checkpoint", actor=story.agent)
    story.expect_success(APPROVE, "checkpoint phase 3 approved", actor=story.user)
    story.expect_text(OUTLINE, "checkpoint of phase 3: passed", actor=story.user)
    story.expect_rows([row["phase_id"] for row in rows(story, PASSES)] == [3], detail=str(rows(story, PASSES)))
    story.expect_text(f"agent-line list --agent {story.agent.id}", "later phases are open: tell the user")
    story.expect_refusal(APPROVE, "waits for no approval", actor=story.user)


QUICK_REVIEW = f"setting set {QUICK_REVIEW_SETTING} true --environment main"
REVIEWS = "checkpoint-review list --json --oldest --environment main"


def stop_with_report(text: str):
    stop = HookSamples.stop()
    return stop.with_raw({**stop.body["raw"], "last_assistant_message": text})


def test_a_passed_checkpoint_launches_its_read_only_reviewer_on_the_sonnet_model_and_keeps_its_report(new_story):
    story = new_story(fixture=ReachedCheckpoint)
    story.expect_success(QUICK_REVIEW, actor=story.user)
    story.expect_rows(rows(story, REVIEWS) == [], detail="no review before the tests pass")
    launcher = FakeLauncher.listening(story.home.socket("launcher"), request_count=2)
    pass_reach(story, 1)
    launcher.drain_requests()
    launcher.server.close()
    review = rows(story, REVIEWS)[0]
    story.expect_rows((review["plan_id"], review["phase_id"], review["program"], review["program_model"], review["report"]) == (1, 3, "claude", "sonnet", ""), detail=str(review))
    story.expect_text(f"agent show {agent_number(story, review['reviewer_id'])}", "role: reviewer", "access: read", "program_model: sonnet", actor=story.user)
    expect_value(len(launcher.starts), 1)
    command = " ".join(launcher.starts[0]["command"])
    story.expect_rows("sonnet" in command, "phase Check of plan 1" in command, detail=command)
    reviewer = story.container.get(Queries).query(Agent).find(review["reviewer_id"])
    story.hook(reviewer.session, stop_with_report("Matches the brief; the polish step is missing."))
    story.run_listeners()
    story.expect_rows(rows(story, REVIEWS)[0]["report"] == "Matches the brief; the polish step is missing.", detail=str(rows(story, REVIEWS)))


def test_two_checkpoint_reviews_get_sessions_of_their_own(new_story):
    story = new_story(fixture=FirstOfTwoReached)
    story.expect_success(QUICK_REVIEW, actor=story.user)
    pass_reach(story, 1)
    close(story, 2)
    pass_reach(story, 2)
    reviewers = [row["reviewer_id"] for row in rows(story, REVIEWS)]
    sessions = {story.container.get(Queries).query(Agent).find(reviewer).session for reviewer in reviewers}
    story.expect_rows(len(reviewers) == 2, len(sessions) == 2, detail=str(reviewers))


def test_a_checkpoint_with_the_review_off_starts_no_reviewer(new_story):
    story = new_story(fixture=PassedCheckpoint)
    story.expect_rows(rows(story, REVIEWS) == [], detail=str(rows(story, REVIEWS)))
