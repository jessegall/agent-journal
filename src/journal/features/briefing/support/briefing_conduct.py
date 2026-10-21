from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.features.briefing.support.briefing_data import BriefingData

COMPACT = "compact"


class BriefingConduct(Conduct):
    """The briefing feature's conduct in every state: the start block at every session start, ready, quiet, the laws, a takeover, the rules, facts and reminders and what waits, then the look owed before the first write; a write and a stop held until the agent has looked at what is in flight."""

    def on_session_started_briefing(self, event: SessionStarted, settings: Settings) -> Transition:
        feature = briefing_feature()
        return self.unchanged(*start_block(event.data.of(feature), event.source), feature.OVERVIEW_REQUEST.create())

    def on_tool_starting_briefing(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = briefing_feature()
        if event.subagent or not event.call.writes or event.data.of(feature).oriented:
            return self.unchanged()
        return self.hold(feature.OVERVIEW_REQUEST.create())

    def on_stop_briefing(self, event: Stop, settings: Settings) -> Transition:
        feature = briefing_feature()
        return self.unchanged() if event.data.of(feature).oriented else self.hold(feature.OVERVIEW_STOP.create())


def briefing_feature():
    from journal.features.briefing.feature import Briefing
    return Briefing


def start_block(briefing: BriefingData, source: str) -> list[Nudge]:
    feature = briefing_feature()
    taken_over_at = "" if source == COMPACT else briefing.last_other_session_at
    optional = (
        (taken_over_at, lambda: feature.TAKEOVER.create(time=taken_over_at)),
        (briefing.rules, lambda: feature.ACTIVE_RULES.create(count=briefing.rules_count, rows=briefing.rules)),
        (briefing.facts, lambda: feature.ENVIRONMENT_FACTS.create(rows=briefing.facts)),
        (briefing.reminders, lambda: feature.ENVIRONMENT_REMINDERS.create(rows=briefing.reminders)),
        (briefing.waiting, lambda: feature.PENDING_ITEMS.create(rows=briefing.waiting)),
    )
    return [feature.JOURNAL_READY.create(env=briefing.environment), feature.JOURNAL_DISCRETION.create(), feature.JOURNAL_LAWS.create(), *(line() for named, line in optional if named)]
