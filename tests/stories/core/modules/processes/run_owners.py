from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.process.execution_request import ExecutionRequest
from engine.process.process_executor import ProcessExecutor
from engine.process.request_records import RequestRecords
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.environment.environment_names import EnvironmentNames
from core.modules.processes.models.process import Process
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
    process = story.container.get(Queries).query(Process).find(execution.process_id)
    story.expect_rows(process.environment_id == main_id, process.session_agent_id == main_agent, process.environment_id != web_id, detail=f"{process.environment_id} {process.session_agent_id}")
    with story.container.get(Scopes).opened(None):
        row_id = story.container.get(RequestRecords).begun(ProcessKind.JOURNAL, "journal task list")
    story.expect_rows(row_id is None, detail=str(row_id))
