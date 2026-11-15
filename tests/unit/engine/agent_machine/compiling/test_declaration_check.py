from dataclasses import replace

import pytest

from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration
from engine.agent_machine.compiling.declaration_check import DeclarationCheck
from engine.agent_machine.compiling.module_contributions import ModuleContributions
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.compiling.open_owners import OpenOwners
from engine.agent_machine.compiling.program_declaration import ProgramDeclaration
from engine.agent_machine.contracts.capability import Capability
from engine.agent_machine.contracts.rank_order import RankOrder
from engine.enums.capability_fallback import CapabilityFallback
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.contribution_type import ContributionType
from engine.enums.block_end import BlockEnd
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.responder import Responder
from engine.enums.transform_slot import TransformSlot
from engine.enums.work_stop import WorkStop

MAIN = DriverDeclaration("core.main", "main", "core", (), RankOrder(("messages.show",), ("messages.unread",)), WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PERSON)
PROGRAM = ProgramDeclaration("claude", Capabilities(
    Capability(CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE),
    Capability(CapabilityPart.STOP_REFUSAL, HookEventName.STOP, CapabilityProof.IMPLEMENTED_HERE),
    Capability(CapabilityPart.LINES, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE)))
UNREAD = ContributionDeclaration("messages.unread-needs", ContributionType.NEED, "messages.unread", state_name="Blocked")
SHOW = ContributionDeclaration("messages.show-policy", ContributionType.POLICY, "messages.show")
MESSAGES = ModuleContributions("messages", True, (), (UNREAD, SHOW))


def fixes(*contributions: ContributionDeclaration, module: ModuleContributions = MESSAGES, drivers=(MAIN,), programs=(PROGRAM,)) -> list[str]:
    modules = [replace(module, contributions=(*module.contributions, *contributions))]
    return [refusal.text() for refusal in DeclarationCheck(drivers, modules, programs, ["main"]).refusals()]


def test_the_sample_declarations_compile_clean() -> None:
    assert fixes() == []


@pytest.mark.parametrize("contribution, fix", [
    (ContributionDeclaration("messages.worker-needs", ContributionType.NEED, "messages.unread", ("robot",), "Working"), "agent type robot has no driver"),
    (ContributionDeclaration("messages.odd-needs", ContributionType.NEED, state_name="Sleeping"), "state Sleeping is unknown"),
    (ContributionDeclaration("messages.pause-needs", ContributionType.NEED, state_name="Paused"), "a need may not ask for Paused"),
    (ContributionDeclaration("agent_stack", ContributionType.SUBJECT), "the machine's own tables are no subject"),
    (ContributionDeclaration("messages.late-line", ContributionType.LINE, events=(HookEventName.STOP,)), "give the line a waiting carrier"),
    (ContributionDeclaration("messages.bus-listener", ContributionType.AGENT_LISTENER, constructor_types=("Bus",)), "it takes a Bus"),
    (ContributionDeclaration("messages.file-needs", ContributionType.NEED, "messages.unread", state_name="Blocked", constructor_types=("FileAccess",)), "it takes a FileAccess"),
    (ContributionDeclaration("messages.hand-in", ContributionType.EFFECT, is_required=True), "declares its failure line and text"),
    (ContributionDeclaration("messages.read", ContributionType.BLOCK_CONDITION), "declares the ends it may take"),
    (ContributionDeclaration("messages.answered", ContributionType.BLOCK_CONDITION, ends=(BlockEnd.SATISFIED,)), "names the command lines that satisfy it"),
    (ContributionDeclaration("messages.ranked", ContributionType.POLICY, "messages.nowhere"), "no driver lists the rank key messages.nowhere"),
    (SHOW, "a policy key is declared once"),
])
def test_each_misuse_is_refused_with_its_fix(contribution: ContributionDeclaration, fix: str) -> None:
    assert any(fix in text for text in fixes(contribution)), fixes(contribution)


def test_a_line_with_a_waiting_carrier_may_sit_on_an_event_no_program_carries() -> None:
    assert fixes(ContributionDeclaration("messages.late-line", ContributionType.LINE, events=(HookEventName.STOP,), carrier=LineCarrier.WAITING)) == []


