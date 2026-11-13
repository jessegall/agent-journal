from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.assign_rules.support.rule_seeds import AgentRuleSeed, RuleConditionSeed
from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, listed_decisions, new_task, rule_line, task_assignments
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson
from tests.stories.engine.driver.support.hook_agents import hook_agent

RETRY_TICK = "assign rules retry"
MISSING_AGENT_ID = 999


class MainAgentEnded(StoryFixture):
    """Ada's rule 1 gives any task to the main agent, and the main agent, session s-1, has ended."""

    parent = OrchestratorWithPerson

    def steps(self, story: Story) -> None:
        story.run(rule_line("any"), actor=story.user)
        story.run(f"agent end {story.agent.id}")

    def expect(self, story: Story) -> None:
        story.expect_text(f"agent show {story.agent.id}", "ended")


def test_a_failing_judge_leaves_the_task_made_and_free_with_a_failed_decision(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(rule_line("any"), actor=story.user)
    story.seed(RuleConditionSeed, 1, rule_id=rule_id, field="title", operator="broken")
    task_id = new_task(story, "Fix the scale")
    decisions = listed_decisions(story, task_id)
    story.expect_rows([decision.outcome for decision in decisions] == ["failed"], [row.actor_id for row in task_assignments(story, task_id)] == [], detail=str(decisions))
    story.expect_text(f"task show {task_id} {ENVIRONMENT}", "state: open", actor=story.user)


def test_a_rule_skipped_for_a_missing_target_applies_when_a_main_agent_starts(new_story):
    story = new_story(fixture=MainAgentEnded)
    task_id = new_task(story, "Fix the till")
    skipped = listed_decisions(story, task_id)
    main = hook_agent(story, story.hook("s-9", HookSamples.session_start()))
    story.run_listeners()
    given = listed_decisions(story, task_id)
    story.expect_rows("no main agent runs" in skipped[0].reason, given[0].outcome == "assigned", given[0].actor_id == main.id, detail=str((skipped, given)))


def test_the_tick_gives_a_skipped_task_once_its_target_can_take_it(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.run(rule_line("any").replace("--target main", "--target main --queue-limit 1"), actor=story.user)
    started_task, waiting_task = new_task(story, "Fix the shelf"), new_task(story, "Fix the rack")
    story.expect_success(f"task start {started_task} {ENVIRONMENT}", actor=story.agent)
    story.expect_success(f'task close {started_task} --outcome "done" {ENVIRONMENT}', actor=story.agent)
    story.run_tick_handler(RETRY_TICK)
    decision = listed_decisions(story, waiting_task)[0]
    story.expect_rows(decision.outcome == "assigned", decision.actor_id == story.agent.id, detail=str(decision))


def test_a_task_a_stop_left_with_no_decision_is_judged_once_by_the_tick(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(rule_line("any"), actor=story.user)
    story.run(f"assign-rule disable {rule_id} {ENVIRONMENT}", actor=story.user)
    task_id = new_task(story, "Fix the door")
    story.run(f"assign-rule enable {rule_id} {ENVIRONMENT}", actor=story.user)
    undecided = listed_decisions(story, task_id)
    story.advance(timedelta(minutes=2))
    story.run_tick_handler(RETRY_TICK)
    first = listed_decisions(story, task_id)
    story.run_tick_handler(RETRY_TICK)
    story.expect_rows(undecided == [], [decision.outcome for decision in first] == ["assigned"], listed_decisions(story, task_id) == first,
                      [row.actor_id for row in task_assignments(story, task_id)] == [story.agent.id], detail=str(first))


def test_the_same_task_judged_twice_changes_nothing_the_second_time(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.run(rule_line("any"), actor=story.user)
    task_id = new_task(story, "Fix the lamp")
    first = listed_decisions(story, task_id)
    story.run(f"assign-decision record {task_id} {ENVIRONMENT}", actor=story.user)
    story.expect_rows(listed_decisions(story, task_id) == first, [row.actor_id for row in task_assignments(story, task_id)] == [story.agent.id], detail=str(first))


def test_a_rule_whose_agent_row_is_gone_is_skipped_and_shown_broken_and_the_next_rule_applies(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    missing_agent_rule = story.seed(AgentRuleSeed, 1, environment_id=1, creator_id=story.user.id, position=1, target_agent_id=MISSING_AGENT_ID)[0]
    story.seed(RuleConditionSeed, 1, rule_id=missing_agent_rule, field="any", operator="any")
    main_rule = story.new_row_id(rule_line("any"), actor=story.user)
    task_id = new_task(story, "Fix the clock")
    decision = listed_decisions(story, task_id)[0]
    story.expect_rows(decision.rule_id == main_rule, f"rule {missing_agent_rule} skipped: the agent of rule {missing_agent_rule} is gone" in decision.reason, detail=str(decision))
    story.expect_text(f"assign-rule board {ENVIRONMENT}", "its agent is gone", actor=story.user)


def test_each_task_of_a_retry_batch_gets_its_own_decision(new_story):
    story = new_story(fixture=MainAgentEnded)
    story.run(f"assign-rule edit 1 --queue-limit 1 {ENVIRONMENT}", actor=story.user)
    first_task, second_task = new_task(story, "Fix the gate"), new_task(story, "Fix the fence")
    main = hook_agent(story, story.hook("s-9", HookSamples.session_start()))
    story.run_listeners()
    decisions = [listed_decisions(story, first_task)[0], listed_decisions(story, second_task)[0]]
    story.expect_rows(decisions[0].actor_id == main.id, decisions[1].outcome == "skipped", "holds 1 of 1" in decisions[1].reason, detail=str(decisions))
