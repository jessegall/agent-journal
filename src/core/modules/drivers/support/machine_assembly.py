from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TypeVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.agent_machine import AgentMachine
from engine.container.container import Container
from engine.module.module import Module
from engine.module.module_finder import ModuleFinder

Contribution = TypeVar("Contribution")


class MachineAssembly:
    """The one assembler of the agent machine (doc 1310 section 13.2): every contribution the installed modules
    list, built through the container, and for one agent type the machine of those that cover it and its
    view filled with the needs and plans its need sources give."""

    def __init__(self, finder: ModuleFinder, container: Container) -> None:
        self.finder, self.container = finder, container

    def machine(self, agent_type: str) -> AgentMachine:
        return AgentMachine(self.covering(agent_type, lambda module: module.policies), [self.container.get(cls) for cls in self.listed(lambda module: module.transforms)],
                            self.covering(agent_type, lambda module: module.lines), self.covering(agent_type, lambda module: module.effects),
                            [self.container.get(cls) for cls in self.listed(lambda module: module.wake_causes)])

    def with_needs(self, view: AgentView, question: Question) -> AgentView:
        given = [item for source in self.covering(view.agent.agent_type, lambda module: module.needs)
                 for item in source.needs([view.agent], question).get(view.agent.agent_id, ())]
        return replace(view, needs=tuple(item for item in given if isinstance(item, Need)), plans=tuple(item for item in given if isinstance(item, BlockPlan)))

    # policies, lines, effects and need sources name the agent types they apply to; none named is every type
    def covering(self, agent_type: str, lists: Callable[[type[Module]], Sequence[type[Contribution]]]) -> list[Contribution]:
        return [self.container.get(cls) for cls in self.listed(lists) if not cls.agent_types or agent_type in cls.agent_types]

    def listed(self, lists: Callable[[type[Module]], Sequence[type[Contribution]]]) -> list[type[Contribution]]:
        return [cls for module in self.finder.modules() for cls in lists(module)]
