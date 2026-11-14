from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, SonnetWorkerAndFreeTask, new_task, task_assignments, task_decision

SONNET_RULE = 1


class SonnetRule(StoryFixture):
    """Beside the sonnet worker, Ada's rule 1 gives a task tagged backend to the workers of claude sonnet."""

    parent = SonnetWorkerAndFreeTask

    def steps(self, story: Story) -> None:
        story.run(f"assign-rule make --target model --program claude --model sonnet --condition \"tag has backend\" {ENVIRONMENT}", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text(f"assign-rule list {ENVIRONMENT}", "sonnet", actor=story.user)


def routed_task(story: Story, program: str) -> tuple[int, int]:
    route_id = story.new_row_id(f"worker-route make --program {program} --tags backend {ENVIRONMENT}", actor=story.agent)
    return route_id, new_task(story, '"Fix the backend cache" --tag backend --confirm')


def test_a_route_to_another_program_skips_the_rule_and_the_decision_names_the_route(new_story):
    story = new_story(fixture=SonnetRule)
    route_id, task_id = routed_task(story, "codex")
    decision = task_decision(story, task_id)
    story.expect_rows(decision.outcome == "skipped", decision.rule_id == SONNET_RULE, f"rule {SONNET_RULE} skipped: task {task_id} goes to codex by route {route_id}" in decision.reason,
                      task_assignments(story, task_id) == [], detail=str(decision))


def test_a_route_to_the_rule_s_own_program_lets_the_rule_assign(new_story):
    story = new_story(fixture=SonnetRule)
    _, task_id = routed_task(story, "claude")
    decision = task_decision(story, task_id)
    story.expect_rows(decision.outcome == "assigned", [row.actor_id for row in task_assignments(story, task_id)] == [story.helper.id], detail=str(decision))


def test_a_task_no_route_matches_is_assigned_by_the_rule(new_story):
    story = new_story(fixture=SonnetRule)
    task_id = new_task(story, '"Fix the backend queue" --tag backend --confirm')
    story.expect_rows([row.actor_id for row in task_assignments(story, task_id)] == [story.helper.id], detail=str(task_decision(story, task_id)))
