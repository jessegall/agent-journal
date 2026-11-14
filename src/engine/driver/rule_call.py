from dataclasses import dataclass

from engine.driver.agent_hook import AgentHook
from engine.registry.driver_rule_entry import DriverRuleEntry


@dataclass(frozen=True)
class RuleCall:
    entry: DriverRuleEntry
    hook: AgentHook
