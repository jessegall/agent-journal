from pathlib import Path

from agents.terminal import LAUNCH, relaunch
from controllers.types import Agents
from engine.sessions import Sessions
from engine.version import version
from resources.base import SYSTEM
from resources.types import IDLE


class Relaunch:
    def __init__(self, agent):
        self.agent = agent

    def tick(self) -> str:
        driver, record = self.agent.driver, self.agent.record
        root = Path(record.root)
        if Sessions(root).read(driver.session).launch >= LAUNCH or self.agent.state() != IDLE:
            return ""
        last = driver.last_report()
        if not last or not last.title:
            return ""
        Agents(record, actor=SYSTEM).card(last.n, label=f"Restarted the agent in the same conversation to pick up journal {version()}", icon="agents", tone="good")
        relaunch(root, record.env, driver.session, last.title)
        return "relaunching"
