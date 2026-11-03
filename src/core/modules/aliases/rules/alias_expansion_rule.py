from core.base.caller.caller import Caller
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_workers import AliasWorkers
from core.modules.aliases.support.alias_nudges import ALIAS_REFUSAL


class AliasExpansionRule(DriverRule):
    """Refuses failed alias expansions and keeps worker permissions on expanded aliases."""

    name = "aliases.expansion"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    essential = True
    overlay_proof = True

    def __init__(self, aliases: AliasQuery, workers: AliasWorkers) -> None:
        self.aliases, self.workers = aliases, workers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not shell.alias_names:
            return RuleAnswer.allowed()
        if shell.parse_error:
            return RuleAnswer.refused(ALIAS_REFUSAL.nudge(text=f"the alias could not be expanded: {shell.parse_error}; fix it with journal alias edit {shell.alias_names[0]}"))
        for name in shell.alias_names:
            rows = self.aliases.with_name(name).page(1, 1).rows
            if not rows:
                return RuleAnswer.refused(ALIAS_REFUSAL.nudge(text=f"the alias {name} no longer exists; check journal alias list"))
            if refusal := self.workers.refusal(rows[0], Caller(Actor(hook.agent_id, ActorType.AGENT))):
                return RuleAnswer.refused(ALIAS_REFUSAL.nudge(text=refusal.text))
        return RuleAnswer.allowed()
