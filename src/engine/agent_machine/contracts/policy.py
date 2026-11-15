from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import ClassVar

from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question
from engine.command.command import Command
from engine.enums.grant_type import GrantType


class Policy(ABC):
    """A pure judgement of an action from the agent's rows, type and profile, the settings and the usable
    grants; it never moves the stack, and the commands it names ask it again at their entrance. A safety
    policy is passed by no grant."""

    key: ClassVar[str]
    rank: ClassVar[str]
    agent_types: ClassVar[Sequence[str]] = ()
    is_safety: ClassVar[bool] = False
    grant_types: ClassVar[Sequence[GrantType]] = ()
    entrance_commands: ClassVar[Sequence[type[Command[object]]]] = ()

    @abstractmethod
    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]: ...
