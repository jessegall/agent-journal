import json

from tests.stories.core.modules.assign_rules.support.rule_steps import ENVIRONMENT, make_line
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson

TASK_ID = 1


def decision_of(story, task_id: int) -> dict:
    return json.loads(story.run(f"assign-decision record {task_id} --json {ENVIRONMENT}", actor=story.user).output_text.splitlines()[0])


def task_assignments(story) -> list[dict]:
    rows = json.loads(story.run("assignment list --json --limit 200", actor=story.user).output_text)["rows"]
    return [row for row in rows if row["subject_model"] == "task" and row["subject_id"] == TASK_ID]


def test_a_task_that_meets_a_rule_gets_a_dry_run_naming_the_rule_and_the_target(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(make_line("title has_word cart"), actor=story.user)
    holder_before = json.loads(story.run(f"task show {TASK_ID} --json", actor=story.user).output_text)["holder_id"]
    decision = decision_of(story, TASK_ID)
    holder_after = json.loads(story.run(f"task show {TASK_ID} --json", actor=story.user).output_text)["holder_id"]
    story.expect_rows(decision["outcome"] == "dry_run", decision["rule_id"] == rule_id, f"rule {rule_id}" in decision["reason"], "the main agent" in decision["reason"],
                      holder_after == holder_before, detail=str(decision))


def test_a_dry_run_never_partly_assigns_the_task(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    assignments_before = task_assignments(story)
    story.run(make_line("any"), actor=story.user)
    decision = decision_of(story, TASK_ID)
    story.expect_rows(decision["outcome"] == "dry_run", decision["actor_id"] == story.agent.id, task_assignments(story) == assignments_before, detail=str(task_assignments(story)))


def test_rules_and_try_work_before_rules_assign(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(make_line("title has_word cart"), actor=story.user)
    story.expect_text(f"assign-rule try {TASK_ID} --rule {rule_id} {ENVIRONMENT}", f"rule {rule_id} matches task {TASK_ID}", actor=story.user)
    story.expect_text(f"assign-rule disable {rule_id} {ENVIRONMENT}", "enabled: False", actor=story.user)
    story.expect_rows(decision_of(story, TASK_ID)["outcome"] == "unmatched")
