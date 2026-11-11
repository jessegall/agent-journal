import json

import pytest

from engine.actor.actor import Actor
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run_handler import StartCheckpointRunHandler
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import ready_plan

REACHES = "checkpoint-reach list --json --oldest --environment main"
PASSES = "checkpoint-pass list --json --oldest --environment main"
OUTLINE = "plan outline 1 --environment main"


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
def held_runs(monkeypatch) -> None:
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
    story.run('task block 3 --reason "waits on a person"', actor=story.agent)
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
    story.expect_text(f"agent-line list --agent {story.agent.id}", "plan 1: the tests of checkpoint phase Check passed, the phases after it are open: tell the user")
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
