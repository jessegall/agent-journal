from events import Fact
from events.agent_profiles import ProfilesChosen
from framework.agent_types import written
from receiving import Handler
from serving import Elsewhere


class WriteTheProfiles(Handler[ProfilesChosen]):
    def handle(self, event: ProfilesChosen, elsewhere: Elsewhere) -> list[Fact]:
        here = elsewhere.here()
        written(here.record.root.parent, here.record)
        return []
