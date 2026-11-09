from tests.stories.core.support.coding_fixtures import BuilderStarted


def made(story):
    story.expect_success('doc make "Cart" --abstract "How the cart counts" --body "The total is in cents."', actor=story.agent)


def test_a_comment_keeps_its_words_and_its_selection_apart(new_story):
    story = new_story(fixture=BuilderStarted)
    made(story)
    story.expect_success('doc comment 1 "Why cents?" --quote "in cents" --position 13 --selection-type text --environment main', actor=story.user)
    story.expect_text("doc inspect 1 --json", '"body": "Why cents?"', '"quote": "in cents"', '"position": 13', '"selection_type": "text"', '"revision": 1', actor=story.user)


def test_the_message_to_the_agent_names_the_selection(new_story):
    story = new_story(fixture=BuilderStarted)
    made(story)
    story.expect_success('doc comment 1 "Why cents?" --quote "in cents" --position 13 --environment main', actor=story.user)
    story.expect_text("doc comments 1", '"in cents": Why cents?', actor=story.user)
    story.expect_absent("doc comments 1", "On doc 1", actor=story.user)


def test_a_comment_on_the_whole_document_has_no_selection(new_story):
    story = new_story(fixture=BuilderStarted)
    made(story)
    story.expect_success('doc comment 1 "Good plan" --environment main', actor=story.user)
    story.expect_text("doc inspect 1 --json", '"body": "Good plan"', '"quote": ""', '"position": null', actor=story.user)


def test_a_report_keeps_comments_without_a_revision(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('report make "Checked" --abstract "What was checked" --body "All of it."', actor=story.agent)
    story.expect_success('report comment 1 "Thanks" --quote "All of it" --position 0 --environment main', actor=story.user)
    story.expect_text("report inspect 1 --json", '"quote": "All of it"', '"revision": null', actor=story.user)
