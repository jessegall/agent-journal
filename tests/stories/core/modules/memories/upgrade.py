from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_memory_moves_as_a_fact_with_its_text_weight_and_environment(new_story):
    story = upgraded_story(new_story)
    story.expect_success("memory show 1", "text: Totals are in cents", "type: fact", "weight: 5", "environment_id: 1", "state: active")


def test_a_memory_whose_end_has_passed_is_not_moved_and_a_removed_one_moves_removed(new_story):
    story = upgraded_story(new_story)
    listing = story.run("memory list --state active").output_text
    assert "Use the old API until March" not in listing and "A removed fact" not in listing
    assert "dropped memories past their end: 1 rows" in story.upgrade_text


def test_a_memory_with_a_future_end_moves_without_an_end_and_is_listed_in_the_report_for_the_person_to_remove(new_story):
    story = upgraded_story(new_story)
    assert "Deploy at nine" in story.run("memory list").output_text
    assert "memory 3 had an end on 2036-01-01" in story.upgrade_text


def test_a_removed_memory_keeps_its_removal(new_story):
    story = upgraded_story(new_story)
    story.expect_success("memory show 4", "text: A removed fact", "state: removed")


def test_keywords_and_a_weight_of_zero_move_and_a_task_expiry_ties_the_memory_to_the_moved_task(new_story):
    story = upgraded_story(new_story)
    story.expect_success("memory show 5", "weight: 0", "task_id: 1")
    assert "cart" in story.run("memory-keyword list").output_text


def test_the_new_memories_are_listed_nowhere_as_a_rule_or_reminder(new_story):
    story = upgraded_story(new_story)
    assert "type: rule" not in story.run("memory list").output_text and "type: reminder" not in story.run("memory list").output_text


def test_a_version_4_rule_and_reminder_move_as_rule_and_reminder_memories_with_their_keywords(new_story):
    story = upgraded_story(new_story)
    memories = story.run("memory list --json").output_text
    assert "Always keep totals in cents" in memories and "Run the cart tests before a commit" in memories
    assert '"type": "rule"' in memories and '"type": "reminder"' in memories
