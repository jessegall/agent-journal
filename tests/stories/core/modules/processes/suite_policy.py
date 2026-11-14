from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.processes.support.process_samples import ended_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

NOTES_MODULE = "tests.stories.core.modules.profiles.support.notes_module:NotesSuiteOfNotesModule"


def test_output_access_follows_the_chosen_suites_role_policy(new_story):
    story = new_story(NOTES_MODULE, fixture=BuilderStarted)
    process = ended_run(story, "show notes", "notes\n")
    reader = Actor(story.new_row_id("agent start notes-reader claude helper --environment main"), ActorType.AGENT)
    story.expect_text(f"output status {process.id}", "finished", actor=reader)
    story.expect_success("suite choose notes --environment main")
    story.expect_refusal(f"output status {process.id}", "is not yours", actor=reader)
