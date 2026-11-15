from abc import ABC, abstractmethod

from engine.agent_machine.record.question import Question
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer


class RuleHooks(ABC):
    """Asks an old rule at a step's hook, so a contribution of the new driver that the rule backs gets exactly
    what the rule walk gets; a step outside a hook has no answer. One answer serves every contribution the
    rule backs on that hook. The drivers module binds it."""

    @abstractmethod
    def answer(self, rule: type[DriverRule], question: Question, agent_id: int) -> RuleAnswer | None: ...
