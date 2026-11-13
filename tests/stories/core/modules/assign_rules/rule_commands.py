import json

from tests.stories.core.modules.assign_rules.support.rule_steps import COMPLEXITY_RULE, ENVIRONMENT, MIGRATION_RULE, TwoPersonRules, condition_values, rule_line, rule_places
from tests.stories.core.support.coding_fixtures import OrchestratorWithPerson


def test_a_rule_with_no_condition_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_refusal(rule_line(), "a rule needs at least one condition", actor=story.user)
    story.expect_rows(rule_places(story) == {})


def test_the_condition_any_task_is_accepted(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(rule_line("any"), actor=story.user)
    story.expect_text(f"assign-rule-condition list --rule {rule_id}", "any", actor=story.user)


def test_the_51st_rule_of_an_environment_is_refused_naming_the_limit(new_story):
    story = new_story(fixture=TwoPersonRules)
    for _ in range(48):
        story.run(rule_line("any"), actor=story.user)
    story.expect_refusal(rule_line("any"), "at most 50 rules", actor=story.user)
    story.expect_rows(len(rule_places(story)) == 50)


def test_the_9th_condition_of_a_rule_is_refused_naming_the_limit(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_refusal(rule_line(*(f"tag has word-{number}" for number in range(9))), "at most 8 conditions", actor=story.user)
    story.expect_success(rule_line(*(f"tag has word-{number}" for number in range(8))), actor=story.user)


def test_a_word_over_40_characters_is_refused_naming_the_limit(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_refusal(rule_line(f"title has_word {'a' * 41}"), "at most 40 characters", actor=story.user)


def test_a_phrase_of_more_than_5_words_is_refused_naming_the_limit(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_refusal(rule_line("brief has_word one two three four five six"), "at most 5 words", actor=story.user)
    story.expect_success(rule_line("brief has_word one two three four five"), actor=story.user)


def test_an_empty_word_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_refusal(rule_line("title has_word"), "the word to look for is empty", actor=story.user)


def test_a_word_of_only_punctuation_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_refusal(rule_line("text lacks_word ?!..."), "has no letter or digit", actor=story.user)


def test_letters_of_any_language_are_kept_as_written(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    rule_id = story.new_row_id(rule_line("title has_word Миграция", "brief has_word Ünïcode 数据"), actor=story.user)
    story.expect_rows(condition_values(story, rule_id) == ["Миграция", "Ünïcode 数据"], detail=str(condition_values(story, rule_id)))


def test_a_person_edits_a_rule_target_and_conditions(new_story):
    story = new_story(fixture=TwoPersonRules)
    story.expect_success(f'assign-rule edit {COMPLEXITY_RULE} --condition "complexity minimum 2" --condition "complexity maximum 4" {ENVIRONMENT}', actor=story.user)
    story.expect_rows(condition_values(story, COMPLEXITY_RULE) == ["2", "4"], detail=str(condition_values(story, COMPLEXITY_RULE)))
    story.expect_refusal(f"assign-rule edit {COMPLEXITY_RULE} --target agent {ENVIRONMENT}", "names the agent", actor=story.user)


def test_a_person_moves_a_rule_and_the_places_stay_without_gaps(new_story):
    story = new_story(fixture=TwoPersonRules)
    third = story.new_row_id(rule_line("any"), actor=story.user)
    story.expect_success(f"assign-rule move {third} --to 1 {ENVIRONMENT}", actor=story.user)
    story.expect_rows(rule_places(story) == {third: 1, COMPLEXITY_RULE: 2, MIGRATION_RULE: 3}, detail=str(rule_places(story)))
    story.expect_success(f"assign-rule move {third} --to 3 {ENVIRONMENT}", actor=story.user)
    story.expect_rows(rule_places(story) == {COMPLEXITY_RULE: 1, MIGRATION_RULE: 2, third: 3}, detail=str(rule_places(story)))


def test_a_person_turns_a_rule_off_and_on(new_story):
    story = new_story(fixture=TwoPersonRules)
    story.expect_text(f"assign-rule disable {MIGRATION_RULE} {ENVIRONMENT}", "enabled: False", actor=story.user)
    story.expect_text(f"assign-rule enable {MIGRATION_RULE} {ENVIRONMENT}", "enabled: True", actor=story.user)
    story.expect_refusal(f"assign-rule enable {MIGRATION_RULE} {ENVIRONMENT}", f"rule {MIGRATION_RULE} is on already", actor=story.user)


def test_a_person_deletes_a_rule_and_the_gap_closes(new_story):
    story = new_story(fixture=TwoPersonRules)
    story.expect_success(f"assign-rule delete {COMPLEXITY_RULE} {ENVIRONMENT}", actor=story.user)
    story.expect_rows(rule_places(story) == {MIGRATION_RULE: 1}, condition_values(story, COMPLEXITY_RULE) == [], detail=str(rule_places(story)))


def test_trying_a_saved_rule_names_each_condition_and_assigns_nothing(new_story):
    story = new_story(fixture=TwoPersonRules)
    story.expect_success("task edit 1 --complexity 5", actor=story.agent)
    decision_list = story.run("assign-decision list --json", actor=story.user).output_text
    story.expect_text(f"assign-rule try 1 --rule {COMPLEXITY_RULE} {ENVIRONMENT}", f"rule {COMPLEXITY_RULE} matches task 1", "complexity minimum 4: met", actor=story.user)
    story.expect_text(f"assign-rule try 1 --rule {MIGRATION_RULE} {ENVIRONMENT}", f"rule {MIGRATION_RULE} does not match task 1", "title has_word migration: missed", actor=story.user)
    story.expect_rows(story.run("assign-decision list --json", actor=story.user).output_text == decision_list)


def test_trying_unsaved_conditions_saves_no_rule(new_story):
    story = new_story(fixture=OrchestratorWithPerson)
    story.expect_text(f'assign-rule try 1 --condition "title has_word cart" --condition "creator is_person" {ENVIRONMENT}', "the rule does not match task 1", "title has_word cart: met", "creator is_person: missed", actor=story.user)
    story.expect_rows(rule_places(story) == {})


def test_a_rule_belongs_to_the_environment_it_was_made_in(new_story):
    story = new_story(fixture=TwoPersonRules)
    story.expect_success("environment make second /work/second", actor=story.user)
    second_rule = story.new_row_id('assign-rule make --target main --condition any --environment second', actor=story.user)
    second_rows = json.loads(story.run("assign-rule list --json --environment second", actor=story.user).output_text)["rows"]
    story.expect_rows([(row["id"], row["position"]) for row in second_rows] == [(second_rule, 1)], second_rule not in rule_places(story), detail=str(second_rows))


def test_an_agent_that_writes_a_rule_is_refused(new_story):
    story = new_story(fixture=TwoPersonRules)
    story.expect_refusal(rule_line("any"), "only a person writes rules", actor=story.agent)
    story.expect_rows(len(rule_places(story)) == 2)
