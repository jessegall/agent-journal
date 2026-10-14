from events import Fact
from events.agents import ToolCallAnswered
from events.heavy_runs import HeavyRunHeld, HeavyRunStarted
from features.heavy_runs.holding import ahead_of
from engine.journal_calls import runs_tests
from receiving import Listener
from serving import Clock, ReadElsewhere


class SpotHeavyRun(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, elsewhere: ReadElsewhere, clock: Clock) -> list[Fact]:
        if not event.command or not runs_tests(event.command):
            return []
        ahead = ahead_of(elsewhere.here().record, event.command)
        if not ahead:
            return [HeavyRunStarted(agent=event.agent)]
        return [HeavyRunHeld(agent=event.agent, command=event.command, ahead=ahead[0][1], where=ahead[0][0], at=clock.now())]
