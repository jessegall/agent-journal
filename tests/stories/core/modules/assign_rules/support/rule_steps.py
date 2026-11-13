import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson

ENVIRONMENT = "--environment main"
COMPLEXITY_RULE = 1
MIGRATION_RULE = 2


def make_line(*conditions: str, target: str = "main") -> str:
    flags = " ".join(f"--condition {json.dumps(condition, ensure_ascii=False)}" for condition in conditions)
    return f"assign-rule make --target {target} {flags} {ENVIRONMENT}"


def rule_places(story: Story) -> dict[int, int]:
    rows = json.loads(story.run(f"assign-rule list --json --limit 60 {ENVIRONMENT}", actor=story.user).output_text)["rows"]
    return {row["id"]: row["position"] for row in rows}


def condition_values(story: Story, rule_id: int) -> list[str]:
    rows = json.loads(story.run(f"assign-rule-condition list --rule {rule_id} --oldest --json", actor=story.user).output_text)["rows"]
    return [row["value"] for row in rows]


class PersonWithTwoRules(StoryFixture):
    """Ada, a person, made two rules for the main agent in main: rule 1 'complexity minimum 4' and rule 2 'title has_word migration'."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.run(make_line("complexity minimum 4"), actor=story.user)
        story.run(make_line("title has_word migration"), actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_rows(rule_places(story) == {COMPLEXITY_RULE: 1, MIGRATION_RULE: 2}, detail=str(rule_places(story)))


class PersonRulesAndWorker(StoryFixture):
    """Ada's two rules for the main agent, and a worker, session w-1, under the main agent: story.helper."""

    parent = PersonWithTwoRules

    def steps(self, story: Story) -> None:
        story.helper = Actor(story.new_row_id(f"agent start w-1 claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)

    def expect(self, story: Story) -> None:
        story.expect_text(f"agent show {story.helper.id}", "w-1")
