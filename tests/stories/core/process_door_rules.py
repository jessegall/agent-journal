from engine.serving.server_files import ServerFiles
from engine.serving.server_phase import ServerPhase
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_server_phase_reads_updating_while_an_update_holds_the_door_and_ready_after(new_story):
    story = new_story(fixture=BuilderStarted)
    files = ServerFiles(story.home)
    files.mark_maintenance()
    during = files.phase()
    files.clear_maintenance()
    story.expect_rows(during is ServerPhase.UPDATING, not during.runs_programs, files.phase().runs_programs)
