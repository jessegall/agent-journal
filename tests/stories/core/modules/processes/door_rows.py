import threading
from pathlib import Path

from engine.enums.process_type import ProcessType
from engine.environment.environment_names import EnvironmentNames
from engine.file.file_access import FileAccess
from engine.module.module_finder import ModuleFinder
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.serving.server_files import ServerFiles
from server.tick.ticker import Ticker
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry
from tests.stories.core.support.fixtures import UserJoined

TEST_ROWS_REASON = "the test reads every row it checks"
IMPORT_LABEL = "request log import"
IMPORT_SECONDS = 5
TICK_JOIN_SECONDS = 5.0
WAIT_CHECK_SECONDS = 0.6


class TickClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


def test_the_ticker_writes_the_logged_requests_and_a_held_hook_keeps_its_row_under_its_session(new_story):
    story = new_story(fixture=UserJoined)
    main_id = story.container.get(EnvironmentNames).environment_id("main")
    log = RequestLog(story.home, FileAccess.shared())
    log.append(RequestLogEntry(main_id, None, ProcessType.JOURNAL, "journal task list", 0, "2026-10-31T09:00:00+00:00"))
    log.append(RequestLogEntry(None, None, ProcessType.HOOK, "claude stop", 2, "2026-10-31T09:00:00+00:00", "s-1"))
    handlers = [handler for handler in Ticker.module_handlers(ModuleFinder(story.home)) if handler.label == IMPORT_LABEL]
    clock = TickClock()
    ticker = Ticker(story.home, handlers, lambda: None, clock)
    ticker.start()
    for seconds in (IMPORT_SECONDS, 2 * IMPORT_SECONDS, 3 * IMPORT_SECONDS):
        clock.now = seconds
        ticker.tick()
        ticker.join(TICK_JOIN_SECONDS)
    ticker.stop(TICK_JOIN_SECONDS)
    with story.container.get(Scopes).opened(None, main_id):
        rows = [(run.line, run.session_agent_id, run.exit_code) for run in story.container.get(Queries).query(RequestRun).every_row(TEST_ROWS_REASON)]
    story.expect_rows(("journal task list", story.agent.id, 0) in rows, ("claude stop", story.agent.id, 2) in rows, detail=str(rows))


def test_a_door_run_waits_while_the_journal_starts_and_runs_once_it_is_ready(new_story, tmp_path: Path):
    story = new_story(fixture=UserJoined)
    files = ServerFiles(story.home)
    FileAccess.shared().write(files.start_mark, "starting")
    finished: list[str] = []
    run = threading.Thread(target=lambda: finished.append(story.container.get(ProcessExecutor).execute(ExecutionRequest(["echo", "ran"], tmp_path, ProcessType.QUICK, 5)).stdout))
    run.start()
    run.join(WAIT_CHECK_SECONDS)
    blocked_during_start = run.is_alive() and not finished
    files.clear_restart()
    run.join(TICK_JOIN_SECONDS)
    story.expect_rows(blocked_during_start, finished == ["ran\n"], detail=str(finished))
