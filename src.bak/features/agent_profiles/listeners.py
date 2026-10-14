from events import Fact
from events.agent_profiles import ProfilesChosen
from events.features import FeatureUpdated
from receiving import Listener


class SpotProfileModels(Listener[FeatureUpdated]):
    def listen(self, event: FeatureUpdated) -> list[Fact]:
        return [ProfilesChosen()] if event.setting == "agent_profiles" else []
