from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import COMPLEXITY_RULE, ENVIRONMENT, recorded_decision, SonnetWorkerAndFreeTask

SECOND = "--environment second"


class SecondEnvironment(StoryFixture):
    """Beside main, with its sonnet worker, free task 2 and Ada's rule 1 'complexity minimum 4', a second
    environment with a main agent of its own."""

    parent = SonnetWorkerAndFreeTask

    def steps(self, story: Story) -> None:
        story.run("environment make second /work/second", actor=story.user)
        story.run("agent start s-21 claude main --environment second")
        story.run(f'assign-rule make --target main --condition "complexity minimum 4" {ENVIRONMENT}', actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("assign-rule list --environment main", "main", actor=story.user)


def test_a_rule_for_an_agent_of_another_environment_is_refused_at_make_and_edit(new_story):
    story = new_story(fixture=SecondEnvironment)
    second_agent = story.new_row_id("agent start s-22 claude worker --environment second")
    story.expect_refusal(f"assign-rule make --target agent --agent row:{second_agent} --condition any {ENVIRONMENT}", f"no agent with row {second_agent} in environment main", actor=story.user)
    story.expect_refusal(f"assign-rule edit {COMPLEXITY_RULE} --target agent --agent row:{second_agent} {ENVIRONMENT}", f"no agent with row {second_agent} in environment main", actor=story.user)


def test_a_kind_rule_never_picks_a_worker_of_another_environment(new_story):
    story = new_story(fixture=SecondEnvironment)
    story.run(f"assign-rule make --target model --program claude --model sonnet --condition any {SECOND}", actor=story.user)
    task_id = story.new_row_id(f'task make "Second cart" {SECOND}', actor=story.user)
    decision = recorded_decision(story, task_id, SECOND)
    story.expect_rows(decision.outcome == "skipped", "no agent runs that program and model" in decision.reason, detail=str(decision))


def test_a_reason_names_rules_and_fields_and_no_text_of_a_task(new_story):
    story = new_story(fixture=SecondEnvironment)
    story.run(f'assign-rule make --target main --condition "title has_word secret" {SECOND}', actor=story.user)
    task_id = story.new_row_id(f'task make "Secret plans of main" --brief "a brief only main may read" {ENVIRONMENT}', actor=story.user)
    decision = recorded_decision(story, task_id, ENVIRONMENT)
    story.expect_rows(decision.outcome == "unmatched", not any(text in decision.reason.lower() for text in ("secret", "brief", "plans")), detail=str(decision))
