import json
import os
import signal
import subprocess
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

from journal.config import Config
from journal.engine.cards import Cards
from journal.engine.nudger import Nudger
from journal.engine.states.ended import Ended
from journal.features.checks.check_output import CheckOutput
from journal.features.checks.finished_run import FinishedRun
from journal.models.actor import Actor
from journal.models.check import Check
from journal.models.check_report import CheckReport
from journal.repositories.agents import Agents
from journal.repositories.checks import Checks
from journal.supervisor_link import SupervisorLink

TIMEOUT = 600
TAIL = 20
FAULTS = {126: "the command cannot be run", 127: "the command is not there"}
"""Exit codes the shell gives when it could not run the command at all."""
KEPT = 4000
"""How much of the end of a run's output its row keeps."""
EVERY = 1.0
"""Seconds between two saves of a run's progress."""


class CheckRunner:
    """Runs one check in the project root, its progress on its row while it runs, keeps its result and report, and tells every live agent when it fails."""

    def __init__(self, config: Config, checks: Checks, agents: Agents, nudger: Nudger, supervisor: SupervisorLink, cards: Cards) -> None:
        self.config, self.checks, self.agents, self.nudger, self.supervisor, self.cards = config, checks, agents, nudger, supervisor, cards

    def run(self, check: Check, by: Actor) -> Check:
        """The check run now, waited for."""
        return self.finished(self.checks.save(check.started(time.time()), by), by)

    def start(self, check: Check, by: Actor) -> Check:
        """The check run on a thread of its own, answered at once; one already running is left to finish."""
        if check.running is not None:
            return check
        begun = self.checks.save(check.started(time.time()), by)
        threading.Thread(target=self.finished, args=(begun, by), name=f"check-{begun.id}", daemon=True).start()
        return begun

    def finished(self, check: Check, by: Actor) -> Check:
        from journal.features.checks.feature import Checks as ChecksFeature
        report = self.config.home / "runtime" / "check-reports" / f"{check.id}.json"
        report.parent.mkdir(parents=True, exist_ok=True)
        report.unlink(missing_ok=True)
        ended = self.executed(check, report, by)
        was_failing = check.last_passed is False
        took = time.time() - check.running.at
        ran = self.checks.save(self.checks.find(check.id).ran(ended.passed, ended.output[-KEPT:], datetime.now(timezone.utc), took, self.report_of(report), ended.fault), by)
        if ran.waited_on:
            return ran
        tail = "\n".join(ended.output.strip().splitlines()[-TAIL:])
        for agent in self.agents.everywhere():
            if agent.state != Ended.name:
                self.cards.show(agent.environment_id, agent.session, f"Check {ran.title} {'passed' if ended.passed else 'failed'}", "check", "good" if ended.passed else "bad", tail, f"check:{ran.id}")
        if not ended.passed:
            said = ChecksFeature.FAILING if was_failing else ChecksFeature.FAILED
            for agent in self.agents.everywhere():
                if agent.state != Ended.name and (line := self.nudger.say(agent, said.about(n=ran.id, title=ran.title, tail=tail))):
                    self.supervisor.type(agent.environment_id, line)
        return ran

    def executed(self, check: Check, report: Path, by: Actor) -> FinishedRun:
        """The command run with its output read as it comes, its progress saved on the row now and then, cut off past the time-out."""
        process = subprocess.Popen(check.command, shell=True, cwd=self.config.root, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace",
                                   env={**os.environ, "JOURNAL_REPORT": str(report)}, start_new_session=True)
        late = threading.Timer(TIMEOUT, os.killpg, (process.pid, signal.SIGKILL))
        late.start()
        output, saved = "", time.time()
        for line in process.stdout:
            output += line
            if time.time() - saved >= EVERY:
                self.checks.touch(check, by, running=CheckOutput.progress(output, check.running.at))
                saved = time.time()
        code = process.wait()
        late.cancel()
        if code == -signal.SIGKILL:
            return FinishedRun(False, f"{output}\ntimed out after {TIMEOUT}s", f"it timed out after {TIMEOUT}s")
        return FinishedRun(code == 0, output, FAULTS.get(code, ""))

    @staticmethod
    def report_of(path: Path) -> CheckReport | None:
        """What the run wrote to its report file; none when it wrote none or wrote no JSON."""
        if not path.is_file():
            return None
        try:
            return CheckReport.from_json(json.loads(path.read_text()))
        except ValueError:
            return None
