from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_steps import task_decision
from tests.stories.core.modules.plans.support.started_plans import ThreeStartedPlans
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.support.hand_outs import next_task_id, worker_next_task_id

RULE_TAG = "chores"


class ChoresRuleAndPortFocus(StoryFixture):
    """Beside three started plans, Ada's rule gives a task tagged chores to the main agent, and the main agent
    focuses plan 3, Port."""

    parent = ThreeStartedPlans

    def steps(self, story: Story) -> None:
        story.run(f'assign-rule make --target main --condition "tag has {RULE_TAG}" --environment main', actor=story.user)
        story.run("plan focus 3", actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_text("plan focus", "3", actor=story.agent)


def rule_task(story: Story, title: str) -> int:
    return story.new_row_id(f'task make "{title}" --tag {RULE_TAG} --confirm --environment main', actor=story.user)


def test_e3_a_task_a_rule_gave_comes_after_the_focus_and_before_the_other_plans(new_story):
    story = new_story(fixture=ChoresRuleAndPortFocus)
    chore = rule_task(story, "Sweep the yard")
    focus_first = next_task_id(story)
    for task_id in (5, 6):
        story.run(f'task block {task_id} --until-user --reason "Ada decides"', actor=story.user)
    story.expect_rows(task_decision(story, chore).outcome == "assigned", focus_first == 5, next_task_id(story) == chore, detail=str(task_decision(story, chore)))


def test_e4_a_rule_never_gives_a_plan_task_so_it_cannot_pull_the_agent_off_the_focus(new_story):
    story = new_story(fixture=ChoresRuleAndPortFocus)
    planned = story.new_row_id(f'task make "Paint the depot" --phase 2 --tag {RULE_TAG} --confirm --environment main', actor=story.user)
    decision = task_decision(story, planned)
    story.expect_rows(decision.outcome == "planned", decision.actor_id is None, next_task_id(story) == 5, detail=str(decision))


def test_e5_the_order_reads_tasks_reserved_through_the_assignments(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    for task_id in (1, 2, 3, 4, 5):
        story.run(f'task block {task_id} --until-user --reason "Ada decides"', actor=story.user)
    story.run("plan focus 3", actor=story.agent)
    story.expect_success(f"task assign 6 --to {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_rows(next_task_id(story) == 6, next_task_id(story, 6) is None)


def test_e6_a_plan_task_a_person_gives_the_main_agent_by_hand_counts_as_reserved_by_hand_and_waits_behind_the_other_plans(new_story):
    story = new_story(fixture=ChoresRuleAndPortFocus)
    story.expect_success(f"task assign 2 --to {agent_number(story, story.agent.id)}", actor=story.user)
    focus_first = next_task_id(story)
    for task_id in (5, 6):
        story.run(f'task block {task_id} --until-user --reason "Ada decides"', actor=story.user)
    story.expect_rows(focus_first == 5, next_task_id(story) == 1)


def test_a_worker_s_rule_task_comes_after_its_focus_work(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.run(f'assign-rule make --target agent --agent row:{worker.id} --condition "tag has {RULE_TAG}" --environment main', actor=story.user)
    chore = rule_task(story, "Oil the crane")
    story.expect_success(f"task assign 5 --to {agent_number(story, worker.id)}", actor=story.user)
    story.run("plan focus 3", actor=worker)
    story.expect_rows(task_decision(story, chore).actor_id == worker.id, worker_next_task_id(story, worker) == 5, detail=str(task_decision(story, chore)))
