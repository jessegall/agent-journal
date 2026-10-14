from events import Fact
from events.features import FeatureUpdated
from events.form_of_address import VoiceChanged
from receiving import Listener
from resources.types import AgentRow
from serving import ReadRows


class SpotVoiceChange(Listener[FeatureUpdated]):
    def listen(self, event: FeatureUpdated, agents: ReadRows[AgentRow]) -> list[Fact]:
        primary = agents.primary_to_read()
        if event.setting != "form_of_address" or primary is None:
            return []
        return [VoiceChanged(agent=primary.n)]
