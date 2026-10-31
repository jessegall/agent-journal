from tests.stories.core.support.fixtures import UserJoined


def test_a_report_about_rows_names_them_and_links_to_each(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.expect_success('report make "Cart review" --abstract "What the review found" --body "## Found\\nnothing" --about tasks:1', "report 1: Cart review, about task:1",
                         actor=story.user)
    story.expect_text("link list --source report:1", "about  task:1", actor=story.user)


def test_an_about_that_is_not_a_row_is_refused_with_how_to_write_one(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('report make "Cart review" --abstract "What it found" --body "x" --about cart', "not a row: cart; write each as plans:8 or tasks:12",
                         actor=story.user)


def test_a_report_edit_needs_its_abstract_and_keeps_its_body_without_new_text(new_story):
    story = new_story(fixture=UserJoined)
    story.run('report make "Cart review" --abstract "What it found" --body "## Found\\nnothing"', actor=story.user)
    story.expect_success('report edit 1 --abstract "What the second look found"', "report 1 written anew: What the second look found", actor=story.user)
    story.expect_text("report show 1 --all", "nothing", actor=story.user)
