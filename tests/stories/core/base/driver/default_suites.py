from tests.stories.core.support.fixtures import MainEnvironment


def test_a_fresh_journal_ships_the_coding_suite_from_its_own_module(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_success("suite show coding", "module: journal.suites.coding")
