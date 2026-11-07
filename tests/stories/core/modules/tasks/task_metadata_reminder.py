import pytest

from tests.stories.core.support.coding_fixtures import BuilderWithUser


@pytest.fixture
def story(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success('task make "Existing" --tag networking --tag linux --confirm --complexity 2 --environment main', actor=story.user)
    return story


def test_a_task_missing_both_names_matching_tags_and_both_commands(story):
    result = story.run('task make "Fix networking on linux" --environment main', actor=story.agent)
    story.expect_rows(result.code == 0, "needs tags and complexity" in result.output_text,
                      "journal task tag 2 linux networking" in result.output_text,
                      "journal task edit 2 --complexity <1-5>" in result.output_text)


def test_a_task_with_only_tags_asks_for_complexity(story):
    result = story.run('task make "Fix networking" --tag networking --environment main', actor=story.agent)
    story.expect_rows("needs complexity" in result.output_text, "journal task edit 2 --complexity <1-5>" in result.output_text,
                      "journal task tag" not in result.output_text)


def test_a_task_with_only_a_score_asks_for_tags(story):
    result = story.run('task make "Fix networking" --complexity 3 --environment main', actor=story.agent)
    story.expect_rows("needs tags" in result.output_text, "journal task tag 2 networking" in result.output_text,
                      "journal task edit" not in result.output_text)


def test_a_complete_task_has_no_reminder(story):
    result = story.run('task make "Fix networking" --tag networking --complexity 3 --environment main', actor=story.agent)
    story.expect_rows("needs tags" not in result.output_text, "needs complexity" not in result.output_text)


def test_a_person_receives_no_reminder(story):
    result = story.run('task make "Fix networking" --environment main', actor=story.user)
    story.expect_rows("needs tags" not in result.output_text, "needs complexity" not in result.output_text)
