from events import Fact
from events.nudges import NudgeAsksToAct, NudgeDueAgain, StandingNudgeAnswered, StandingNudgeGone, StandingNudgesLost
from features.nudges.standing import Standing, close, keep, standing
from receiving import Handler
from resources.types import Nudge
from serving import Remembered, Rows


class KeepNudgeStanding(Handler[NudgeAsksToAct]):
    def handle(self, event: NudgeAsksToAct, memory: Remembered, nudges: Rows[Nudge]) -> list[Fact]:
        made, before = Standing.of(nudges.load(event.nudge)), standing(memory)
        replaced = [s for s in before if s.is_replaced_by(made)]
        keep(memory, [*(s for s in before if s not in replaced), made])
        close(nudges, replaced, f"replaced by nudge {made.n}")
        return []


class ForgetNudge(Handler[StandingNudgeGone]):
    def handle(self, event: StandingNudgeGone, memory: Remembered) -> list[Fact]:
        keep(memory, [s for s in standing(memory) if s.n != event.nudge])
        return []


class ClearWhenAnswered(Handler[StandingNudgeAnswered]):
    def handle(self, event: StandingNudgeAnswered, memory: Remembered, nudges: Rows[Nudge]) -> list[Fact]:
        before = standing(memory)
        touched = [s for s in before if s.is_answered_by(event)]
        narrowed = {s.n: s.struck(event) for s in touched}
        answered = [s for s in touched if not narrowed[s.n].named(event.type)]
        keep(memory, [narrowed.get(s.n, s) for s in before if s not in answered])
        close(nudges, answered, f"answered by {event.type} {event.n}, {event.action}")
        return []


class LetGoOfLostNudges(Handler[StandingNudgesLost]):
    def handle(self, event: StandingNudgesLost, memory: Remembered, nudges: Rows[Nudge]) -> list[Fact]:
        before = standing(memory)
        keep(memory, [s for s in before if s.n in event.kept])
        close(nudges, [s for s in before if s.n in event.elsewhere], "said to a session that is no longer the agent's")
        close(nudges, [s for s in before if s.n in event.gone], "what it asked about is gone")
        return []


class AskAgain(Handler[NudgeDueAgain]):
    def handle(self, event: NudgeDueAgain, memory: Remembered, nudges: Rows[Nudge]) -> list[Fact]:
        asked = nudges.load(event.nudge)
        standing_row = next(s for s in standing(memory) if s.n == event.nudge)
        nudges.create(asked.title, abstract=asked.abstract, brief=asked.brief, **{**asked.data, "rows": list(standing_row.rows)})
        return []
