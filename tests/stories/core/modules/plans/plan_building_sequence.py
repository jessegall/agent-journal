import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from core.modules.sequences.models.sequence_run import SequenceRun
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from server.work.booting_work import BootingWork
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value

STEP_INCOMPLETE = "step {step} of sequence 1 is not complete"
PLAN_BEING_BUILT = "plan 1 is still being built"
ORDER_MISSING = "states no order"
COMMAND_REFUSED = "does not allow this command"


def journal_sample(line: str):
    arguments = line.split()
    return HookSamples.shell(f"journal {line}", ShellPart("journal", CommandCategory.JOURNAL, arguments, subcommand=arguments[0]))


class StandardSequences(StoryFixture):
    parent = UserBuilder

    def steps(self, story) -> None:
        story.run_listeners()
        BootingWork().run(story.container)
        story.run_listeners()


class AgreeStep(StoryFixture):
    """An agent made plan 1 with no brief; its sequence started and the first step is taken up."""

    parent = StandardSequences

    def steps(self, story) -> None:
        story.expect_success('plan make "Version 5 core" --environment main', actor=story.agent)
        story.run_listeners()
        story.expect_success("sequence follow", actor=story.agent)


class PhasesStep(StoryFixture):
    """The plan has its goal and the agent is on the phases step."""

    parent = AgreeStep

    def steps(self, story) -> None:
        story.expect_success('plan edit 1 --brief "What is true when it is done"', actor=story.agent)
        story.expect_success("sequence next", actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)


class TasksStep(StoryFixture):
    """The plan has two phases and the agent is on the tasks step."""

    parent = PhasesStep

    def steps(self, story) -> None:
        story.expect_success('phase make --plan 1 "Build" --goal "It is built"', actor=story.agent)
        story.expect_success('phase make --plan 1 "Prove" --goal "It is proven"', actor=story.agent)
        story.expect_success("sequence next", actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)


class OrderStep(StoryFixture):
    """Each phase has two tasks and the agent is on the step that sets the order."""

    parent = TasksStep

    def steps(self, story) -> None:
        for title, phase in (("First", 1), ("Second", 1), ("Third", 2), ("Fourth", 2)):
            story.expect_success(f'task make "{title}" --brief "Do {title}" --phase {phase}', actor=story.agent)
        story.expect_success("sequence next", actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)


class Ordered(StoryFixture):
    """Every task but the first waits on the one before it, and the agent is still on the order step."""

    parent = OrderStep

    def steps(self, story) -> None:
        for task in (2, 3, 4):
            story.expect_success(f"task depend {task} --on {task - 1}", actor=story.agent)


class ReadyStep(StoryFixture):
    """The order is set and the agent is on the last step."""

    parent = Ordered

    def steps(self, story) -> None:
        story.expect_success("sequence next", actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)


class PlannerHelper(StoryFixture):
    """A read-only planner of the main agent made plan 1 and took up its first step."""

    parent = StandardSequences

    def steps(self, story) -> None:
        story.helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
        story.expect_success('plan make "Version 5 core" --environment main', actor=story.helper)
        story.run_listeners()
        story.expect_success("sequence follow", actor=story.helper)


class HandMadePlan(StoryFixture):
    """An agent gave up the sequence and filed one phase with two tasks by hand."""

    parent = StandardSequences

    def steps(self, story) -> None:
        story.expect_success('plan make "By hand" --brief "Goal" --environment main', actor=story.agent)
        story.run_listeners()
        story.expect_success("sequence follow", actor=story.agent)
        story.expect_success('sequence abandon --why "the plan is made by hand" --sure', actor=story.agent)
        story.expect_success('phase make --plan 1 "Build" --goal "Done"', actor=story.agent)
        for title in ("First", "Second"):
            story.expect_success(f'task make "{title}" --brief "Do it" --phase 1', actor=story.agent)


def test_the_sequence_has_a_step_that_sets_what_waits_on_what(new_story):
    story = new_story(fixture=StandardSequences)
    story.expect_text("sequence show 1", "journal task depend", "journal task waits-on-nothing")


def test_the_step_that_sets_the_order_comes_before_marking_the_plan_ready(new_story):
    story = new_story(fixture=StandardSequences)
    shown = story.run("sequence show 1", actor=story.agent).output_text
    story.expect_rows(shown.index("journal task depend") < shown.index("journal plan ready"), detail=shown)


