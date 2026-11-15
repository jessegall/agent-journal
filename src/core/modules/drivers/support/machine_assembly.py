from collections.abc import Callable, Sequence
from dataclasses import replace
from typing import TypeVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.agent_machine import AgentMachine
from engine.container.container import Container
from engine.module.module import Module
from engine.module.module_finder import ModuleFinder
from core.modules.drivers.support.contribution_slices import ContributionSlices

Contribution = TypeVar("Contribution")
Kept = Callable[[type, type[Module]], bool]


class MachineAssembly:
    """The one assembler of the agent machine (doc 1310 section 13.2): every contribution the installed modules
    list, built through the container, and for one agent type the machine of those that cover it and its
    view filled with the needs and plans its need sources give, whole for the comparison or cut to the
    slices in force."""

    def __init__(self, finder: ModuleFinder, container: Container) -> None:
        self.finder, self.container = finder, container

    def machine(self, agent_type: str) -> AgentMachine:
        return self.built_machine(agent_type, lambda contribution, module: True, ())

    def sliced_machine(self, agent_type: str, agent_slices: frozenset[str], walk: Policy) -> AgentMachine:
        return self.built_machine(agent_type, self.slice_filter(agent_type, agent_slices), tuple([walk]))

    def with_needs(self, view: AgentView, question: Question) -> AgentView:
        return self.with_kept_needs(view, question, lambda contribution, module: True)

    def with_sliced_needs(self, view: AgentView, question: Question, agent_slices: frozenset[str]) -> AgentView:
        return self.with_kept_needs(view, question, self.slice_filter(view.agent.agent_type, agent_slices))

    def built_machine(self, agent_type: str, kept: Kept, walk: Sequence[Policy]) -> AgentMachine:
        return AgentMachine([*self.covering(agent_type, lambda module: module.policies, kept), *walk], [self.container.get(cls) for cls, module in self.listed(lambda module: module.transforms) if kept(cls, module)],
                            self.covering(agent_type, lambda module: module.lines, kept), self.covering(agent_type, lambda module: module.effects, kept),
                            [self.container.get(cls) for cls, module in self.listed(lambda module: module.wake_causes) if kept(cls, module)])

    def with_kept_needs(self, view: AgentView, question: Question, kept: Kept) -> AgentView:
        sources = self.covering(view.agent.agent_type, lambda module: module.needs, kept)
        given = [item for source in sources for item in source.needs([view.agent], question).get(view.agent.agent_id, ())]
        needs = tuple(item for item in given if isinstance(item, Need))
        ended_subjects = view.stack.subjects_without({need.key for need in needs})
        ends = {subject: end for source in sources for subject, end in (source.ends(ended_subjects).items() if ended_subjects else ())}
        return replace(view, needs=needs, plans=tuple(item for item in given if isinstance(item, BlockPlan)), subject_ends=ends)

    @staticmethod
    def slice_filter(agent_type: str, agent_slices: frozenset[str]) -> Kept:
        return lambda contribution, module: ContributionSlices.slice_name(contribution, module, agent_type) in agent_slices

    # policies, lines, effects and need sources name the agent types they apply to; none named is every type
    def covering(self, agent_type: str, lists: Callable[[type[Module]], Sequence[type[Contribution]]], kept: Kept) -> list[Contribution]:
        return [self.container.get(cls) for cls, module in self.listed(lists) if (not cls.agent_types or agent_type in cls.agent_types) and kept(cls, module)]

    def listed(self, lists: Callable[[type[Module]], Sequence[type[Contribution]]]) -> list[tuple[type[Contribution], type[Module]]]:
        return [(cls, module) for module in self.finder.modules() for cls in lists(module)]
