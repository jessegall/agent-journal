from engine.helper_type.helper_type_book import HelperTypeBook
from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TypeVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.agent_state_machine import AgentStateMachine
from engine.container.container import Container
from engine.module.module import Module
from engine.module.module_finder import ModuleFinder

Contribution = TypeVar("Contribution")


class MachineAssembly:
    """The one assembler of the agent machine: every contribution the installed modules
    list, built through the container, and for one agent type the machine of those that cover it and its
    view filled with the needs and plans its need sources give."""

    def __init__(self, finder: ModuleFinder, container: Container, types: HelperTypeBook) -> None:
        self.finder, self.container, self.types = finder, container, types

    def machine(self, agent_type: str) -> AgentStateMachine:
        return AgentStateMachine(self.covering(agent_type, lambda module: module.policies), [self.container.get(cls) for cls, module in self.listed(lambda module: module.transforms)],
                            self.covering(agent_type, lambda module: module.lines), self.covering(agent_type, lambda module: module.effects),
                            [self.container.get(cls) for cls, module in self.listed(lambda module: module.wake_causes)])

    def with_needs(self, view: AgentView, question: Question) -> AgentView:
        sources = self.covering(view.agent.agent_type, lambda module: module.needs)
        given = [item for source in sources for item in source.needs([view.agent], question).get(view.agent.agent_id, ())]
        needs = tuple(item for item in given if isinstance(item, RequiredState))
        ended_subjects = view.stack.subjects_without({need.key for need in needs})
        ends = {subject: end for source in sources for subject, end in (source.ends(ended_subjects).items() if ended_subjects else ())}
        return replace(view, needs=needs, plans=tuple(item for item in given if isinstance(item, BlockPlan)), subject_ends=ends)

    # policies, lines, effects and need sources name the agent types they apply to, none named being every type, and the
    # group of types they hold for
    def covering(self, agent_type: str, lists: Callable[[type[Module]], Sequence[type[Contribution]]]) -> list[Contribution]:
        return [self.container.get(cls) for cls, module in self.listed(lists) if self.covers(cls, agent_type)]

    def covers(self, contribution: type[Policy] | type[LineSource] | type[Effect] | type[StateSource], agent_type: str) -> bool:
        # a type named covers the types built on it, as a rule naming the helper role covers every kind of helper
        return (not contribution.agent_types or any(key in contribution.agent_types for key in self.types.type_keys(agent_type))) and contribution.role_group.has_role(agent_type, self.types)

    def listed(self, lists: Callable[[type[Module]], Sequence[type[Contribution]]]) -> list[tuple[type[Contribution], type[Module]]]:
        return [(cls, module) for module in self.finder.modules() for cls in lists(module)]
