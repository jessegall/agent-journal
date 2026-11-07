from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_new_document_docks_when_the_dock_is_full_of_open_documents(new_story):
    story = new_story(fixture=BuilderStarted)
    for number in range(1, 8):
        story.expect_success(f'doc make "Doc {number}" --abstract "About {number}" --body "Text"', actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list --json", "Doc 7", actor=story.agent)
    story.expect_absent("dock-item list --json", "Doc 1\"", actor=story.agent)
