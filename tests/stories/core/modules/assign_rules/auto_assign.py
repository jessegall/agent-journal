import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType

from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import COMPLEXITY_RULE, ENVIRONMENT, MIGRATION_RULE, PersonWithTwoRules, SonnetWorkerAndFreeTask, make_line
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson

RULES_MODULE = "journal.core.assign_rules"
FIRST_RULE = 1
SECOND_RULE = 2


def new_task(story: Story, flags: str) -> int:
    return story.new_row_id(f"task make {flags} {ENVIRONMENT}", actor=story.user)


def decision_of(story: Story, task_id: int) -> dict:
    rows = json.loads(story.run(f"assign-decision list --task {task_id} --json {ENVIRONMENT}", actor=story.user).output_text)["rows"]
    assert len(rows) == 1, rows
    return rows[0]


def task_assignments(story: Story, task_id: int) -> list[dict]:
    rows = json.loads(story.run("assignment list --json --limit 200", actor=story.user).output_text)["rows"]
    return [row for row in rows if row["subject_model"] == "task" and row["subject_id"] == task_id]


class WorkerAndMainRules(StoryFixture):
    """Beside the sonnet worker, Ada's rule 1 gives a checkout task to that worker and rule 2 gives it to the main agent."""

    parent = SonnetWorkerAndFreeTask

    def steps(self, story: Story) -> None:
        story.run(f'assign-rule make --target agent --agent row:{story.helper.id} --condition "title has_word checkout" {ENVIRONMENT}', actor=story.user)
        story.run(make_line("title has_word checkout"), actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text(f"assign-rule list {ENVIRONMENT}", "agent", "main", actor=story.user)


class RetiredWorkerAndMainRule(StoryFixture):
    """Ada's rule 1 gives any task to worker w-9, which ended and was retired: story.helper; rule 2 gives any task to
    the main agent."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.helper = Actor(story.new_row_id(f"agent start w-9 claude worker --parent {story.agent.id} {ENVIRONMENT}"), ActorType.AGENT)
        story.run(f"assign-rule make --target agent --agent row:{story.helper.id} --condition any {ENVIRONMENT}", actor=story.user)
        story.run(f"agent end {story.helper.id}")
        story.run(f'agent retire {agent_number(story, story.helper.id)} --reason "not needed"', actor=story.user)
        story.run(make_line("any"), actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text(f"assign-rule list {ENVIRONMENT}", "main", actor=story.user)


class BackendRule(StoryFixture):
    """Ada's rule 1 gives a task tagged backend to the main agent."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.run(make_line("tag has backend"), actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text(f"assign-rule list {ENVIRONMENT}", "main", actor=story.user)


def test_a_new_task_that_meets_a_rule_is_given_at_once_with_the_rule_on_the_assignment(new_story):
    story = new_story(fixture=PersonWithTwoRules)
    task_id = new_task(story, '"Rework the checkout" --complexity 5')
    decision, given = decision_of(story, task_id), task_assignments(story, task_id)
    story.expect_rows(decision["outcome"] == "assigned", decision["rule_id"] == COMPLEXITY_RULE, f"rule {COMPLEXITY_RULE} applied: given to the main agent" in decision["reason"],
                      [row["actor_id"] for row in given] == [story.agent.id], given[0]["metadata"].get(RULES_MODULE) == {"rule": COMPLEXITY_RULE},
                      given[0]["creator_id"] != story.user.id, detail=str((decision, given)))


def test_the_first_rule_wins_and_the_decision_names_the_others_that_matched(new_story):
    story = new_story(fixture=WorkerAndMainRules)
    task_id = new_task(story, '"Fix the checkout"')
    decision = decision_of(story, task_id)
    story.expect_rows(decision["outcome"] == "assigned", decision["rule_id"] == FIRST_RULE, decision["actor_id"] == story.helper.id,
                      f"also matched: rule {SECOND_RULE}" in decision["reason"], detail=str(decision))


def test_a_rule_whose_worker_is_retired_is_skipped_and_the_next_rule_applies(new_story):
    story = new_story(fixture=RetiredWorkerAndMainRule)
    task_id = new_task(story, '"Fix the login"')
    decision = decision_of(story, task_id)
    expected = f"rule {FIRST_RULE} skipped: worker {agent_number(story, story.helper.id)} is retired; rule {SECOND_RULE} applied: given to the main agent"
    story.expect_rows(decision["outcome"] == "assigned", decision["rule_id"] == SECOND_RULE, decision["reason"] == expected, detail=str(decision))


def test_a_tag_added_later_gets_the_task_judged_again_and_assigned(new_story):
    story = new_story(fixture=BackendRule)
    task_id = new_task(story, '"Fix the cache"')
    unmatched = decision_of(story, task_id)
    story.expect_success(f"task tag {task_id} backend --confirm {ENVIRONMENT}", actor=story.user)
    decision = decision_of(story, task_id)
    story.expect_rows(unmatched["outcome"] == "unmatched", decision["outcome"] == "assigned", decision["id"] == unmatched["id"],
                      [row["actor_id"] for row in task_assignments(story, task_id)] == [story.agent.id], detail=str((unmatched, decision)))


def test_a_tag_taken_off_gets_the_task_judged_again(new_story):
    story = new_story(fixture=BackendRule)
    rule_id = story.new_row_id(make_line("tag lacks frontend"), actor=story.user)
    task_id = new_task(story, '"Fix the font" --tag frontend --confirm')
    unmatched = decision_of(story, task_id)
    story.expect_success(f"task untag {task_id} frontend {ENVIRONMENT}", actor=story.user)
    decision = decision_of(story, task_id)
    story.expect_rows(unmatched["outcome"] == "unmatched", decision["outcome"] == "assigned", decision["rule_id"] == rule_id, detail=str((unmatched, decision)))


def test_a_rule_gives_a_task_once_in_its_life(new_story):
    story = new_story(fixture=PersonWithTwoRules)
    task_id = new_task(story, '"Plan the migration"')
    story.expect_success(f"task start {task_id} {ENVIRONMENT}", actor=story.agent)
    story.expect_success(f'task release {task_id} --reason "the main agent gives it back" {ENVIRONMENT}', actor=story.agent)
    story.expect_success(f"task edit {task_id} --complexity 5 {ENVIRONMENT}", actor=story.user)
    decision = decision_of(story, task_id)
    story.expect_rows(decision["outcome"] == "assigned", decision["rule_id"] == MIGRATION_RULE, task_assignments(story, task_id) == [], detail=str((decision, task_assignments(story, task_id))))
