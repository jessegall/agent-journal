import json
from collections.abc import Callable, Mapping
from typing import TypeVar

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.decision_row import DecisionRow
from tests.stories.core.modules.assign_rules.support.given_row import GivenRow
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

ENVIRONMENT = "--environment main"
COMPLEXITY_RULE = 1
MIGRATION_RULE = 2
FREE_TASK_ID = 2
ListedRow = TypeVar("ListedRow")


def rule_line(*conditions: str, target: str = "main") -> str:
    flags = " ".join(f"--condition {json.dumps(condition, ensure_ascii=False)}" for condition in conditions)
    return f"assign-rule make --target {target} {flags} {ENVIRONMENT}"


def rule_places(story: Story) -> dict[int, int]:
    rows = json.loads(story.run(f"assign-rule list --json --limit 60 {ENVIRONMENT}", actor=story.user).output_text)["rows"]
    return {row["id"]: row["position"] for row in rows}


def condition_values(story: Story, rule_id: int) -> list[str]:
    rows = json.loads(story.run(f"assign-rule-condition list --rule {rule_id} --oldest --json", actor=story.user).output_text)["rows"]
    return [row["value"] for row in rows]


def new_task(story: Story, flags: str) -> int:
    return story.new_row_id(f"task make {flags} {ENVIRONMENT}", actor=story.user)


def listed_rows(story: Story, line: str, parse: Callable[[Mapping[str, object]], ListedRow]) -> list[ListedRow]:
    return [parse(row) for row in json.loads(story.run(f"{line} --json {ENVIRONMENT}").output_text)["rows"]]


def listed_decisions(story: Story, task_id: int) -> list[DecisionRow]:
    return listed_rows(story, f"assign-decision list --task {task_id}", DecisionRow.parsed)


def task_decision(story: Story, task_id: int) -> DecisionRow:
    decisions = listed_decisions(story, task_id)
    assert len(decisions) == 1, decisions
    return decisions[0]


def recorded_decision(story: Story, task_id: int, environment: str = ENVIRONMENT) -> DecisionRow:
    return DecisionRow.parsed(json.loads(story.run(f"assign-decision record {task_id} --json {environment}").output_text.splitlines()[0]))


def task_assignments(story: Story, task_id: int) -> list[GivenRow]:
    return listed_rows(story, f"assignment list --subject-model task --subject {task_id}", GivenRow.parsed)


class TwoPersonRules(StoryFixture):
    """Ada, a person, made two rules for the main agent in main: rule 1 'complexity minimum 4' and rule 2 'title
    has_word migration'."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.run(rule_line("complexity minimum 4"), actor=story.user)
        story.run(rule_line("title has_word migration"), actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_rows(rule_places(story) == {COMPLEXITY_RULE: 1, MIGRATION_RULE: 2}, detail=rule_places(story))


class PersonRulesAndWorker(StoryFixture):
    """Ada's two rules for the main agent, rule 2 turned off, and a worker, session w-1, under the main agent:
    story.helper."""

    parent = TwoPersonRules

    def steps(self, story: Story) -> None:
        story.helper = Actor(story.new_row_id(f"agent start w-1 claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)
        story.run(f"assign-rule disable {MIGRATION_RULE} {ENVIRONMENT}", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text(f"agent show {story.helper.id}", "w-1")


class SonnetWorkerAndFreeTask(StoryFixture):
    """A worker on claude sonnet with a cut worktree holds task 1, story.helper; task 2, Fix the migration, is
    free."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        repository_environment(story)
        story.helper = dispatched_worker(story)
        story.run(f'task make "Fix the migration" {ENVIRONMENT}', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_text(f"task show {FREE_TASK_ID}", "Fix the migration")
