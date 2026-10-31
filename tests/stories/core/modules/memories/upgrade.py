from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_memory_moves_as_a_fact_with_its_text_weight_and_environment(new_story):
    story = upgraded_story(new_story)
    story.expect_success("memory list", "Totals are in cents")


def test_a_memory_whose_end_has_passed_and_a_removed_memory_are_not_moved(new_story):
    story = upgraded_story(new_story)
    listing = story.run("memory list").output_text
    assert "Use the old API until March" not in listing and "A removed fact" not in listing


def test_a_memory_with_a_future_end_moves_without_an_end_and_is_listed_in_the_report_for_the_person_to_remove(new_story):
    story = upgraded_story(new_story)
    story.expect_success("memory list", "Deploy at nine")
    assert "memory 3 had an end on 2036-01-01" in story.upgrade_text
