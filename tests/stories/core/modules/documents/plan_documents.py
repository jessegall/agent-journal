import json

from tests.stories.core.support.fixtures import UserJoined

DOC = 'doc make "Rebuild design" --abstract "How the rebuild goes" --body "The design"'


def test_a_plan_made_from_a_document_is_linked_to_it_on_both_sides(new_story):
    story = new_story(fixture=UserJoined)
    story.run(DOC, actor=story.user)
    story.expect_text('plan make "The rebuild" --environment main --document-id 1', "state: draft", actor=story.user)
    story.expect_text("doc show 1", "links: plan:1", actor=story.user)
    story.expect_rows(json.loads(story.run("plan inspect 1 --json", actor=story.user).output_text)["document_id"] == 1)
    story.expect_text("link list --source doc:1", "about  plan:1", actor=story.user)


def test_a_plan_edited_to_take_a_document_is_linked_to_it(new_story):
    story = new_story(fixture=UserJoined)
    story.run(DOC, actor=story.user)
    story.run('plan make "The rebuild" --environment main', actor=story.user)
    story.expect_text("plan edit 1 --document-id 1", "document_id: 1", actor=story.user)
    story.expect_text("link list --source doc:1", "about  plan:1", actor=story.user)


def test_a_plan_taking_a_document_that_does_not_exist_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('plan make "The rebuild" --environment main --document-id 7', "no doc 7", actor=story.user)


def test_a_document_made_for_a_plan_shows_in_the_links_that_lead_to_the_plan(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "The rebuild" --environment main', actor=story.user)
    story.run(f"{DOC} --about plans:1", actor=story.user)
    rows = json.loads(story.run("link list --target plan:1 --json", actor=story.user).output_text)["rows"]
    story.expect_rows(rows[0]["source_model"] == "doc", rows[0]["source_id"] == 1, rows[0]["source_title"] == "Rebuild design")

