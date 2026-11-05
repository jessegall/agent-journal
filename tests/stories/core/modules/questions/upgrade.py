import re

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text, expect_upgrade_without_text
from tests.stories.support.story_checks import expect_value_4


def test_an_answered_question_moves_with_its_options_answer_and_asking_agent_from_version_4_questions(new_story):
    story = upgraded_story(new_story)
    story.expect_success("question show 1", "question 1: Which database?", "choices: Postgres / SQLite", "state: answered")
    story.expect_text("question show 1 --json", '"answer": "SQLite"', '"recommended": "SQLite"')


def test_an_open_question_moves_open(new_story):
    story = upgraded_story(new_story)
    story.expect_success("question show 2", "question 2: Ship on Friday?", "state: open")
    expect_upgrade_text(story, "questions: moved 7")


def test_a_question_a_person_signed_moves_to_the_newest_main_agent(new_story):
    story = upgraded_story(new_story)
    story.expect_success("question show 7", "question 7: Which colour did version 3 ask?")
    expect_upgrade_without_text(story, "skipped questions 7")


def test_a_question_longer_than_version_5_allows_moves_whole_into_a_document_and_keeps_its_start(new_story):
    story = upgraded_story(new_story)
    question = story.run("question show 3").output_text
    document = re.search(r"whole text in doc (\d+)", question)
    expect_value_4(document)
    expect_upgrade_without(story, "skipped questions 3")
    expect_upgrade_text(story, "1 question texts longer than 500 characters moved whole into documents")
    expect_output_length_greater(story, f"doc show {document.group(1)} --all", 500)


def expect_output_length_greater(story, text, expected) -> None:
    actual = len(story.run(text).output_text)
    assert actual > expected, actual


def expect_upgrade_without(story, expected) -> None:
    actual = story.upgrade_text
    assert expected not in actual, actual
