import json
import os
import signal
import subprocess
import threading
import time as timing
from datetime import datetime, timezone
from pathlib import Path

from journal.config import Config
from journal.support.cards import Cards
from journal.features.checks.support.check_output import CheckOutput
from journal.features.checks.support.finished_run import FinishedRun
from journal.support.actor import Actor
from journal.models.check import Check
from journal.support.check_report import CheckReport
from journal.engine.states.ended import Ended
from journal.repositories.agents import Agents
from journal.repositories.checks import Checks
from journal.support.card_kind import CardKind

TIMEOUT = 600
TAIL = 20
FAULTS = {126: "the command cannot be run", 127: "the command is not there"}
OUTPUT_CHARACTERS = 4000
INTERVAL = 1.0


class CheckRunner:
    """Runs one check in the project root, its progress on its row while it runs, and keeps its result and report; the run is a row event the check carries, and what the agent is told of a failure is the checks conduct's."""

    def __init__(self, config: Config, checks: Checks, agents: Agents, cards: Cards) -> None:
        self.config, self.checks, self.agents, self.cards = config, checks, agents, cards

    def run(self, check: Check, actor: Actor) -> Check:
        return self.finished(self.checks.save(check.started(timing.time()), actor), actor)

    def start(self, check: Check, actor: Actor) -> Check:
        if check.running is not None:
            return check
        begun = self.checks.save(check.started(timing.time()), actor)
        threading.Thread(target=self.finished, args=(begun, actor), name=f"check-{begun.id}", daemon=True).start()
        return begun

    def finished(self, check: Check, actor: Actor) -> Check:
        report = self.config.home / "runtime" / "check-reports" / f"{check.id}.json"
        report.parent.mkdir(parents=True, exist_ok=True)
        report.unlink(missing_ok=True)
        ended = self.executed(check, report, actor)
        was_failing = check.last_passed is False
        took = timing.time() - check.running.time
        ran = self.checks.save(self.checks.find(check.id).completed(ended.passed, ended.output[-OUTPUT_CHARACTERS:], datetime.now(timezone.utc), took, self.report(report), ended.fault), actor)
        if ran.waited_on:
            return ran
        tail = "\n".join(ended.output.strip().splitlines()[-TAIL:])
        for agent in self.agents.all_agents():
            if agent.state != Ended.name:
                self.cards.show(agent.environment_id, agent.session, f"Check {ran.title} {'passed' if ended.passed else 'failed'}", "check", "good" if ended.passed else "bad", tail, f"checks:{ran.id}", shows=CardKind.CHECKS)
        return ran

    def executed(self, check: Check, report: Path, actor: Actor) -> FinishedRun:
        process = subprocess.Popen(check.command, shell=True, cwd=self.config.root, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace",
                                   env={**os.environ, "JOURNAL_REPORT": str(report)}, start_new_session=True)
        late = threading.Timer(TIMEOUT, os.killpg, (process.pid, signal.SIGKILL))
        late.start()
        printed, saved = [], timing.time()
        for line in process.stdout:
            printed.append(line)
            if timing.time() - saved >= INTERVAL:
                self.checks.touch(check, actor, running=CheckOutput.progress("".join(printed), check.running.time))
                saved = timing.time()
        code = process.wait()
        late.cancel()
        output = "".join(printed)
        if code == -signal.SIGKILL:
            return FinishedRun(False, f"{output}\ntimed out after {TIMEOUT}s", f"it timed out after {TIMEOUT}s")
        return FinishedRun(code == 0, output, FAULTS.get(code, ""))

    @staticmethod
    def report(path: Path) -> CheckReport | None:
        if not path.is_file():
            return None
        try:
            return CheckReport.parsed(json.loads(path.read_text()))
        except ValueError:
            return None
