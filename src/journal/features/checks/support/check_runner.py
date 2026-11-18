import json
import os
import signal
import subprocess
import threading
import time as timing
from dataclasses import replace
from datetime import datetime, timezone
from pathlib import Path

from journal.support.timeout import Timeout
from journal.config import Config
from journal.features.checks.support.check_output import CheckOutput
from journal.features.checks.support.finished_run import FinishedRun
from journal.support.actor import Actor
from journal.models.check import RUN_LIMIT_SECONDS, Check
from journal.support.check_progress import CheckProgress
from journal.support.check_report import CheckReport
from journal.support.process_check import ProcessCheck
from journal.repositories.checks import Checks
from journal.support.time_source import TimeSource

FAULTS = {2: "it exited 2: it could not run", 126: "the command cannot be run", 127: "the command is not there"}
OUTPUT_CHARACTERS = 4000
INTERVAL_SECONDS = 1.0


class CheckRunner:
    """Runs one check in the project root, with its progress and its command's process group on its row while it runs, a run left marked past its time limit by a journal that stopped taken as over, and stores its result and report; the run is a row event the check carries, and what the agent is informed about a failure is the checks conduct's. A run force stopped ends its process group at once and is recorded as stopped, and the run's own thread, finding the run no longer the check's, records nothing."""

    def __init__(self, config: Config, checks: Checks, time_source: TimeSource) -> None:
        self.time_source = time_source
        self.config, self.checks = config, checks

    def run(self, check: Check, actor: Actor) -> Check:
        started = self.time_source.seconds()
        report = self.report_path(check)
        process = self.launched(check, report)
        return self.finished(self.checks.rewritten(check, actor, lambda current: current.started(started, process.pid)), started, actor, process, report)

    def start(self, check: Check, actor: Actor) -> Check:
        with self.checks.writing():
            current = self.checks.find(check.row_id)
            if current.is_running(self.time_source.seconds()):
                return current
            started = self.time_source.seconds()
            report = self.report_path(current)
            process = self.launched(current, report)
            commenced = self.checks.rewritten(current, actor, lambda row: row.started(started, process.pid))
        threading.Thread(target=self.finished, args=(commenced, started, actor, process, report), name=f"check-{commenced.id}", daemon=True).start()
        return commenced

    def stop(self, check: Check, actor: Actor) -> Check:
        with self.checks.writing():
            current_check = self.checks.find(check.row_id)
            stopped_check = self.checks.save(current_check.stopped(self.time_source.moment()), actor)
        if current_check.progress is not None:
            self.ended(current_check.progress.process)
        return stopped_check

    def report_path(self, check: Check) -> Path:
        report = self.config.home / "runtime" / "check-reports" / f"{check.id}.json"
        report.parent.mkdir(parents=True, exist_ok=True)
        report.unlink(missing_ok=True)
        return report

    def finished(self, check: Check, started: float, actor: Actor, process: subprocess.Popen, report: Path) -> Check:
        ended = self.executed(check, process, started, actor)
        elapsed = self.time_source.seconds() - started
        with self.checks.writing():
            current = self.checks.find(check.row_id)
            if not current.has_run_start(started):
                return current
            return self.checks.rewritten(current, actor, lambda row: row.completed(ended.passed, ended.output[-OUTPUT_CHARACTERS:], self.time_source.moment(), elapsed, self.report(report), ended.fault, started))

    def launched(self, check: Check, report: Path) -> subprocess.Popen:
        process = subprocess.Popen(check.command, shell=True, cwd=self.config.root, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace",
                                   env={**os.environ, "JOURNAL_REPORT": str(report)}, start_new_session=True)
        if process.stdout is None:
            raise OSError(f"check {check.row_id} started without its output pipe")
        return process

    def executed(self, check: Check, process: subprocess.Popen, started: float, actor: Actor) -> FinishedRun:
        late = threading.Timer(RUN_LIMIT_SECONDS, os.killpg, (process.pid, signal.SIGKILL))
        late.start()
        output_text, saved = [], self.time_source.seconds()
        for line in process.stdout:
            output_text.append(line)
            if Timeout.seconds(INTERVAL_SECONDS).started(saved).is_elapsed(self.time_source.seconds()):
                self.progressed(check, started, replace(CheckOutput.progress("".join(output_text), started), process=process.pid), actor)
                saved = self.time_source.seconds()
        code = process.wait()
        late.cancel()
        output = "".join(output_text)
        if code == -signal.SIGKILL:
            return FinishedRun(False, f"{output}\ntimed out after {RUN_LIMIT_SECONDS}s", f"it timed out after {RUN_LIMIT_SECONDS}s")
        return FinishedRun(code == 0, output, FAULTS.get(code, ""))

    def progressed(self, check: Check, started: float, progress: CheckProgress, actor: Actor) -> None:
        with self.checks.writing():
            if self.checks.find(check.row_id).has_run_start(started):
                self.checks.touch(check, actor, progress=progress)
                return
        self.ended(progress.process)

    @staticmethod
    def ended(process: int) -> None:
        if ProcessCheck.is_running(process) and os.getpgid(process) == process:
            os.killpg(process, signal.SIGKILL)

    @staticmethod
    def report(path: Path) -> CheckReport | None:
        if not path.is_file():
            return None
        try:
            return CheckReport.parsed(json.loads(path.read_text()))
        except ValueError:
            return None
