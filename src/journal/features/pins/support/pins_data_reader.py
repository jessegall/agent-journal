import re

from journal.features.pins.support.pins_data import PinsData
from journal.models.agent import Agent
from journal.repositories.entries import Entries
from journal.repositories.notices import Notices
from journal.repositories.setting_rows import SettingRows

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")


class PinsDataReader:
    """Reads the pins feature's part of the feature data for an agent."""

    def __init__(self, notices: Notices, entries: Entries, settings: SettingRows) -> None:
        self.notices, self.entries, self.settings = notices, entries, settings

    def read(self, agent: Agent) -> PinsData:
        from journal.features.pins.feature import Pins
        every = int(self.settings.option(Pins.PIN_SUGGESTION_INTERVAL))
        suggested = tuple(url.rstrip("/") for line in self.entries.lines_said_since_use(agent.session, Pins.LINK_PIN_REQUEST.key, agent.tool_uses - every) for url in LINK.findall(line))
        return PinsData(pinned=tuple(n.link.rstrip("/") for n in self.notices.open_in()), suggested_lately=suggested)
