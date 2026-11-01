from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_alias_moves_with_its_line_description_variables_and_flags(new_story):
    story = upgraded_story(new_story)
    story.expect_text("alias show 1", "name: tests", "line: sh scripts/run_tests.sh {args}", "description: the scoped tests", "LIMIT=60", "background: True",
                      "worker_access: True")


def test_an_alias_whose_reader_did_not_move_moves_with_none_and_is_told(new_story):
    story = upgraded_story(new_story)
    assert "alias tests named the reader ghost-reader, which did not move: it moved with none" in story.upgrade_text


def test_an_alias_of_a_plugin_that_did_not_move_is_skipped_and_told(new_story):
    story = upgraded_story(new_story)
    assert "skipped aliases 2: its plugin gone-plugin did not move" in story.upgrade_text
