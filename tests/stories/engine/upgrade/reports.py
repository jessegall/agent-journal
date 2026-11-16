from install.version_four.upgrade_journal import UpgradeJournal
from tests.stories.engine.upgrade.support.move_samples import PATH
from tests.stories.support.story_checks import expect_value_with

NOTES, TAGS, RETRYABLE_TAGS = f"{PATH}:NotesModule", f"{PATH}:TagsModule", f"{PATH}:RetryableTagsModule"


def test_the_first_start_after_an_upgrade_shows_one_chat_mark_with_the_counts_and_a_second_start_shows_none(new_story):
    from tests.stories.core.modules.chat.support.mark_samples import expect_mark_count, mark_count, marks_text
    from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story

    story = upgraded_story(new_story)
    story.run_listeners()
    expect_mark_count_minimum(mark_count, story, 1)
    text = marks_text(story)
    expect_value_with(text, "Upgraded from version 4: 4 tasks, 3 plans, 2 messages, 5 memories moved")
    starting_count = mark_count(story)
    story.run_listeners()
    expect_mark_count(story, starting_count)
    UpgradeJournal(story.home).run(confirmed=True)
    story.run_listeners()
    expect_mark_count(story, starting_count)


def expect_mark_count_minimum(mark_count, story, expected) -> None:
    actual = mark_count(story)
    assert actual >= expected, actual

