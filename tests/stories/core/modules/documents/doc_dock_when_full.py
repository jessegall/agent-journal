from datetime import timedelta

from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_docked_document_stays_docked_until_the_person_closes_it(new_story):
    story = new_story(fixture=BuilderStarted)
    for number in range(1, 8):
        story.expect_success(f'doc make "Doc {number}" --abstract "About {number}" --body "Text"', actor=story.agent)
    story.run_listeners()
    story.advance(timedelta(hours=1))
    story.run_listeners()
    for number in range(1, 8):
        story.expect_text("dock-item list --json", f"Doc {number}\"", actor=story.agent)
    story.expect_absent("dock-item list --json", "undocked_at\": \"2", actor=story.agent)
