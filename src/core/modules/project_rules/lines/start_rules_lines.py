from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.project_rule import ProjectRule
from core.modules.project_rules.nudges.start_rules_nudge import StartRulesNudge


class StartRulesLines(EventLineSource):
    """At a session start and after a compaction, tells every agent how many project rules hold."""

    start_line = True
    key = "project_rules.start-rules"
    events = [HookEventName.SESSION_START]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        count = self.queries.query(ProjectRule).filter(state=RuleState.ACTIVE).count()
        return [StartRulesNudge.declared().nudge(count=count)] if count else []
