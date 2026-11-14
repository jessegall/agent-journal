import json

from engine.testing.stories.story import Story
from tests.stories.core.modules.assign_rules.support.given_row import GivenRow
from tests.stories.core.modules.assign_rules.support.rule_steps import COMPLEXITY_RULE, ENVIRONMENT, MIGRATION_RULE, new_task, TwoPersonRules, rule_line


def decisions(story: Story) -> str:
    return story.run(f"assign-decision list --json {ENVIRONMENT}", actor=story.user).output_text


def test_task_info_names_the_rule_that_gave_the_task(new_story):
    story = new_story(fixture=TwoPersonRules)
    task_id = new_task(story, '"Rework the checkout" --complexity 5')
    story.expect_text(f"task info {task_id} {ENVIRONMENT}", f"assigned to: agent {story.agent.id} by rule {COMPLEXITY_RULE}: complexity is at least 4", actor=story.agent)


def test_why_shows_the_last_decision_and_what_the_rules_would_do_now_and_changes_nothing(new_story):
    story = new_story(fixture=TwoPersonRules)
    task_id = new_task(story, '"Water the plants"')
    rule_id = story.new_row_id(rule_line("title has_word plants"), actor=story.user)
    listed_first = decisions(story)
    story.expect_text(f"assign-rule why {task_id} {ENVIRONMENT}", "decided: unmatched: no rule matches", f"now: rule {rule_id} would give it to the main agent", actor=story.user)
    story.expect_rows(decisions(story) == listed_first, detail=decisions(story))


def test_why_says_a_rule_gives_a_task_once(new_story):
    story = new_story(fixture=TwoPersonRules)
    task_id = new_task(story, '"Plan the migration"')
    story.expect_text(f"assign-rule why {task_id} {ENVIRONMENT}", f"decided: assigned: rule {MIGRATION_RULE} applied: given to the main agent",
                      "now: a rule gave the task already, and a rule gives a task once", actor=story.user)


def test_the_main_agent_hears_that_a_rule_gave_it_a_task(new_story):
    story = new_story(fixture=TwoPersonRules)
    task_id = new_task(story, '"Fix the migration script"')
    story.expect_text(f"agent-line list --agent {story.agent.id} {ENVIRONMENT}", f"task:{task_id} is yours by rule {MIGRATION_RULE}", actor=story.user)


def test_the_assignments_of_an_agent_name_the_rule_of_each_task(new_story):
    story = new_story(fixture=TwoPersonRules)
    first = new_task(story, '"Rebuild the shop" --complexity 4')
    second = new_task(story, '"Check the migration"')
    listed = json.loads(story.run(f"assignment list --subject-model task --actor {story.agent.id} --oldest --json {ENVIRONMENT}", actor=story.user).output_text)["rows"]
    rules = {given.task_id: given.rule_id for given in (GivenRow.parsed(row) for row in listed)}
    story.expect_rows(rules == {first: COMPLEXITY_RULE, second: MIGRATION_RULE}, detail=str(listed))