def test_a_safety_policy_from_a_suite_module_is_refused() -> None:
    suite_module = ModuleContributions("workers", False, (), (UNREAD, SHOW, ContributionDeclaration("workers.safety", ContributionType.POLICY, "messages.show", is_safety=True)))
    assert fixes(module=suite_module) == ["workers: workers.safety: a safety policy may only come from a core module"]


def test_two_transforms_in_one_slot_name_both_owners() -> None:
    first = ContributionDeclaration("messages.alias-one", ContributionType.TRANSFORM, slot=TransformSlot.ALIAS)
    second = ContributionDeclaration("messages.alias-two", ContributionType.TRANSFORM, slot=TransformSlot.ALIAS)
    assert fixes(first, second) == ["messages messages.alias-one, messages messages.alias-two: slot alias for main: one transform to a slot for each agent type"]


def test_a_rank_key_no_module_declares_is_refused() -> None:
    driver = replace(MAIN, rank_order=RankOrder(("messages.show", "tasks.gone"), ("messages.unread",)))
    assert fixes(drivers=(driver,)) == ["core.main: rank key tasks.gone: no module declares it: remove it from the rank order"]


def test_a_cycle_in_gathering_is_named() -> None:
    first = replace(MAIN, name="coding.main", suite="coding", gathers=("coding.other",))
    second = replace(MAIN, name="coding.other", suite="coding", gathers=("coding.main",))
    assert "core.main" not in "".join(text for text in fixes(drivers=(MAIN, first, second)) if "cycle" in text)
    assert any("coding.main > coding.other > coding.main" in text for text in fixes(drivers=(MAIN, first, second)))


def test_a_driver_gathering_another_suite_is_refused() -> None:
    other = replace(MAIN, name="research.main", suite="research")
    coding = replace(MAIN, name="coding.main", suite="coding", gathers=("research.main",))
    assert "coding.main: gathers research.main: a driver gathers a core driver or one of its own suite" in fixes(drivers=(MAIN, other, coding))


def test_an_agent_type_with_no_driver_and_a_driver_with_no_work_stop_are_refused() -> None:
    texts = [refusal.text() for refusal in DeclarationCheck([replace(MAIN, work_stop=None)], [MESSAGES], [PROGRAM], ["main", "worker"]).refusals()]
    assert texts == ["sync: agent type worker: declare a driver for it", "core.main: work_stop: a driver declares its work-stop contract"]


def test_a_missing_dependency_and_a_state_a_module_defines_are_refused() -> None:
    module = replace(MESSAGES, dependencies=("agents",), state_classes=("Reading",))
    assert fixes(module=module) == ["messages: dependency agents: the module it depends on is not installed",
                                    "messages: state Reading: a module never defines a state: declare a need for an engine state"]


def test_a_program_that_carries_no_stop_refusal_and_declares_no_fallback_is_refused() -> None:
    program = ProgramDeclaration("codex", Capabilities(Capability(CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE, CapabilityProof.DOCUMENTED_UPSTREAM,
                                                                  CapabilityFallback.PROCESS_RUN_REFUSAL)))
    assert fixes(programs=(PROGRAM, program)) == ["codex: stop-refusal at stop: declare the capability, or the fallback the step takes"]


class CountedOwners(OpenOwners):
    def open_count(self, module: str) -> int:
        return {"documents": 2}.get(module, 0)


def test_removing_a_module_that_owns_open_blocks_is_refused_unless_a_migration_ships() -> None:
    check = DeclarationCheck([MAIN], [MESSAGES], [PROGRAM], ["main"])
    assert [refusal.owner for refusal in check.removal_refusals(["documents", "pins"], [], CountedOwners())] == ["documents"]
    assert check.removal_refusals(["documents"], ["documents"], CountedOwners()) == []


def test_a_rank_key_a_driver_of_that_type_leaves_out_of_its_order_is_refused() -> None:
    worker = DriverDeclaration("coding.worker", "worker", "coding", (), RankOrder(("messages.show",), ()), WorkStop.REFUSE_WHILE_WORK_REMAINS, Responder.PARENT)
    texts = [refusal.text() for refusal in DeclarationCheck([MAIN, worker], [MESSAGES], [PROGRAM], ["main", "worker"]).refusals()]
    assert texts == ["coding.worker: rank key messages.unread of messages.unread-needs: add the rank key to the driver's rank order"]
