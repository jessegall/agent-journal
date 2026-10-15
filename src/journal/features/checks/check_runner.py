import subprocess
from datetime import datetime, timezone

from journal.config import Config
from journal.engine.cards import Cards
from journal.engine.nudger import Nudger
from journal.engine.states.ended import Ended
from journal.models.actor import Actor
from journal.models.check import Check
from journal.repositories.agents import Agents
from journal.repositories.checks import Checks
from journal.supervisor_link import SupervisorLink

TIMEOUT = 600
TAIL = 20


class CheckRunner:
    """Runs one check in the project root, keeps its result, and tells every live agent when it fails."""

    def __init__(self, config: Config, checks: Checks, agents: Agents, nudger: Nudger, supervisor: SupervisorLink, cards: Cards) -> None:
        self.config, self.checks, self.agents, self.nudger, self.supervisor, self.cards = config, checks, agents, nudger, supervisor, cards

    def run(self, check: Check, by: Actor) -> Check:
        from journal.features.checks.feature import Checks as ChecksFeature
        try:
            done = subprocess.run(check.command, shell=True, cwd=self.config.root, capture_output=True, text=True, timeout=TIMEOUT)
            passed, output = done.returncode == 0, (done.stdout + done.stderr)
        except subprocess.TimeoutExpired:
            passed, output = False, f"timed out after {TIMEOUT}s"
        was_failing = check.last_passed is False
        ran = self.checks.save(check.ran(passed, output[-4000:], datetime.now(timezone.utc)), by)
        tail = "\n".join(output.strip().splitlines()[-TAIL:])
        for agent in self.agents.all():
            if agent.state != Ended.name:
                self.cards.show(agent.environment_id, agent.session, f"Check {ran.title} {'passed' if passed else 'failed'}", "check", "good" if passed else "bad", tail, f"check:{ran.id}")
        if not passed:
            said = ChecksFeature.FAILING if was_failing else ChecksFeature.FAILED
            for agent in self.agents.all():
                if agent.state != Ended.name and (line := self.nudger.say(agent, said.about(n=ran.id, title=ran.title, tail=tail))):
                    self.supervisor.type(line)
        return ran
