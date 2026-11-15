from collections.abc import Mapping, Sequence

from engine.agent_stack.states.blocked import Blocked
from engine.agent_stack.states.paused import Paused
from engine.module.contribution_reader import ContributionReader
from engine.module.machine_check import MachineCheck
from engine.agent_machine.states.rank_order import RankOrder
from engine.agent_machine.driver import Driver
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.command.bus import Bus
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from engine.module.module import Module


class SampleDriver(Driver):
    name = "samples.main"
    agent_type = "main"
    rank_order = RankOrder((), ("samples.unread",))
    work_stop = WorkStop.REFUSE_WHILE_WORK_REMAINS
    responder = Responder.PERSON


class UnreadStates(StateSource):
    state_type = Blocked
    rank = "samples.unread"

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        return {}


class BusStates(UnreadStates):
    def __init__(self, bus: Bus) -> None:
        self.bus = bus


class PauseStates(UnreadStates):
    state_type = Paused


class SampleModule(Module):
    name = "journal.samples"
    requires_engine = "5.0.0"
    agent_drivers = [SampleDriver]
    states = [UnreadStates]


def problems(*states: type[StateSource]) -> tuple[str, ...]:
    module = type("CheckedModule", (SampleModule,), {"needs": [UnreadStates, *states]})
    return MachineCheck(ContributionReader()).problems([module])


def test_a_module_whose_lists_follow_the_contracts_syncs() -> None:
    assert problems() == ()


def test_a_need_source_that_takes_a_bus_is_refused_with_its_fix() -> None:
    assert any("BusNeeds: it takes a Bus: read rows through injected queries only" in problem for problem in problems(BusStates))


def test_a_need_for_a_state_the_engine_places_is_refused() -> None:
    assert any("a need may not ask for Paused" in problem for problem in problems(PauseStates))


def test_the_reader_keys_a_class_by_its_path_and_marks_a_module_outside_core() -> None:
    read = ContributionReader().read(SampleModule)
    assert (read.is_core, [entry.key for entry in read.contributions]) == (False, [f"{UnreadStates.__module__}.UnreadNeeds"])