def test_a_plan_without_a_goal_cannot_leave_the_first_step(new_story):
    story = new_story(fixture=AgreeStep)
    story.expect_refusal("sequence next", STEP_INCOMPLETE.format(step=1), actor=story.agent)
    story.expect_refusal("sequence next", "plan 1 has no brief", actor=story.agent)


def test_a_plan_with_a_goal_leaves_the_first_step(new_story):
    story = new_story(fixture=AgreeStep)
    story.expect_success('plan edit 1 --brief "The goal"', actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 2", actor=story.agent)


def test_a_plan_without_phases_cannot_leave_the_phases_step(new_story):
    story = new_story(fixture=PhasesStep)
    story.expect_refusal("sequence next", "plan 1 has no phases", actor=story.agent)


def test_a_phase_without_tasks_holds_the_tasks_step(new_story):
    story = new_story(fixture=TasksStep)
    story.expect_success('task make "First" --brief "Do it" --phase 1', actor=story.agent)
    story.expect_refusal("sequence next", "phase 2 of plan 1 has no tasks", actor=story.agent)


def test_a_task_with_no_order_holds_the_order_step(new_story):
    story = new_story(fixture=OrderStep)
    story.expect_refusal("sequence next", ORDER_MISSING, actor=story.agent)


def test_the_first_task_of_the_plan_needs_no_order(new_story):
    story = new_story(fixture=Ordered)
    story.expect_text("sequence next", "sequence 1, step 5", actor=story.agent)


def test_a_task_that_waits_on_nothing_says_why(new_story):
    story = new_story(fixture=OrderStep)
    story.expect_refusal('task waits-on-nothing 2 --why " "', "why", actor=story.agent)


def test_a_task_declared_to_wait_on_nothing_counts_as_ordered(new_story):
    story = new_story(fixture=OrderStep)
    for task in (2, 3, 4):
        story.expect_success(f'task waits-on-nothing {task} --why "It stands alone"', actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 5", actor=story.agent)


def test_the_reason_a_task_waits_on_nothing_can_be_read_back(new_story):
    story = new_story(fixture=OrderStep)
    story.expect_success('task waits-on-nothing 2 --why "It stands alone"', actor=story.agent)
    story.expect_text("task show 2", "It stands alone", actor=story.agent)


def test_a_cancelled_task_needs_no_order(new_story):
    story = new_story(fixture=Ordered)
    story.expect_success("task remove-dependency 4 --on 3", actor=story.agent)
    story.expect_success('task cancel 4 --reason "not needed"', actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 5", actor=story.agent)


def test_removing_a_tasks_only_dependency_holds_the_step_again(new_story):
    story = new_story(fixture=Ordered)
    story.expect_success("task remove-dependency 4 --on 3", actor=story.agent)
    story.expect_refusal("sequence next", "task 4", actor=story.agent)


def test_a_task_that_waits_on_a_task_outside_the_plan_counts_as_ordered(new_story):
    story = new_story(fixture=OrderStep)
    story.expect_success('task make "Outside" --brief "Elsewhere"', actor=story.agent)
    for task in (2, 3, 4):
        story.expect_success(f"task depend {task} --on 5", actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 5", actor=story.agent)


def test_a_dependency_loop_cannot_be_skipped(new_story):
    story = new_story(fixture=Ordered)
    story.expect_refusal('task depend 1 --on 4 --skip-guard tasks.no-dependency-loop --skip-reason "I want it"', "loop", actor=story.agent)


@pytest.mark.parametrize("fixture, line", [
    (AgreeStep, 'phase make --plan 1 "Build" --goal "Done"'),
    (AgreeStep, 'task make "First" --brief "Do it"'),
    (AgreeStep, "plan ready 1"),
    (PhasesStep, 'task make "First" --brief "Do it"'),
    (PhasesStep, "task depend 2 --on 1"),
    (PhasesStep, "plan ready 1"),
    (TasksStep, "plan ready 1"),
    (OrderStep, "plan ready 1"),
])
def test_a_step_refuses_what_belongs_to_a_later_step(new_story, fixture, line):
    story = new_story(fixture=fixture)
    story.expect_hook_refusal("s-1", journal_sample(line), COMMAND_REFUSED)


@pytest.mark.parametrize("fixture, line", [
    (AgreeStep, 'plan edit 1 --brief "The goal"'),
    (PhasesStep, 'phase make --plan 1 "Build" --goal "Done"'),
    (TasksStep, 'task make "First" --brief "Do it" --phase 1'),
    (OrderStep, "task depend 2 --on 1"),
    (ReadyStep, "plan ready 1"),
])
def test_a_step_allows_its_own_work(new_story, fixture, line):
    story = new_story(fixture=fixture)
    story.expect_hook_allowed("s-1", journal_sample(line))


@pytest.mark.parametrize("fixture", [AgreeStep, PhasesStep, TasksStep, Ordered])
def test_the_plan_cannot_be_made_ready_by_command_before_the_last_step(new_story, fixture):
    story = new_story(fixture=fixture)
    story.expect_refusal("plan ready 1", PLAN_BEING_BUILT, actor=story.agent)


def test_the_last_step_ends_when_the_plan_is_ready_and_the_agent_may_stop(new_story):
    story = new_story(fixture=ReadyStep)
    story.expect_success("plan ready 1", actor=story.agent)
    story.run_listeners()
    story.expect_hook_allowed("s-1", HookSamples.stop())


@pytest.mark.parametrize("fixture", [AgreeStep, PhasesStep, TasksStep, OrderStep, ReadyStep])
def test_the_agent_cannot_stop_on_any_step_of_the_plan_sequence(new_story, fixture):
    story = new_story(fixture=fixture)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "sequence:1")


def test_making_a_plan_ready_ends_its_sequence_and_the_run_on_another_plan_stays_open(new_story):
    story = new_story(fixture=ReadyStep)
    worker = Actor(story.new_row_id("agent start s-worker claude worker --environment main"), ActorType.AGENT)
    story.run('plan make "Other" --environment main', actor=worker)
    story.run_listeners()
    story.expect_success("plan ready 1", actor=story.agent)
    story.run_listeners()
    open_runs = [run.session_agent_id for run in story.story_rows(SequenceRun) if run.ended_at is None]
    expect_value(open_runs, [worker.id])


def test_cancelling_the_plan_lets_its_agent_stop(new_story):
    story = new_story(fixture=TasksStep)
    story.expect_success('plan cancel 1 --reason "replaced"', actor=story.agent)
    story.run_listeners()
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_a_helper_planner_cannot_skip_to_ready(new_story):
    story = new_story(fixture=PlannerHelper)
    story.expect_hook_refusal("s-2", journal_sample("plan ready 1"), COMMAND_REFUSED)


def test_a_helper_planner_cannot_make_the_plan_ready_by_command_either(new_story):
    story = new_story(fixture=PlannerHelper)
    story.expect_refusal("plan ready 1", PLAN_BEING_BUILT, actor=story.helper)


def test_a_helper_planner_cannot_stop_halfway(new_story):
    story = new_story(fixture=PlannerHelper)
    story.expect_hook_refusal("s-2", HookSamples.stop(), "sequence:1")


def test_a_plan_with_unordered_tasks_cannot_be_made_ready_even_with_its_sequence_given_up(new_story):
    story = new_story(fixture=HandMadePlan)
    story.expect_refusal("plan ready 1", ORDER_MISSING, actor=story.agent)


def test_a_plan_made_by_hand_goes_ready_once_its_order_is_stated(new_story):
    story = new_story(fixture=HandMadePlan)
    story.expect_success("task depend 2 --on 1", actor=story.agent)
    story.expect_success("plan ready 1", actor=story.agent)


def test_a_person_may_make_their_own_plan_ready_without_stating_an_order(new_story):
    story = new_story(fixture=HandMadePlan)
    story.expect_success("plan ready 1", actor=story.user)


def test_a_sequence_started_by_hand_has_no_plan_to_ask_about(new_story):
    story = new_story(fixture=StandardSequences)
    story.expect_success("sequence run 1", actor=story.agent)
    story.expect_success("sequence follow", actor=story.agent)
    story.expect_text("sequence next", "sequence 1, step 2", actor=story.agent)


def test_the_planning_skill_tells_a_planner_to_set_the_order(new_story):
    story = new_story(fixture=StandardSequences)
    story.expect_text("skill show journal-planning", "journal task depend", "journal task waits-on-nothing", actor=story.agent)
