import re

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text, expect_upgrade_without_text
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_value_4, expect_value_with


def test_a_memory_whose_end_has_passed_is_not_moved_and_a_removed_one_moves_removed(new_story):
    story = upgraded_story(new_story)
    listing = story.run("memory list --state active")
    listing.expect_no_text("Use the old API until March")
    listing.expect_no_text("A removed fact")
    expect_upgrade_text(story, "dropped memories past their end: 1 rows")


def test_a_memory_with_a_future_end_moves_without_an_end_and_is_listed_in_the_report_for_the_person_to_remove(new_story):
    story = upgraded_story(new_story)
    story.expect_text("memory list", "Deploy at nine")
    expect_upgrade_text(story, "memory 3 had an end on 2036-01-01")


def test_keywords_and_a_weight_of_zero_move_and_a_task_expiry_ties_the_memory_to_the_moved_task(new_story):
    story = upgraded_story(new_story)
    story.expect_success("memory show 5", "weight: 0", "task_id: 1")
    story.expect_text("memory-keyword list", "cart")


def test_a_memory_longer_than_version_5_allows_moves_whole_into_a_document_and_keeps_its_start_with_the_document_number(new_story):
    story = upgraded_story(new_story)
    memory = story.run("memory show 6").output_text
    document = re.search(r"whole text in doc (\d+)", memory)
    expect_value_with(memory, "text: A long fact. A long fact.")
    expect_value_4(document)
    story.expect_text(f"doc show {document.group(1)} --all", ("A long fact. " * 40).strip())


def test_a_long_reminder_moves_whole_into_a_document_and_nothing_is_cut_or_skipped(new_story):
    story = upgraded_story(new_story)
    memories = story.run("memory list --json")
    memories.expect_text("A long reminder. A long reminder.")
    memories.expect_text("whole text in doc")
    expect_upgrade_text(story, "2 memory texts longer than 400 characters moved whole into documents")
    expect_upgrade_without_text(story, "cut to")
    expect_upgrade_without_text(story, "skipped reminders")


def test_a_version_4_rule_moves_as_a_rule_and_a_reminder_as_a_memory(new_story):
    story = upgraded_story(new_story)
    story.expect_text("rule list --state active", "Always keep totals in cents")
    memories = story.run("memory list --json")
    memories.expect_no_text("Always keep totals in cents")
    memories.expect_text("Run the cart tests before a commit")
