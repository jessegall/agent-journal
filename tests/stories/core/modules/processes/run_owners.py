from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.environment.environment_names import EnvironmentNames
from core.modules.processes.models.process import Process
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.request_log_import import RequestLogImport
from tests.stories.core.support.fixtures import UserJoined

TEST_ROWS_REASON = "the test reads every row it checks"
RUN_LINE = "echo from-main"
MERGE_LINE = "echo merged"


def test_a_run_lands_on_its_own_environments_main_agent_and_a_merge_keeps_a_process_row_with_its_output(new_story, tmp_path: Path):
    story = new_story(fixture=UserJoined)
    main_agent = story.new_row_id("agent start s-main claude main --environment main", actor=story.user)
    story.expect_success("environment make web /work/web", actor=story.user)
    web_agent = story.new_row_id("agent start s-web claude main --environment web", actor=story.user)
    main_id = story.container.get(EnvironmentNames).environment_id("main")
    with story.container.get(Scopes).opened(None, main_id):
        story.container.get(ProcessExecutor).execute(ExecutionRequest(["sh", "-c", RUN_LINE], tmp_path, ProcessKind.QUICK, 5))
    with story.container.get(Scopes).opened(None, main_id):
        merged = story.container.get(ProcessExecutor).execute(ExecutionRequest(["sh", "-c", MERGE_LINE], tmp_path, ProcessKind.MERGE, 5))
    RequestLogImport()(story.container)
    RequestLogImport()(story.container)
    with story.container.get(Scopes).opened(None, main_id):
        runs = tuple(story.container.get(Queries).query(RequestRun).every_row(TEST_ROWS_REASON))
    owners = [(run.line, run.session_agent_id) for run in runs]
    merge_row = story.container.get(Queries).query(Process).find(merged.process_id)
    story.expect_rows(any(RUN_LINE in line and agent == main_agent for line, agent in owners), all(agent != web_agent for _, agent in owners),
                      merge_row.session_agent_id == main_agent, merge_row.exit_code == 0, story.container.get(OutputFolder).output(merged.process_id, 0) == "merged\n",
                      detail=f"{owners} {merge_row}")
