import json
import os
import signal
import subprocess
import threading
import time as timing
from datetime import datetime, timezone
from pathlib import Path
from journal.models.support.ref import Ref

from journal.config import Config
from journal.chat.cards import Cards
from journal.features.checks.support.check_output import CheckOutput
from journal.features.checks.support.finished_run import FinishedRun
from journal.support.actor import Actor
from journal.models.check import Check
from journal.support.check_report import CheckReport
from journal.engine.states.ended import Ended
from journal.repositories.agents import Agents
from journal.repositories.checks import Checks
from journal.support.card_kind import CardKind

TIMEOUT_SECONDS = 600
TAIL_LINES = 20
FAULTS = {126: "the command cannot be run", 127: "the command is not there"}
OUTPUT_CHARACTERS = 4000
INTERVAL_SECONDS = 1.0


class CheckRunner:
    """Runs one check in the project root, its progress on its row while it runs, and keeps its result and report; the run is a row event the check carries, and what the agent is told of a failure is the checks conduct's."""

    def __init__(self, config: Config, checks: Checks, agents: Agents, cards: Cards) -> None:
        self.config, self.checks, self.agents, self.cards = config, checks, agents, cards

    def run(self, check: Check, actor: Actor) -> Check:
        started = timing.time()
        return self.finished(self.checks.save(check.started(started), actor), started, actor)

    def start(self, check: Check, actor: Actor) -> Check:
        if check.progress is not None:
            return check
        started = timing.time()
        commenced = self.checks.save(check.started(started), actor)
        threading.Thread(target=self.finished, args=(commenced, started, actor), name=f"check-{commenced.id}", daemon=True).start()
        return commenced

    def finished(self, check: Check, started: float, actor: Actor) -> Check:
        report = self.config.home / "runtime" / "check-reports" / f"{check.id}.json"
        report.parent.mkdir(parents=True, exist_ok=True)
        report.unlink(missing_ok=True)
        ended = self.executed(check, report, started, actor)
        prior_failure = check.last_passed is False
        elapsed = timing.time() - started
        check_row = self.checks.save(self.checks.find(check.row_id).completed(ended.passed, ended.output[-OUTPUT_CHARACTERS:], datetime.now(timezone.utc), elapsed, self.report(report), ended.fault), actor)
        if check_row.wait_target:
            return check_row
        tail = "\n".join(ended.output.strip().splitlines()[-TAIL_LINES:])
        for agent in self.agents.all_agents():
            if agent.state != Ended.name:
                self.cards.show(agent.environment_id, agent.session, f"Check {check_row.title} {'passed' if ended.passed else 'failed'}", "check", "good" if ended.passed else "bad", tail, Ref.build(check_row), shows=CardKind.CHECKS)
        return check_row

    def executed(self, check: Check, report: Path, started: float, actor: Actor) -> FinishedRun:
        process = subprocess.Popen(check.command, shell=True, cwd=self.config.root, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace",
                                   env={**os.environ, "JOURNAL_REPORT": str(report)}, start_new_session=True)
        if process.stdout is None:
            raise OSError(f"check {check.row_id} started without its output pipe")
        late = threading.Timer(TIMEOUT_SECONDS, os.killpg, (process.pid, signal.SIGKILL))
        late.start()
        output_text, saved = [], timing.time()
        for line in process.stdout:
            output_text.append(line)
            if timing.time() - saved >= INTERVAL_SECONDS:
                self.checks.touch(check, actor, progress=CheckOutput.progress("".join(output_text), started))
                saved = timing.time()
        code = process.wait()
        late.cancel()
        output = "".join(output_text)
        if code == -signal.SIGKILL:
            return FinishedRun(False, f"{output}\ntimed out after {TIMEOUT_SECONDS}s", f"it timed out after {TIMEOUT_SECONDS}s")
        return FinishedRun(code == 0, output, FAULTS.get(code, ""))

    @staticmethod
    def report(path: Path) -> CheckReport | None:
        if not path.is_file():
            return None
        try:
            return CheckReport.parsed(json.loads(path.read_text()))
        except ValueError:
            return None
