
import pytest

from engine.database.database import Database
from engine.enums.process_type import ProcessType
from engine.errors.refusal import Refusal
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.serving.server_files import ServerFiles
from engine.enums.server_phase import ServerPhase
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_server_phase_reads_updating_while_an_update_holds_the_door_and_ready_after(new_story):
    story = new_story(fixture=BuilderStarted)
    files = ServerFiles(story.home)
    files.mark_maintenance()
    during = files.phase()
    files.clear_maintenance()
    story.expect_rows(during is ServerPhase.UPDATING, not during.runs_programs, files.phase().runs_programs)


def test_a_run_asked_for_inside_a_write_while_the_server_updates_is_refused_at_once(new_story):
    story = new_story(fixture=BuilderStarted)
    files = ServerFiles(story.home)
    files.mark_maintenance()
    database = story.container.get(Database)
    with pytest.raises(Refusal, match="the journal is updating"), database.transaction():
        story.container.get(ProcessExecutor).execute(ExecutionRequest(["echo", "done"], story.home.project_folder, ProcessType.QUICK, 10))
    files.clear_maintenance()
