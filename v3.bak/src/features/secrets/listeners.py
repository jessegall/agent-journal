from events import Fact
from events.agents import ClockTicked
from events.secrets import PurgeDue
from receiving import Listener
from serving import Clock

PURGE_EVERY = 3600


class SpotThePurgeHour(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, clock: Clock) -> list[Fact]:
        return [PurgeDue().once(f"purge|{int(clock.now() // PURGE_EVERY)}")]
