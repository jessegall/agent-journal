
from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, recorded_decision, rule_line, task_assignments
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson

TASK_ID = 1






def test_a_task_that_meets_a_rule_is_given_to_the_target_with_the_rule_on_the_assignment(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(rule_line("title has_word cart"), actor=story.user)
    decision = recorded_decision(story, TASK_ID)
    given = task_assignments(story, TASK_ID)
    story.expect_rows(decision.outcome == "assigned", decision.rule_id == rule_id, f"rule {rule_id} applied: given to the main agent" in decision.reason,
                      [row.actor_id for row in given] == [story.agent.id], given[0].rule_id == rule_id, detail=str(given))


def test_a_task_judged_twice_gets_one_assignment(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.run(rule_line("any"), actor=story.user)
    first = recorded_decision(story, TASK_ID)
    second = recorded_decision(story, TASK_ID)
    story.expect_rows(first == second, len(task_assignments(story, TASK_ID)) == 1, detail=str(task_assignments(story, TASK_ID)))


def test_rules_and_try_work_after_rules_assign(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(rule_line("title has_word cart"), actor=story.user)
    story.expect_text(f"assign-rule try {TASK_ID} --rule {rule_id} {ENVIRONMENT}", f"rule {rule_id} matches task {TASK_ID}", actor=story.user)
    story.expect_text(f"assign-rule disable {rule_id} {ENVIRONMENT}", "enabled: False", actor=story.user)
    story.expect_rows(recorded_decision(story, TASK_ID).outcome == "unmatched", task_assignments(story, TASK_ID) == [])
