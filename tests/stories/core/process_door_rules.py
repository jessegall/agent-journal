from engine.enums.process_kind import ProcessKind
from engine.process.execution_request import ExecutionRequest
from engine.process.run_placement import RunPlacement
from engine.serving.server_files import ServerFiles
from engine.serving.server_phase import ServerPhase
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_run_of_a_paused_agent_is_held_at_the_door_and_released_when_it_is_resumed(new_story):
    story = new_story(fixture=BuilderStarted)
    placement = story.container.get(RunPlacement)
    running = placement.placed(ExecutionRequest(["echo", "runs"], story.home.project_folder, ProcessKind.QUICK, 10))
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    placed = placement.placed(ExecutionRequest(["echo", "held"], story.home.project_folder, ProcessKind.QUICK, 10))
    held_while_paused = placement.holds(placed)
    story.expect_success(f"agent resume {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_rows(placed.agent_id == story.agent.id, not placement.holds(running), held_while_paused, not placement.holds(placed))


def test_the_server_phase_reads_updating_while_an_update_holds_the_door_and_ready_after(new_story):
    story = new_story(fixture=BuilderStarted)
    files = ServerFiles(story.home)
    files.mark_maintenance()
    during = files.phase()
    files.clear_maintenance()
    story.expect_rows(during is ServerPhase.UPDATING, not during.runs_programs, files.phase().runs_programs)
