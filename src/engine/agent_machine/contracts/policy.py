from engine.agent.enums.role_group import RoleGroup
from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import ClassVar

from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.record.question import Question
from engine.command.command import Command
from engine.enums.grant_type import GrantType


class Policy(ABC):
    """A pure judgement of an action from the agent's rows, type and profile, the settings and the usable
    grants; it never moves the stack, and the commands it names ask it again at their entry point. A safety
    policy is passed by no grant."""

    key: ClassVar[str]
    rank: ClassVar[str]
    agent_types: ClassVar[Sequence[str]] = ()
    # the group of agent types it holds for, read from the helper types as the old walk read a rule's
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    is_safety: ClassVar[bool] = False
    # a policy that also judges a stop, as a project's own hook refusing its stop does; no other policy judges one
    judges_stops: ClassVar[bool] = False
    grant_types: ClassVar[Sequence[GrantType]] = ()
    entry_point_commands: ClassVar[Sequence[type[Command[object]]]] = ()

    @abstractmethod
    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]: ...

    # the same judgement asked at the entry point of one of its entry point commands, where no hook came first
    def entry_point_refusals(self, command: Command[object], agent: AgentReference) -> Sequence[Reason]:
        return []
