import pytest

from tests.stories.core.modules.assign_rules.support.rule_steps import COMPLEXITY_RULE, ENVIRONMENT, MIGRATION_RULE, PersonRulesAndWorker, make_line, rule_places

PERSON_ONLY = "only a person writes rules"
LONG_BRIEF_WORDS = 20_000


def test_a_worker_that_makes_a_rule_is_refused(new_story):
    story = new_story(fixture=PersonRulesAndWorker)
    story.expect_refusal(make_line("any"), PERSON_ONLY, actor=story.helper)
    story.expect_rows(len(rule_places(story)) == 2)


@pytest.mark.parametrize("line", [
    f"assign-rule edit {COMPLEXITY_RULE} --condition any",
    f"assign-rule move {MIGRATION_RULE} --to 1",
    f"assign-rule disable {COMPLEXITY_RULE}",
    f"assign-rule enable {MIGRATION_RULE}",
    f"assign-rule delete {COMPLEXITY_RULE}",
])
def test_the_main_agent_cannot_change_a_rule_it_would_be_the_target_of(new_story, line):
    story = new_story(fixture=PersonRulesAndWorker)
    story.expect_refusal(f"{line} {ENVIRONMENT}", PERSON_ONLY, actor=story.agent)
    story.expect_rows(rule_places(story) == {COMPLEXITY_RULE: 1, MIGRATION_RULE: 2}, detail=str(rule_places(story)))


def test_the_main_agent_and_a_worker_read_and_try_rules(new_story):
    story = new_story(fixture=PersonRulesAndWorker)
    for agent in (story.agent, story.helper):
        story.expect_text(f"assign-rule list {ENVIRONMENT}", "main", actor=agent)
        story.expect_text(f"assign-rule show {COMPLEXITY_RULE} {ENVIRONMENT}", "position: 1", actor=agent)
        story.expect_text(f"assign-rule try 1 --rule {MIGRATION_RULE} {ENVIRONMENT}", f"rule {MIGRATION_RULE} does not match task 1", actor=agent)


def test_there_is_no_pattern_language_and_a_long_phrase_is_refused(new_story):
    story = new_story(fixture=PersonRulesAndWorker)
    story.expect_refusal(make_line("title has_word .* | (a b c d e f)"), "at most 5 words", actor=story.user)


def test_a_brief_of_100000_characters_is_judged_in_one_pass(new_story):
    story = new_story(fixture=PersonRulesAndWorker)
    brief = "word " * LONG_BRIEF_WORDS + "migration"
    task_id = story.new_row_id(f'task make "A long brief" --brief "{brief}" {ENVIRONMENT}', actor=story.agent)
    story.expect_text(f'assign-rule try {task_id} --condition "brief has_word migration" --condition "brief lacks_word cart" {ENVIRONMENT}',
                      f"the rule matches task {task_id}", "brief has_word migration: met", "brief lacks_word cart: met", actor=story.user)
