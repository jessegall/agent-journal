from pathlib import Path
import threading

from engine.enums.process_type import ProcessType
from engine.file.file_access import FileAccess
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from engine.serving.server_files import ServerFiles

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


def test_a_door_run_waits_while_the_journal_starts_and_runs_once_it_is_ready(journal, tmp_path: Path):
    files = ServerFiles(journal.home)
    FileAccess.write(files.start_mark, "starting")
    finished: list[str] = []
    run = threading.Thread(target=lambda: finished.append(journal.container.get(ProcessExecutor).execute(ExecutionRequest(["echo", "ran"], tmp_path, ProcessType.QUICK, 5)).stdout))
    run.start()
    run.join(WAIT_CHECK_SECONDS)
    blocked_during_start = run.is_alive() and not finished
    files.clear_restart()
    run.join(TICK_JOIN_SECONDS)
    assert blocked_during_start, str(finished)
    assert finished == ['ran\n'], str(finished)
