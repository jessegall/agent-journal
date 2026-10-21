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
        return self.none(*start_block(event.data.part(feature), event.source), feature.OVERVIEW_REQUEST.create())

    def on_tool_starting_briefing(self, event: ToolStarting, settings: Settings) -> Transition:
        feature = briefing_feature()
        if event.subagent or not event.call.writes or event.data.part(feature).oriented:
            return self.none()
        return self.refuse(feature.OVERVIEW_REQUEST.create())

    def on_stop_briefing(self, event: Stop, settings: Settings) -> Transition:
        feature = briefing_feature()
        return self.none() if event.data.part(feature).oriented else self.refuse(feature.OVERVIEW_STOP.create())


def briefing_feature():
    from journal.features.briefing.feature import Briefing
    return Briefing


def start_block(briefing: BriefingData, source: str) -> list[Nudge]:
    feature = briefing_feature()
    takeover_time = "" if source == COMPACT else briefing.last_other_session_at
    optional = (
        (takeover_time, lambda: feature.TAKEOVER.create(time=takeover_time)),
        (briefing.rules, lambda: feature.ACTIVE_RULES.create(count=briefing.rules_count, rows=briefing.rules)),
        (briefing.facts, lambda: feature.ENVIRONMENT_FACTS.create(rows=briefing.facts)),
        (briefing.reminders, lambda: feature.ENVIRONMENT_REMINDERS.create(rows=briefing.reminders)),
        (briefing.waiting, lambda: feature.PENDING_ITEMS.create(rows=briefing.waiting)),
    )
    return [feature.JOURNAL_READY.create(env=briefing.environment), feature.JOURNAL_DISCRETION.create(), feature.JOURNAL_LAWS.create(), *(line() for matched, line in optional if matched)]
