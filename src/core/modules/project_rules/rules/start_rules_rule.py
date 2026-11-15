from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.queries import Queries
from engine.agent.enums.role_group import RoleGroup
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.project_rule import ProjectRule
from core.modules.project_rules.nudges.start_rules_nudge import StartRulesNudge


class StartRulesRule(DriverRule):
    """At a session start and after a compaction, tells every agent how many project rules hold."""

    name = "project_rules.start-rules"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    role_group = RoleGroup.ANY

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        count = self.queries.query(ProjectRule).filter(state=RuleState.ACTIVE).count()
        return RuleAnswer.with_nudges(StartRulesNudge.declared().nudge(count=count)) if count else RuleAnswer.allowed()
