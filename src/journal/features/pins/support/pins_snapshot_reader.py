import re

from journal.features.pins.support.pins_snapshot import PinsSnapshot
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.notices import Notices
from journal.repositories.setting_rows import SettingRows

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")


class PinsSnapshotReader:
    """Reads the pins feature's part of the Snapshot for an agent."""

    def __init__(self, notices: Notices, entries: Entries, settings: SettingRows) -> None:
        self.notices, self.entries, self.settings = notices, entries, settings

    def read(self, agent: Agent) -> PinsSnapshot:
        from journal.features.pins.feature import Pins
        every = int(self.settings.option(Pins.SUGGEST_EVERY))
        own = [e for e in self.entries.tool_starts(agent.session, every * 2) if not (e.data.get("agent_id") or e.data.get("subagent_id"))][:every]
        since = own[-1].id if len(own) >= every else 0
        lately = tuple(url.rstrip("/") for line in self.entries.lines_said_after(agent.session, Pins.PIN_THE_LINK.key, since) for url in LINK.findall(line))
        return PinsSnapshot(pinned=tuple(n.link.rstrip("/") for n in self.notices.open_in()), suggested_lately=lately)
