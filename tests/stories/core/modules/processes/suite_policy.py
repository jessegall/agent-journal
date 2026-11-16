from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.processes.support.process_samples import ended_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

NOTES_MODULE = "tests.stories.core.modules.profiles.support.notes_module:NotesSuiteOfNotesModule"


def test_output_access_follows_the_type_of_the_agent_that_reads(new_story):
    story = new_story(NOTES_MODULE, fixture=BuilderStarted)
    process = ended_run(story, "show notes", "notes\n")
    helper = story.agent_actor(story.new_row_id("agent start notes-helper claude helper --environment main"))
    reader = story.agent_actor(story.new_row_id("agent start notes-reader claude reader --environment main"))
    story.expect_text(f"output status {process.id}", "finished", actor=helper)
    story.expect_refusal(f"output status {process.id}", "is not yours", actor=reader)
