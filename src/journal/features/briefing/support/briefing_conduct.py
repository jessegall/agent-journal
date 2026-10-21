from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.features.briefing.support.briefing_data import BriefingData

COMPACT = "compact"


class BriefingConduct(Conduct):
    """The briefing feature's conduct in every state: the start block at every session start, ready, quiet, the laws, a takeover, the rules, facts and reminders and what waits, then the look owed before the first write; a write and a stop held until the agent has looked at what is in flight."""

    def on_session_started_briefing(self, event: SessionStarted, settings: Settings) -> Transition:
        feature = briefing_feature()
        return self.unchanged(*start_block(event.data.of(feature), event.source), feature.LOOK_BEFORE_THE_FIRST_WRITE.create())

    def on_tool_starting_briefing(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = briefing_feature()
        if event.subagent or not event.call.writes or event.data.of(feature).oriented:
            return self.unchanged()
        return self.hold(feature.LOOK_BEFORE_THE_FIRST_WRITE.create())

    def on_idle_briefing(self, event: Idle, settings: Settings) -> Transition:
        feature = briefing_feature()
        return self.unchanged() if event.data.of(feature).oriented else self.hold(feature.STOPPED_UNORIENTED.create())


def briefing_feature():
    from journal.features.briefing.feature import Briefing
    return Briefing


def start_block(briefing: BriefingData, source: str) -> list[Nudge]:
    feature = briefing_feature()
    taken_over_at = "" if source == COMPACT else briefing.last_other_session_at
    optional = (
        (taken_over_at, lambda: feature.YOU_TOOK_OVER.create(time=taken_over_at)),
        (briefing.rules, lambda: feature.RULES_IN_FORCE.create(count=briefing.rules_count, rows=briefing.rules)),
        (briefing.facts, lambda: feature.FACTS_HERE.create(rows=briefing.facts)),
        (briefing.reminders, lambda: feature.REMINDERS_HERE.create(rows=briefing.reminders)),
        (briefing.waiting, lambda: feature.WAITING_FOR_YOU.create(rows=briefing.waiting)),
    )
    return [feature.JOURNAL_READY.create(env=briefing.environment), feature.HANDLE_THE_JOURNAL_QUIETLY.create(), feature.THE_LAWS_APPLY.create(), *(line() for named, line in optional if named)]
