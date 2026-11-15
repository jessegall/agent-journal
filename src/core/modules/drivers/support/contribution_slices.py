from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.contracts.wake_cause import WakeCause
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.states.working import Working
from engine.module.module import Module
from engine.module.module_finder import ModuleFinder

SAFETY_SLICE, ADMISSION_SLICE, WAITING_SLICE, LINES_SLICE = "safety", "admission", "waiting", "lines"
Contribution = NeedSource | Policy | LineSource | Effect | Transform | WakeCause


class ContributionSlices:
    """The slice each contribution goes live with (doc 1310 section 10.0): a block's need with its module's
    blocked slice, a work need with the agent type's working slice, a wait with waiting, a safety policy and
    the other states with safety, a policy or transform with admission, a line or an effect with lines; and
    the old rules that stand down for an agent once every slice of the contributions that replace them is in
    force."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.finder = finder

    @staticmethod
    def slice_name(contribution: type[Contribution], module: type[Module], agent_type: str) -> str:
        if issubclass(contribution, NeedSource):
            return ContributionSlices.need_slice(contribution, module, agent_type)
        if issubclass(contribution, Policy):
            return SAFETY_SLICE if contribution.is_safety else ADMISSION_SLICE
        if issubclass(contribution, Transform):
            return ADMISSION_SLICE
        if issubclass(contribution, WakeCause):
            return WAITING_SLICE
        return LINES_SLICE

    @staticmethod
    def need_slice(source: type[NeedSource], module: type[Module], agent_type: str) -> str:
        if issubclass(source.state_type, Blocked):
            return f"blocked.{module.name.rpartition('.')[2]}"
        if issubclass(source.state_type, Working):
            return f"working.{agent_type}"
        if issubclass(source.state_type, Waiting):
            return WAITING_SLICE
        return SAFETY_SLICE

    def machine_answered(self, agent_slices: frozenset[str], agent_type: str) -> frozenset[str]:
        if not agent_slices:
            return frozenset()
        slices: dict[str, set[str]] = {}
        for module in self.finder.modules():
            for contribution in (*module.needs, *module.policies, *module.lines, *module.effects):
                for rule in contribution.replaced_rules:
                    slices.setdefault(rule, set()).add(self.slice_name(contribution, module, agent_type))
        return frozenset(rule for rule, rule_slices in slices.items() if rule_slices <= agent_slices)
