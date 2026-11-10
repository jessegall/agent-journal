from dataclasses import dataclass

from core.base.driver.agent_hook import AgentHook
from engine.registry.driver_rule_entry import DriverRuleEntry


@dataclass(frozen=True)
class RuleCall:
    entry: DriverRuleEntry
    hook: AgentHook
