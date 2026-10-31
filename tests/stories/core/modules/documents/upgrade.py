from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_a_version_4_document_keeps_its_number_title_abstract_and_text_and_a_project_one_has_no_environment(new_story):
    story = upgraded_story(new_story)
    story.expect_text("doc show 1 --all", "in cents, see task 1")
    story.expect_text("doc show 1 --json", '"title": "Cart rules"', '"abstract": "How the cart counts"', '"environment_id": null')


def test_a_document_signed_off_in_version_4_is_closed_with_its_reason_and_one_with_no_text_moves_empty(new_story):
    story = upgraded_story(new_story)
    story.expect_text("doc show 2 --json", '"close_reason": "kept for reference"', '"body": ""')


def test_a_documents_revisions_move_with_their_numbers_through_their_revision_of_links(new_story):
    story = upgraded_story(new_story)
    story.expect_text("doc revisions 1", "1", "written")


def test_a_report_moves_with_the_rows_it_is_about_and_a_document_keeps_its_mentions_and_comments(new_story):
    story = upgraded_story(new_story)
    story.expect_text("report show 1", "report 1: Cart review")
    story.expect_text("link list --source reports:1", "about  tasks:1")
    story.expect_text("link list --source docs:1", "mentions  tasks:1")
    story.expect_text("doc comments 1", "message 1:")


def test_links_to_a_row_that_did_not_move_are_counted(new_story):
    story = upgraded_story(new_story)
    assert "dropped links to a row that did not move: 1 rows" in story.upgrade_text
