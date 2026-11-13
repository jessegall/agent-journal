import json

from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, make_line
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson

TASK_ID = 1
RULES_MODULE = "journal.core.assign_rules"


def decision_of(story, task_id: int) -> dict:
    return json.loads(story.run(f"assign-decision record {task_id} --json {ENVIRONMENT}", actor=story.user).output_text.splitlines()[0])


def task_assignments(story) -> list[dict]:
    rows = json.loads(story.run("assignment list --json --limit 200", actor=story.user).output_text)["rows"]
    return [row for row in rows if row["subject_model"] == "task" and row["subject_id"] == TASK_ID]


def test_a_task_that_meets_a_rule_is_given_to_the_target_with_the_rule_on_the_assignment(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(make_line("title has_word cart"), actor=story.user)
    decision = decision_of(story, TASK_ID)
    given = task_assignments(story)
    story.expect_rows(decision["outcome"] == "assigned", decision["rule_id"] == rule_id, f"rule {rule_id} applied: given to the main agent" in decision["reason"],
                      [row["actor_id"] for row in given] == [story.agent.id], given[0]["metadata"].get(RULES_MODULE) == {"rule": rule_id}, detail=str(given))


def test_a_task_judged_twice_gets_one_assignment(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.run(make_line("any"), actor=story.user)
    first = decision_of(story, TASK_ID)
    second = decision_of(story, TASK_ID)
    story.expect_rows(first == second, len(task_assignments(story)) == 1, detail=str(task_assignments(story)))


def test_rules_and_try_work_after_rules_assign(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(make_line("title has_word cart"), actor=story.user)
    story.expect_text(f"assign-rule try {TASK_ID} --rule {rule_id} {ENVIRONMENT}", f"rule {rule_id} matches task {TASK_ID}", actor=story.user)
    story.expect_text(f"assign-rule disable {rule_id} {ENVIRONMENT}", "enabled: False", actor=story.user)
    story.expect_rows(decision_of(story, TASK_ID)["outcome"] == "unmatched", task_assignments(story) == [])
