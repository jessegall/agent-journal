from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from engine.driver.hook_reply import HookReply

if TYPE_CHECKING:
    from engine.agent_machine.decision_record import DecisionRecord


class Printer(ABC):
    """A provider's encoder of a decision record into its program's own answer; it never changes the decision."""

    @abstractmethod
    def encoded(self, record: DecisionRecord) -> HookReply: ...
