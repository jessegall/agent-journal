from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.process.door.request_records import RequestRecords
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.environment.environment_names import EnvironmentNames
from core.modules.processes.models.request_run import RequestRun
from tests.stories.core.support.fixtures import UserJoined


def two_main_agents(story) -> tuple[int, int, int]:
    """A main agent in environment main and a newer one in environment web, so the newest main agent of all is web's."""
    main_agent = story.new_row_id("agent start s-main claude main --environment main", actor=story.user)
    story.run("environment make web /work/web", actor=story.user)
    story.new_row_id("agent start s-web claude main --environment web", actor=story.user)
    return main_agent, story.container.get(EnvironmentNames).environment_id("main"), story.container.get(EnvironmentNames).environment_id("web")


def test_a_run_lands_on_its_own_environments_main_agent_and_a_request_with_no_environment_keeps_no_row(new_story, tmp_path: Path):
    story = new_story(fixture=UserJoined)
    main_agent, main_id, web_id = two_main_agents(story)
    with story.container.get(Scopes).opened(None, main_id):
        execution = story.container.get(ProcessExecutor).execute(ExecutionRequest(["true"], tmp_path, ProcessKind.QUICK, 5))
    process = story.container.get(Queries).query(RequestRun).find(execution.process_id)
    story.expect_rows(process.environment_id == main_id, process.session_agent_id == main_agent, process.environment_id != web_id, detail=f"{process.environment_id} {process.session_agent_id}")
    with story.container.get(Scopes).opened(None):
        story.container.get(RequestRecords).ended_now(ProcessKind.JOURNAL, "journal task list", 0)
    unowned = tuple(story.container.get(Queries).query(RequestRun).filter(line="journal task list").all_rows())
    story.expect_rows(not unowned, detail=str(unowned))
