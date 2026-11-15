from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.project_rule import ProjectRule
from core.modules.project_rules.agent_messages.start_rules_message import StartRulesMessage


class StartRulesLines(EventLineSource):
    """At a session start and after a compaction, tells every agent how many project rules hold."""

    start_line = True
    key = "project_rules.start-rules"
    events = [HookEventName.SESSION_START]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        count = self.queries.query(ProjectRule).filter(state=RuleState.ACTIVE).count()
        return [StartRulesMessage.declared().agent_message(count=count)] if count else []
