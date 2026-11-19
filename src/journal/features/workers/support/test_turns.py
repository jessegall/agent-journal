import os
import re
import shlex
import threading
import time
from pathlib import Path

from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.readers import Readers
from journal.features.shell.support.shell_request import ShellRequest
from journal.features.shell.support.restart_queue import RestartQueue
from journal.features.shell.support.shell_runner import EXIT, RESTART_HOLD, ShellRunner
from journal.features.workers.support.test_run_result import TestRunResult
from journal.features.workers.support.test_selection import TestSelection
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.workers_options import WorkersOptions
from journal.models.test_turn import TestTurn
from journal.support.foreground_option import FOREGROUND_OPTION
from journal.models.test_turn_state import TestTurnState
from journal.models.worker import Worker
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.repositories.test_turns import TestTurns as TurnRows
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.caller import Caller
from journal.support.rejection import Rejection
from journal.support.time_source import TimeSource

POLL_SECONDS = 0.2
LAST_LINES = 10
PASSED_COUNT = re.compile(r"\b(\d+) passed\b")


class TestTurns:
    """The test budget: a worker's turn to run tests is a row, started through the shell runner in the worker's own worktree as soon as fewer runs go than the budget allows and it is first of those that wait, else it waits in order; one that would wait when the waiting cap is full is refused, and while a restart of its journal waits none starts: the turn is taken out and refused, so the restart never waits on a run started after it was asked. A run past the time limit is stopped and reported to its worker as timed out; a worker that ends takes out its turns, waiting or running; turns waiting at a restart start again in order. Its result is what the project's reader for the command picks, and the turn ends when the run does, or, for a run moved to the background, when its output ends; either way how the run ended is kept on its worker, its failed runs in a row counted and a passed one ending the count. A run the shell runner moved to the background is waited for until the foreground limit has passed since it began, so a turn's result is handed back in the foreground."""

    __test__ = False

    def __init__(self, turns: TurnRows, runner: ShellRunner, branch: WorkerBranch, readers: Readers, settings: SettingRows, outputs: CommandOutputs, scope: Scope, workers: Workers, environments: Environments, time_source: TimeSource, restarts: RestartQueue) -> None:
        self.time_source, self.restarts = time_source, restarts
        self.turns, self.runner, self.branch, self.readers, self.settings, self.outputs = turns, runner, branch, readers, settings, outputs
        self.scope, self.workers, self.environments = scope, workers, environments
        self.lock = threading.Lock()
        self.timed_out: set[int] = set()

    def run_batches(self, worker: Worker, ids: str, caller: Caller) -> str:
        folder, runs = str(self.branch.place(worker)), []
        selection = TestSelection.parsed(ids)
        project = shlex.join(selection.project(Path(folder)))
        for batch in self.batches(shlex.join(selection.tests(Path(folder)))):
            batch = f"{project} {batch}".strip()
            turn = self.open_turn(worker, batch, f"{self.command(folder)} {batch}", folder)
            if not self.waited(turn):
                return "your turn was taken back: nothing ran"
            runs.append((turn, self.run_turn(turn, caller, worker.environment_id)))
        return self.joined(runs)

    def built(self, worker: Worker, caller: Caller) -> str:
        command = str(self.settings.option(WorkersOptions.BUILD_COMMAND)).strip()
        if not command:
            raise Rejection(f"this project has no build command for workers: the user sets {WorkersOptions.BUILD_COMMAND.key}")
        turn = self.open_turn(worker, "build", command, str(self.branch.place(worker)))
        if not self.waited(turn):
            return "your turn was taken back: nothing ran"
        return self.result(turn, self.run_turn(turn, caller, worker.environment_id))

    def batches(self, ids: str) -> list[str]:
        parts = shlex.split(ids)
        tests = [shlex.join(parts[i:i + 2]) if parts[i] == "-k" else shlex.quote(parts[i]) for i in range(len(parts)) if i == 0 or parts[i - 1] != "-k"]
        size = max(self.settings.integer(WorkersOptions.TEST_ID_LIMIT), 1)
        return [" ".join(tests[start:start + size]) for start in range(0, len(tests), size)] or [""]

    def joined(self, runs: list[tuple[TestTurn, str]]) -> str:
        if len(runs) == 1:
            return self.result(*runs[0])
        passed = sum(int(count) for _, text in runs for count in PASSED_COUNT.findall(text))
        failed = sum(TestRunResult.printed(text, self.readers.reading(turn.command)).failed for turn, text in runs)
        return "\n".join([*(self.result(turn, text) for turn, text in runs), f"{len(runs)} runs: {passed} passed, {failed} failed"])

    def checked(self, worker: Worker, ids: str, caller: Caller) -> tuple[TestTurn, str]:
        folder = str(self.branch.place(worker))
        turn = self.open_turn(worker, ids, f"{self.command(folder)} {ids}", folder)
        if not self.waited(turn):
            raise Rejection("your test run was taken back before it ran: clock out again")
        self.turns.save(self.turns.find(turn.id).with_run_event(self.time_source.seconds()), Actor.system())
        limit = threading.Timer(self.limit_seconds(), self.stopped, (turn, self.time_source.seconds()))
        limit.start()
        try:
            output, text = self.whole_run(turn.command, turn.folder, caller, worker.environment_id)
            self.recorded(turn, TestRunResult.printed(text, self.readers.reading(turn.command)))
            if output is not None:
                self.turns.save(self.turns.find(turn.id).with_(output=output.row_id), Actor.system())
        finally:
            limit.cancel()
            self.turns.save(self.turns.find(turn.id).ended().with_run_event(self.time_source.seconds()), Actor.system())
        return self.turns.find(turn.id), self.result(turn, text)

    def proved(self, line: str, folder: str, caller: Caller, environment: int) -> tuple[int, str]:
        output, text = self.whole_run(line, folder, caller, environment)
        code = output.status if output is not None else self.exit_code(text)
        return code, "\n".join([line for line in text.splitlines() if not line.startswith(EXIT)][-LAST_LINES:])

    def whole_run(self, line: str, folder: str, caller: Caller, environment: int):
        started = self.time_source.seconds()
        text = b"".join(self.runner.run(ShellRequest(line=line, cwd=folder, shell="bash", environment=dict(os.environ)), caller, environment)).decode(errors="replace")
        output = next((row for row in self.outputs.folder_runs(folder) if row.creation_time.timestamp() >= started), None)
        moved = output is not None and not output.ended
        while output is not None and not output.ended:
            time.sleep(POLL_SECONDS)
            output = self.outputs.find(output.row_id)
        return output, self.stored_text(output, text) if moved else text

    @staticmethod
    def exit_code(text: str) -> int:
        codes = [line.split()[-1] for line in text.splitlines() if line.startswith(EXIT)]
        return int(codes[-1]) if codes and codes[-1].lstrip("-").isdigit() else 1

    def open_turn(self, worker: Worker, ids: str, command: str, folder: str) -> TestTurn:
        with self.lock:
            waiting, cap = self.turns.waiting(), self.waiting_cap()
            if any(turn.worker == worker.id for turn in [*waiting, *self.running()]):
                raise Rejection(f"worker {worker.id}, {worker.name}, has a turn open already: ask for the next once its result is back")
            if (waiting or len(self.running()) >= self.budget()) and cap is not None and len(waiting) >= cap:
                raise Rejection(f"{len(waiting)} turns already wait for a test run: ask again once one has run")
            return self.turns.save(TestTurn(environment_id=worker.environment_id, worker=worker.id, ids=ids, command=command, folder=folder), Actor.worker(worker.id))

    def waited(self, turn: TestTurn) -> bool:
        while True:
            with self.lock:
                if self.turns.find(turn.id).state != TestTurnState.WAITING:
                    return False
                if self.restarts.is_waiting(turn.environment_id):
                    self.turns.save(self.turns.find(turn.id).ended(), Actor.system())
                    raise Rejection(RESTART_HOLD)
                open_runs = self.running()
                free = [row for row in self.turns.waiting() if row.folder not in {run.folder for run in open_runs}]
                if free and free[0].id == turn.id and len(open_runs) < self.budget():
                    self.turns.save(self.turns.find(turn.id).started(self.time_source.seconds()), Actor.system())
                    return True
            time.sleep(POLL_SECONDS)

    def run_turn(self, turn: TestTurn, caller: Caller, environment: int) -> str:
        started = self.time_source.seconds()
        limit = threading.Timer(self.limit_seconds(), self.stopped, (turn, started))
        limit.start()
        try:
            text = b"".join(self.runner.run(ShellRequest(line=turn.command, cwd=turn.folder, shell="bash", environment=dict(os.environ)), caller, environment)).decode(errors="replace")
        except Exception:
            limit.cancel()
            self.turns.save(self.turns.find(turn.id).ended(), Actor.system())
            raise
        output = self.run_output(turn, started)
        moved = output is not None and not output.ended
        output = self.foreground_output(output, started) if moved else output
        later = self.turns.find(turn.id)
        if output is not None and not output.ended:
            self.turns.save(later.backgrounded(output.row_id), Actor.system())
            return text
        text = self.stored_text(output, text) if moved else text
        limit.cancel()
        self.recorded(later, TestRunResult.printed(text, self.readers.reading(turn.command)))
        self.turns.save(self.turns.find(turn.id).ended(), Actor.system())
        return text

    def foreground_output(self, output, started: float):
        deadline = started + self.settings.integer(FOREGROUND_OPTION)
        while self.is_output_pending(output, deadline):
            time.sleep(POLL_SECONDS)
            output = self.outputs.find(output.row_id)
        return output

    @staticmethod
    def stored_text(output, text: str) -> str:
        files = OutputFiles(Path(output.folder))
        if not files.is_stored():
            return text
        lines = [*files.lines(), f"{EXIT} {output.status}", ""]
        return "\n".join(lines)

    def recorded(self, turn: TestTurn, summary: TestRunResult) -> None:
        later = self.turns.find(turn.id)
        self.turns.save(later.passed_run() if summary.is_passed() else later.failed_run(summary.failed), Actor.system())
        worker = self.workers.find(turn.worker)
        self.workers.save(worker.passed_run() if summary.is_passed() else worker.failed_run(summary.failed, self.time_source.seconds()), Actor.system())

    def run_output(self, turn: TestTurn, started: float):
        return next((row for row in self.outputs.folder_runs(turn.folder) if row.creation_time.timestamp() >= started), None)

    def stopped(self, turn: TestTurn, started: float) -> None:
        with self.scope.environment(turn.environment_id):
            output = self.run_output(turn, started)
            if output is None or output.ended:
                return
            self.timed_out.add(turn.id)
            OutputFiles(Path(output.folder)).stop(f"journal: this test run was stopped after {self.limit_seconds() / 60:g} minutes, the test budget's time limit")

    def release(self, worker: int) -> None:
        for turn in [turn for turn in [*self.turns.waiting(), *self.turns.running()] if turn.worker == worker]:
            self.turns.save(turn.ended(), Actor.system())
            if turn.state == TestTurnState.RUNNING:
                with self.scope.environment(turn.environment_id):
                    output = next(iter(self.outputs.folder_runs(turn.folder)), None)
                    if output is not None and not output.ended:
                        OutputFiles(Path(output.folder)).stop("journal: this test run was stopped, its worker ended")

    def holders(self) -> list[int]:
        return sorted({turn.worker for turn in [*self.turns.waiting(), *self.turns.running()]})

    def resume(self) -> list[threading.Thread]:
        for turn in self.turns.running():
            if turn.output == 0:
                self.turns.save(turn.ended(), Actor.system())
        threads = [threading.Thread(target=self.resumed, args=(turn,), daemon=True, name="test-turn") for turn in self.turns.waiting()]
        for thread in threads:
            thread.start()
        return threads

    def resumed(self, turn: TestTurn) -> None:
        with self.scope.environment(turn.environment_id):
            worker = self.workers.find(turn.worker)
            caller = Caller.worker(self.environments.find(turn.environment_id).name, worker.id, worker.session, worker.provider)
            if self.waited(turn):
                self.run_turn(turn, caller, turn.environment_id)

    def running(self) -> list[TestTurn]:
        turns = self.turns.running()
        unended = self.outputs.unended_among([turn.output for turn in turns if turn.output])
        return [turn for turn in turns if turn.output == 0 or turn.output in unended]

    def result(self, turn: TestTurn, text: str) -> str:
        lines = [line for line in text.splitlines() if not line.startswith(EXIT)]
        reader = self.readers.reading(turn.command)
        reader_lines = reader.card_lines(lines) if reader is not None else []
        timed = [f"timed out: the run was stopped after {self.limit_seconds() / 60:g} minutes, the test budget's time limit"] if turn.id in self.timed_out else []
        return "\n".join([*(reader_lines or lines[-LAST_LINES:]), *timed])

    def has_command(self, folder: str) -> bool:
        return bool(str(self.settings.option(WorkersOptions.TEST_COMMAND)).strip()) or (Path(folder) / "tests").is_dir()

    def command(self, folder: str) -> str:
        set = str(self.settings.option(WorkersOptions.TEST_COMMAND)).strip()
        if set:
            return set
        if (Path(folder) / "tests").is_dir():
            return "pytest -q"
        raise Rejection(f"this project has no test command: set {WorkersOptions.TEST_COMMAND.key}")

    def budget(self) -> int:
        return self.settings.integer(WorkersOptions.TEST_RUNS)

    def limit_seconds(self) -> float:
        return self.settings.decimal(WorkersOptions.TEST_RUN_MINUTES) * 60

    def waiting_cap(self) -> int | None:
        value = str(self.settings.option(WorkersOptions.TEST_WAITING)).strip()
        return int(value) if value else None

    def is_output_pending(self, output, deadline: float) -> bool:
        return output is not None and not output.ended and self.time_source.seconds() < deadline
