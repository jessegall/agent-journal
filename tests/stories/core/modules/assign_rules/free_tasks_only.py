import json

from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, rule_line, task_assignments, task_decision
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenBuilderWithPerson, OrchestratorWithPerson

TASK_ID = 1








def rule_given(story: Story, task_id: int) -> list[dict]:
    return [row for row in task_assignments(story, task_id) if row.rule_id is not None]


class AnyTaskRule(StoryFixture):
    """Ada's rule 1 gives any task to the main agent; task 1, Fix the cart, was made before it and carries no
    decision."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.run(rule_line("any"), actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text(f"assign-rule list {ENVIRONMENT}", "main", actor=story.user)


class PlanAndPhase(StoryFixture):
    """Ada's rule 1 gives any task to the main agent, and plan 1 has phase 1, First."""

    parent = AnyTaskRule

    def steps(self, story: Story) -> None:
        story.run(f'plan make "The rebuild" --brief "all of it" {ENVIRONMENT}', actor=story.agent)
        story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_text(f"plan show 1 {ENVIRONMENT}", "The rebuild", actor=story.user)


class BuilderPlanAndPhase(StoryFixture):
    """Beside a main agent that writes code, Ada's rule 1 gives any task to it, and plan 1 has phase 1, First."""

    parent = OpenBuilderWithPerson

    def steps(self, story: Story) -> None:
        story.run(rule_line("any"), actor=story.user)
        story.run(f'plan make "The rebuild" --brief "all of it" {ENVIRONMENT}', actor=story.agent)
        story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_text(f"plan show 1 {ENVIRONMENT}", "The rebuild", actor=story.user)


def test_a_task_assigned_by_hand_is_skipped_and_keeps_its_assignee(new_story):
    story = new_story(fixture=AnyTaskRule)
    story.expect_success(f"task assign {TASK_ID} --to {agent_number(story, story.agent.id)} {ENVIRONMENT}", actor=story.user)
    story.expect_success(f"task edit {TASK_ID} --complexity 3 {ENVIRONMENT}", actor=story.user)
    decision = task_decision(story, TASK_ID)
    story.expect_rows(decision.outcome == "has_assignee", decision.rule_id is None, rule_given(story, TASK_ID) == [], detail=str(decision))


def test_a_task_in_a_plan_goes_with_its_plan(new_story):
    story = new_story(fixture=PlanAndPhase)
    task_id = story.new_row_id(f'task make "Lay the floor" --phase 1 {ENVIRONMENT}', actor=story.user)
    decision = task_decision(story, task_id)
    story.expect_rows(decision.outcome == "planned", decision.reason == "in plan 1: assign the plan", rule_given(story, task_id) == [], detail=str(decision))


def test_a_rule_that_names_the_plan_gives_its_task(new_story):
    story = new_story(fixture=PlanAndPhase)
    rule_id = story.new_row_id(rule_line("place planned 1"), actor=story.user)
    story.run(f"assign-rule move {rule_id} --to 1 {ENVIRONMENT}", actor=story.user)
    task_id = story.new_row_id(f'task make "Paint the walls" --phase 1 {ENVIRONMENT}', actor=story.user)
    decision = task_decision(story, task_id)
    story.expect_rows(decision.outcome == "assigned", decision.rule_id == rule_id, detail=str(decision))


def test_a_task_of_an_assigned_plan_gets_the_plans_agent_and_the_rule_skips_it(new_story):
    story = new_story(fixture=BuilderPlanAndPhase)
    task_id = story.new_row_id(f'task make "Fit the doors" --phase 1 {ENVIRONMENT}', actor=story.user)
    story.expect_success(f"plan assign 1 --to {agent_number(story, story.agent.id)} {ENVIRONMENT}", actor=story.user)
    story.expect_success(f"task edit {task_id} --complexity 2 {ENVIRONMENT}", actor=story.user)
    decision = task_decision(story, task_id)
    story.expect_rows(decision.outcome == "has_assignee", [row.actor_id for row in task_assignments(story, task_id)] == [story.agent.id],
                      rule_given(story, task_id) == [], detail=str((decision, task_assignments(story, task_id))))


def test_a_task_a_person_started_is_never_free(new_story):
    story = new_story(fixture=AnyTaskRule)
    story.expect_success(f"task start {TASK_ID} {ENVIRONMENT}", actor=story.user)
    story.expect_success(f"task edit {TASK_ID} --complexity 3 {ENVIRONMENT}", actor=story.user)
    decision = task_decision(story, TASK_ID)
    story.expect_rows(decision.outcome != "assigned", decision.rule_id is None, rule_given(story, TASK_ID) == [], detail=str(decision))


def test_a_blocked_task_is_free_and_given(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    blocker_task = story.new_row_id(f'task make "Order the parts" {ENVIRONMENT}', actor=story.user)
    story.expect_success(f"task block {TASK_ID} --on task:{blocker_task} {ENVIRONMENT}", actor=story.user)
    rule_id = story.new_row_id(rule_line("title has_word cart"), actor=story.user)
    story.expect_success(f"task edit {TASK_ID} --complexity 2 {ENVIRONMENT}", actor=story.user)
    decision = task_decision(story, TASK_ID)
    story.expect_rows(decision.outcome == "assigned", decision.rule_id == rule_id, [row.actor_id for row in rule_given(story, TASK_ID)] == [story.agent.id],
                      detail=str(decision))
    story.expect_text(f"task show {TASK_ID} {ENVIRONMENT}", "state: blocked", actor=story.user)


def test_a_cancelled_task_is_never_given_and_reopening_it_gives_it_to_nobody(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_success(f'task cancel {TASK_ID} --reason "not needed" {ENVIRONMENT}', actor=story.user)
    story.run(rule_line("any"), actor=story.user)
    cancelled = json.loads(story.run(f"assign-decision record {TASK_ID} --json {ENVIRONMENT}", actor=story.user).output_text.splitlines()[0])
    story.expect_success(f"task reopen {TASK_ID} {ENVIRONMENT}", actor=story.user)
    story.expect_rows(cancelled.outcome == "skipped", cancelled.reason == "the task is cancelled", task_assignments(story, TASK_ID) == [],
                      detail=str((cancelled, task_assignments(story, TASK_ID))))


def test_a_task_released_after_a_rule_gave_it_returns_to_the_pool(new_story):
    story = new_story(fixture=AnyTaskRule)
    task_id = story.new_row_id(f'task make "Sweep the floor" {ENVIRONMENT}', actor=story.user)
    story.expect_success(f"task start {task_id} {ENVIRONMENT}", actor=story.agent)
    story.expect_success(f'task release {task_id} --reason "the main agent gives it back" {ENVIRONMENT}', actor=story.agent)
    story.expect_success(f'task edit {task_id} --brief "sweep it twice" {ENVIRONMENT}', actor=story.user)
    decision = task_decision(story, task_id)
    story.expect_rows(decision.outcome == "assigned", task_assignments(story, task_id) == [], detail=str((decision, task_assignments(story, task_id))))
    story.expect_text(f"task show {task_id} {ENVIRONMENT}", "state: open", actor=story.user)
