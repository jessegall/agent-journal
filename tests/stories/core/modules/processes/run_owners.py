from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.process.door.request_records import RequestRecords
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.environment.environment_names import EnvironmentNames
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.ticks.request_log_import import RequestLogImport
from tests.stories.core.support.fixtures import UserJoined

RUN_LINE = "echo from-main"
VIEWER_LINE = "journal task list"


def test_a_run_lands_on_its_own_environments_main_agent_and_a_request_with_no_environment_keeps_no_row(new_story, tmp_path: Path):
    story = new_story(fixture=UserJoined)
    main_agent = story.new_row_id("agent start s-main claude main --environment main", actor=story.user)
    story.expect_success("environment make web /work/web", actor=story.user)
    web_agent = story.new_row_id("agent start s-web claude main --environment web", actor=story.user)
    main_id = story.container.get(EnvironmentNames).environment_id("main")
    with story.container.get(Scopes).opened(None, main_id):
        story.container.get(ProcessExecutor).execute(ExecutionRequest(["sh", "-c", RUN_LINE], tmp_path, ProcessKind.QUICK, 5))
    with story.container.get(Scopes).opened(None):
        story.container.get(RequestRecords).ended_now(ProcessKind.JOURNAL, VIEWER_LINE, 0)
    RequestLogImport()(story.container)
    with story.container.get(Scopes).opened(None, main_id):
        runs = tuple(story.container.get(Queries).query(RequestRun).all_rows())
    owners = [(run.line, run.session_agent_id) for run in runs]
    story.expect_rows(any(RUN_LINE in line and agent == main_agent for line, agent in owners), all(agent != web_agent for _, agent in owners),
                      all(line != VIEWER_LINE for line, _ in owners), detail=str(owners))
