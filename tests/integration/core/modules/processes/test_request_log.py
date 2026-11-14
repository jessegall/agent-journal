from datetime import UTC, datetime

from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry
from engine.enums.process_type import ProcessType
from engine.environment.environment_names import EnvironmentNames
from engine.file.file_access import FileAccess
from engine.module.module_finder import ModuleFinder
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from server.tick.ticker import Ticker

EVERY_ROW_REASON = "the test reads every row it checks"
IMPORT_LABEL = "request log import"
IMPORT_SECONDS = 5
TICK_JOIN_SECONDS = 5.0


class TickClock:
    def __init__(self) -> None:
        self.now = 0.0

    def __call__(self) -> float:
        return self.now


def test_the_ticker_writes_the_logged_requests_and_a_held_hook_keeps_its_row_under_its_session(journal):
    agent = journal.new_row_id("agent start s-1 claude main --environment main")
    main_id = journal.container.get(EnvironmentNames).environment_id("main")
    log = RequestLog(journal.home, FileAccess())
    # the ticker's kept container reads the real clock, so a row needs today's date or it is pruned as too old
    ended_at = datetime.now(UTC).isoformat()
    log.append(RequestLogEntry(main_id, None, ProcessType.JOURNAL, "journal task list", 0, ended_at))
    log.append(RequestLogEntry(None, None, ProcessType.HOOK, "claude stop", 2, ended_at, "s-1"))
    handlers = [handler for handler in Ticker.module_handlers(ModuleFinder(journal.home)) if handler.label == IMPORT_LABEL]
    clock = TickClock()
    ticker = Ticker(journal.home, handlers, lambda: None, clock)
    ticker.start()
    for seconds in (IMPORT_SECONDS, 2 * IMPORT_SECONDS, 3 * IMPORT_SECONDS):
        clock.now = seconds
        ticker.tick()
        ticker.join(TICK_JOIN_SECONDS)
    ticker.stop(TICK_JOIN_SECONDS)
    with journal.container.get(Scopes).opened(None, main_id):
        rows = [(run.line, run.session_agent_id, run.exit_code) for run in journal.container.get(Queries).query(RequestRun).every_row(EVERY_ROW_REASON)]
    assert ("journal task list", agent, 0) in rows and ("claude stop", agent, 2) in rows, rows
