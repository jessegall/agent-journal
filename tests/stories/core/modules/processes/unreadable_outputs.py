from engine.actor.actor import Actor
from tests.stories.core.modules.processes.support.reading_scenarios import declared_unreadable, lifted_unreadable
from tests.stories.core.support.coding_fixtures import UserBuilder


def test_an_agent_marks_a_command_unreadable_with_its_reason_and_a_person_lifts_the_mark(new_story):
    story = new_story(fixture=UserBuilder)
    declared_unreadable(story, "make  watch", "prints only a spinner")
    story.expect_text("unreadable-mark show 1", "words: make watch", "reason: declared", "note: prints only a spinner", actor=story.agent)
    lifted_unreadable(story, "make watch", story.user)
    story.expect_text("unreadable-mark show 1", f"lifter_id: {story.user.id}", "lifted_at: ", actor=story.agent)
    declared_unreadable(story, "make serve", "waits for a browser forever")
    lifted_unreadable(story, "make serve", Actor.core())
    story.expect_text("unreadable-mark show 2", f"lifter_id: {Actor.core().id}", actor=story.agent)
