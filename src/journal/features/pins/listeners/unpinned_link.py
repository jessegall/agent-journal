import re

from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.turn_written import TurnWritten
from journal.events.agent_listener import AgentListener
from journal.repositories.notices import Notices
from journal.supervisor_link import SupervisorLink

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
OWN = re.compile(r"^https?://(?:localhost|127\.0\.0\.1)[:/]|^https://github\.com/[^/]+/[^/]+/pull/\d+")
"""A link to the journal itself, or a pull request, which pins itself: no reminder for those."""


class UnpinnedLink(AgentListener[TurnWritten]):
    """A link the agent gives in the chat that no pin carries earns one reminder, with the command to pin it, so what the user will come back to is not lost as the chat scrolls."""

    def __init__(self, notices: Notices, nudger: Nudger, machine: Machine, supervisor: SupervisorLink) -> None:
        self.notices, self.nudger, self.machine, self.supervisor = notices, nudger, machine, supervisor

    def handle(self, event: TurnWritten) -> None:
        from journal.features.pins.feature import Pins
        if not event.final:
            return
        pinned = {n.link.rstrip("/") for n in self.notices.open_in()}
        loose = [url.rstrip(".,;:") for url in LINK.findall(event.text) if not OWN.match(url) and url.rstrip(".,;:").rstrip("/") not in pinned]
        agent = self.machine.agent(event.session, event.environment_id)
        for url in dict.fromkeys(loose):
            line = self.nudger.say(agent, Pins.UNPINNED.about(url=url))
            if line:
                self.supervisor.type(event.environment_id, line)
