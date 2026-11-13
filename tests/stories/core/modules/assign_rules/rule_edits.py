import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import (COMPLEXITY_RULE, ENVIRONMENT, MIGRATION_RULE, PersonRulesAndWorker, TwoPersonRules, new_task, rule_line,
                                                                        rule_places, task_assignments, task_decision)
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson

CART_RULE = 1


def assignees(story: Story, task_id: int) -> list[int]:
    return [row.actor_id for row in task_assignments(story, task_id)]


def listed_task_ids(story: Story, line: str) -> list[int]:
    answer = json.loads(story.run(f"{line} --json {ENVIRONMENT}", actor=story.user).output_text)
    return [row["task_id"] for row in answer["tasks"]]


class CartRule(StoryFixture):
    """Ada's rule 1 gives a task whose title has the word cart to the main agent, and task 1, Fix the cart, went
    to it by that rule."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.run(rule_line("title has_word cart"), actor=story.user)
        new_task(story, '"Fix the cart"')

    def expect(self, story: Story) -> None:
        story.expect_rows(assignees(story, 1) == [story.agent.id], detail=assignees(story, 1))


class DisabledRuleTasks(StoryFixture):
    """Ada's rule 1 gives any task to the main agent, but it was off while task 1, Fix the shelf, and task 2, Fix
    the rack, were made, and is on again."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.run(rule_line("any"), actor=story.user)
        story.run(f"assign-rule disable 1 {ENVIRONMENT}", actor=story.user)
        new_task(story, '"Fix the shelf"')
        new_task(story, '"Fix the rack"')
        story.run(f"assign-rule enable 1 {ENVIRONMENT}", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_rows([task_decision(story, 1).outcome, task_decision(story, 2).outcome] == ["unmatched", "unmatched"], detail=str(task_decision(story, 1)))


class RuleTasksStartedAndHandGiven(StoryFixture):
    """Beside the worker, rule 1 gave the main agent task 1, which waits, and task 2, which the main agent
    started; task 3 the person gave the main agent by hand. Then the rule was turned to the worker."""

    parent = PersonRulesAndWorker

    def steps(self, story: Story) -> None:
        new_task(story, '"Fix the lamp" --complexity 5')
        started = new_task(story, '"Fix the clock" --complexity 5')
        story.expect_success(f"task start {started} {ENVIRONMENT}", actor=story.agent)
        hand_given = new_task(story, '"Fix the door"')
        story.expect_success(f"task assign {hand_given} --to {agent_number(story, story.agent.id)} {ENVIRONMENT}", actor=story.user)
        story.run(f"assign-rule edit {COMPLEXITY_RULE} --target agent --agent row:{story.helper.id} {ENVIRONMENT}", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_rows([assignees(story, task_id) for task_id in (1, 2, 3)] == [[story.agent.id]] * 3, detail=[assignees(story, task_id) for task_id in (1, 2, 3)])


def test_an_edited_condition_judges_only_later_tasks_and_what_the_old_text_gave_stays(new_story):
    story = new_story(fixture=CartRule)
    story.run(f'assign-rule edit {CART_RULE} --condition "title has_word till" {ENVIRONMENT}', actor=story.user)
    till_task, cart_task = new_task(story, '"Fix the till"'), new_task(story, '"Fix the cart wheel"')
    story.expect_rows(assignees(story, 1) == [story.agent.id], assignees(story, till_task) == [story.agent.id], task_decision(story, cart_task).outcome == "unmatched",
                      detail=str(task_decision(story, cart_task)))


def test_apply_lists_the_free_tasks_first_and_gives_them_once_confirmed(new_story):
    story = new_story(fixture=DisabledRuleTasks)
    listed = listed_task_ids(story, "assign-rule apply 1")
    unchanged = [assignees(story, 1), assignees(story, 2)]
    story.expect_text(f"assign-rule apply 1 --confirm {ENVIRONMENT}", "rule 1: 2 tasks changed", actor=story.user)
    decisions = [task_decision(story, 1), task_decision(story, 2)]
    story.expect_rows(listed == [1, 2], unchanged == [[], []], [decision.outcome for decision in decisions] == ["assigned", "assigned"],
                      [assignees(story, 1), assignees(story, 2)] == [[story.agent.id], [story.agent.id]], detail=str(decisions))


def test_a_rule_turned_on_again_gives_nothing_made_while_it_was_off_until_applied(new_story):
    story = new_story(fixture=DisabledRuleTasks)
    story.run_tick_handler("assign rules retry")
    later_task = new_task(story, '"Fix the bench"')
    story.expect_rows(task_decision(story, 1).outcome == "unmatched", assignees(story, 1) == [], assignees(story, later_task) == [story.agent.id], detail=str(task_decision(story, 1)))


def test_reassign_moves_only_the_waiting_tasks_the_rule_gave(new_story):
    story = new_story(fixture=RuleTasksStartedAndHandGiven)
    listed = listed_task_ids(story, f"assign-rule reassign {COMPLEXITY_RULE}")
    story.expect_success(f"assign-rule reassign {COMPLEXITY_RULE} --confirm {ENVIRONMENT}", actor=story.user)
    moved = task_decision(story, 1)
    story.expect_rows(listed == [1], [assignees(story, task_id) for task_id in (1, 2, 3)] == [[story.helper.id], [story.agent.id], [story.agent.id]],
                      task_assignments(story, 1)[0].rule_id == COMPLEXITY_RULE, moved.actor_id == story.helper.id, detail=str(moved))


def test_moving_a_rule_changes_the_numbers_and_only_later_tasks(new_story):
    story = new_story(fixture=TwoPersonRules)
    given = new_task(story, '"Plan the migration" --complexity 5')
    story.run(f"assign-rule move {MIGRATION_RULE} --to 1 {ENVIRONMENT}", actor=story.user)
    later = new_task(story, '"Run the migration" --complexity 5')
    story.expect_rows(rule_places(story) == {MIGRATION_RULE: 1, COMPLEXITY_RULE: 2}, task_decision(story, given).rule_id == COMPLEXITY_RULE, task_decision(story, later).rule_id == MIGRATION_RULE,
                      detail=rule_places(story))


def test_a_deleted_rule_leaves_its_tasks_and_gives_back_the_waiting_ones_each_on_its_own(new_story):
    story = new_story(fixture=CartRule)
    second = new_task(story, '"Oil the cart"')
    story.run(f"assign-rule delete {CART_RULE} {ENVIRONMENT}", actor=story.user)
    story.expect_text(f"task info 1 {ENVIRONMENT}", f"by rule {CART_RULE} (deleted)", actor=story.agent)
    listed = listed_task_ids(story, f"assign-rule give-back {CART_RULE}")
    story.expect_success(f"assign-rule give-back {CART_RULE} --confirm {ENVIRONMENT}", actor=story.user)
    story.expect_rows(listed == [1, second], assignees(story, 1) == [], assignees(story, second) == [], task_decision(story, 1).outcome == "assigned", detail=listed)


def test_a_rule_on_a_retired_worker_keeps_its_warning_until_one_edit_moves_it(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    retired = story.new_row_id(f"agent start w-9 claude worker --parent {story.agent.id} {ENVIRONMENT}")
    story.run(f"assign-rule make --target agent --agent row:{retired} --condition any {ENVIRONMENT}", actor=story.user)
    story.run(f"agent end {retired}")
    story.run(f'agent retire {agent_number(story, retired)} --reason "not needed"', actor=story.user)
    warned = story.run(f"assign-rule board {ENVIRONMENT}", actor=story.user).output_text
    worker = Actor(story.new_row_id(f"agent start w-10 claude worker --parent {story.agent.id} {ENVIRONMENT}"), ActorType.AGENT)
    story.run(f"assign-rule edit 1 --agent row:{worker.id} {ENVIRONMENT}", actor=story.user)
    task_id = new_task(story, '"Fix the bell"')
    story.expect_rows("its agent is retired" in warned, "its agent is retired" not in story.run(f"assign-rule board {ENVIRONMENT}", actor=story.user).output_text,
                      assignees(story, task_id) == [worker.id], detail=warned)


def test_a_task_edited_so_it_no_longer_matches_stays_given(new_story):
    story = new_story(fixture=CartRule)
    story.expect_success(f'task edit 1 --title "Fix the till" {ENVIRONMENT}', actor=story.user)
    story.expect_rows(assignees(story, 1) == [story.agent.id], task_decision(story, 1).rule_id == CART_RULE, detail=str(task_decision(story, 1)))


def test_a_free_task_edited_so_it_matches_is_given_now(new_story):
    story = new_story(fixture=TwoPersonRules)
    task_id = new_task(story, '"Fix the scale"')
    unmatched = task_decision(story, task_id)
    story.expect_success(f"task edit {task_id} --complexity 5 {ENVIRONMENT}", actor=story.user)
    story.expect_rows(unmatched.outcome == "unmatched", task_decision(story, task_id).rule_id == COMPLEXITY_RULE, assignees(story, task_id) == [story.agent.id],
                      detail=str(unmatched))


def test_only_a_person_applies_moves_or_gives_back_a_rule_s_tasks(new_story):
    story = new_story(fixture=CartRule)
    for subcommand_name in ("apply", "reassign", "give-back"):
        story.expect_refusal(f"assign-rule {subcommand_name} {CART_RULE} --confirm {ENVIRONMENT}", "only a person writes rules", actor=story.agent)
    story.expect_rows(assignees(story, 1) == [story.agent.id], detail=assignees(story, 1))
