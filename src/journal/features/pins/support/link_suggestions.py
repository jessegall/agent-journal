import re
from datetime import datetime, timezone

from journal.engine.state_machine import StateMachine
from journal.engine.nudger import Nudger
from journal.repositories.entries import Entries
from journal.repositories.notices import Notices
from journal.repositories.setting_rows import SettingRows

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
OWN = re.compile(r"^https?://(?:localhost|127\.0\.0\.1)[:/]")
"""A link to the journal itself, which needs no pin."""


class LinkSuggestions:
    """The links in some words that no pin carries, each suggested as a pin once, and again only after so many of the agent's own tool uses."""

    def __init__(self, notices: Notices, nudger: Nudger, machine: StateMachine, entries: Entries, settings: SettingRows) -> None:
        self.notices, self.nudger, self.machine, self.entries, self.settings = notices, nudger, machine, entries, settings

    def lines(self, session: str, environment_id: int, text: str) -> list[str]:
        from journal.features.pins.feature import Pins
        pinned = {n.link.rstrip("/") for n in self.notices.open_in()}
        loose = [url.rstrip(".,;:") for url in LINK.findall(text) if not OWN.match(url) and url.rstrip(".,;:").rstrip("/") not in pinned]
        agent = self.machine.agent(session, environment_id)
        every = int(self.settings.option(Pins.SUGGEST_EVERY))
        said = []
        for url in dict.fromkeys(loose):
            suggestion = Pins.PIN_THE_LINK.create(url=url)
            last = self.entries.last_said(session, suggestion.key, suggestion.rendered())
            if last and self.uses_since(session, last) < every:
                continue
            line = self.nudger.say(agent, suggestion)
            if line:
                said.append(line)
        return said

    def uses_since(self, session: str, at: float) -> int:
        since = datetime.fromtimestamp(at, timezone.utc)
        return len([e for e in self.entries.tool_starts(session) if e.created_at > since and not (e.data.get("agent_id") or e.data.get("subagent_id"))])
