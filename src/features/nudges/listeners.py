from declaring.trigger import MINUTE
from events import Fact
from events.agents import ClockTicked
from events.nudges import NudgeCreated, NudgeDueAgain, NudgeAsksToAct, StandingNudgeAnswered, StandingNudgeGone, StandingNudgesLost
from events.resources import GONE, RowChanged
from features.nudges.standing import Standing, standing, still_open
from receiving import Listener
from resources.types import AgentRow, Nudge, Work
from serving import Clock, ReadElsewhere, ReadRemembered, ReadRows, Settings


class SpotNudgeThatStands(Listener[NudgeCreated]):
    def listen(self, event: NudgeCreated, nudges: ReadRows[Nudge]) -> list[Fact]:
        return [NudgeAsksToAct(nudge=event.n)] if nudges.peek(event.n).until else []


class SpotRowThatAnswers(Listener[RowChanged]):
    def listen(self, event: RowChanged, memory: ReadRemembered) -> list[Fact]:
        if event.type == Nudge.type:
            return [StandingNudgeGone(nudge=event.n)] if event.action in GONE else []
        return [StandingNudgeAnswered(type=event.type, n=event.n, action=event.action)] if any(s.is_answered_by(event) for s in standing(memory)) else []


def waiting_on_the_user(works: ReadRows[Work], agent: AgentRow) -> bool:
    return any(w.awaiting for w in works.rows.standing() if w.agent in ("", agent.title))


class SpotStandingNudgesToAsk(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, memory: ReadRemembered, agents: ReadRows[AgentRow], nudges: ReadRows[Nudge], works: ReadRows[Work],
               elsewhere: ReadElsewhere, settings: Settings, clock: Clock) -> list[Fact]:
        before, primary = standing(memory), agents.primary_to_read()
        if not before or primary is None or primary.n != event.agent:
            return []
        here, open_rows = elsewhere.here(), still_open(nudges)
        away = [s for s in before if s.session != primary.title]
        gone = [s for s in before if s not in away and not s.is_owed(here)]
        kept = [s for s in before if s.n in open_rows and s not in away and s not in gone]
        found = [StandingNudgesLost(elsewhere=tuple(s.n for s in away), gone=tuple(s.n for s in gone), kept=tuple(s.n for s in kept))] if len(kept) < len(before) else []
        every = float(settings.every) * MINUTE
        if not every or waiting_on_the_user(works, primary):
            return found
        return found + [NudgeDueAgain(nudge=s.n) for s in kept if s.is_due(every, clock.now())]
