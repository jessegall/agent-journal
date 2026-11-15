from collections.abc import Sequence

from engine.agent_machine.compiling.declaration_refusal import DeclarationRefusal
from engine.agent_machine.compiling.declared_module import DeclaredModule
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.compiling.open_owners import OpenOwners
from engine.agent_machine.compiling.program_declaration import ProgramDeclaration
from engine.enums.capability_part import CapabilityPart
from engine.enums.contribution_kind import ContributionKind
from engine.enums.hold_end import HoldEnd
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier

NEED_STATES = ("Working", "Waiting", "Blocked", "Compacting")
ENGINE_PLACED_STATES = ("Stopped", "Paused", "Ended")
MACHINE_TABLES = ("agent_stack", "agent_stack_move", "agent_subjects", "agent_frame_suppression", "agent_escalation", "agent_wake",
                  "agent_step_request", "agent_launch", "driver_table", "driver_epoch", "program_epoch", "driver_grant", "admission_receipt",
                  "driver_shadow", "driver_shadow_stack")
SOURCE_FORBIDDEN_TYPES = ("Bus", "Launcher", "ChildProcess", "FileAccess")
LISTENER_FORBIDDEN_TYPES = ("Bus", "State")
PURE_KINDS = (ContributionKind.NEED, ContributionKind.FACT, ContributionKind.POLICY)
REQUIRED_PARTS = ((CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE), (CapabilityPart.STOP_REFUSAL, HookEventName.STOP))


class DeclarationCheck:
    """Everything sync refuses in the agent machine's declarations (doc 1310 section 5.3), each refusal naming the
    owner, the declaration and the fix; it reads declarations only, and asks the database only through OpenOwners."""

    def __init__(self, drivers: Sequence[DriverDeclaration], modules: Sequence[DeclaredModule], programs: Sequence[ProgramDeclaration],
                 agent_types: Sequence[str]) -> None:
        self.drivers, self.modules, self.programs, self.agent_types = drivers, modules, programs, agent_types

    def refusals(self) -> list[DeclarationRefusal]:
        return [*self.contribution_refusals(), *self.rank_refusals(), *self.key_refusals(), *self.driver_refusals(), *self.module_refusals(),
                *self.program_refusals()]

    def removal_refusals(self, removed_modules: Sequence[str], migrated_modules: Sequence[str], owners: OpenOwners) -> list[DeclarationRefusal]:
        return [DeclarationRefusal(module, f"{owners.open_count(module)} open holds or frames", "ship a migration that keeps them judgeable, closes them as cancelled, or marks them cannot be judged")
                for module in removed_modules if module not in migrated_modules and owners.open_count(module) > 0]

    def contribution_refusals(self) -> list[DeclarationRefusal]:
        refusals = []
        for module in self.modules:
            for entry in module.contributions:
                refusals += [DeclarationRefusal(module.name, entry.key, f"{fix}") for fix in self.entry_fixes(module, entry)]
        return refusals

    def entry_fixes(self, module: DeclaredModule, entry) -> list[str]:
        fixes = [f"agent type {agent_type} has no driver: name one of {', '.join(self.agent_types)}" for agent_type in entry.agent_types if agent_type not in self.agent_types]
        if entry.kind is ContributionKind.NEED and entry.state_name in ENGINE_PLACED_STATES:
            fixes.append(f"a need may not ask for {entry.state_name}: the engine places it from facts")
        elif entry.kind is ContributionKind.NEED and entry.state_name not in NEED_STATES:
            fixes.append(f"state {entry.state_name or 'none'} is unknown: a need asks for one of {', '.join(NEED_STATES)}")
        if entry.is_safety and not module.is_core:
            fixes.append("a safety policy may only come from a core module")
        if entry.kind is ContributionKind.SUBJECT and entry.key in MACHINE_TABLES:
            fixes.append("the machine's own tables are no subject")
        if entry.kind is ContributionKind.LINE and entry.carrier is not LineCarrier.WAITING and not self.carried_by_a_program(entry.events):
            fixes.append(f"no program carries lines on {', '.join(entry.events)}: give the line a waiting carrier")
        forbidden = LISTENER_FORBIDDEN_TYPES if entry.kind is ContributionKind.AGENT_LISTENER else SOURCE_FORBIDDEN_TYPES if entry.kind in PURE_KINDS else ()
        fixes += [f"it takes a {name}: read rows through injected queries only" for name in entry.constructor_types if name in forbidden]
        if entry.kind is ContributionKind.EFFECT and entry.is_required and not entry.has_failure:
            fixes.append("a required effect declares its failure kind and text")
        if entry.kind is ContributionKind.BLOCK_CONDITION and not entry.ends:
            fixes.append("a hold condition declares the ends it may take")
        if entry.kind is ContributionKind.BLOCK_CONDITION and HoldEnd.SATISFIED in entry.ends and not entry.lifting_lines:
            fixes.append("a hold that can be satisfied names the command lines that satisfy it")
        return fixes

    def carried_by_a_program(self, events: Sequence[HookEventName]) -> bool:
        return all(any(program.capabilities.carries(CapabilityPart.LINES, event) for program in self.programs) for event in events)

    def rank_refusals(self) -> list[DeclarationRefusal]:
        declared = {entry.rank for module in self.modules for entry in module.contributions if entry.rank}
        listed = {rank for driver in self.drivers for rank in (*driver.rank_order.policies, *driver.rank_order.blocks)}
        unknown = [DeclarationRefusal(module.name, entry.key, f"no driver lists the rank key {entry.rank}: the drivers list {', '.join(sorted(listed)) or 'none'}")
                   for module in self.modules for entry in module.contributions if entry.rank and entry.rank not in listed]
        unused = [DeclarationRefusal(driver.name, f"rank key {rank}", "no module declares it: remove it from the rank order")
                  for driver in self.drivers for rank in (*driver.rank_order.policies, *driver.rank_order.blocks) if rank not in declared]
        return [*unknown, *unused]

    def key_refusals(self) -> list[DeclarationRefusal]:
        owners: dict[tuple[str, str], list[str]] = {}
        for module in self.modules:
            for entry in module.contributions:
                owners.setdefault((entry.kind, entry.key), []).append(module.name)
        doubled = [DeclarationRefusal(", ".join(names), key, f"a {kind} key is declared once") for (kind, key), names in owners.items() if len(names) > 1]
        slots: dict[tuple[str, str], list[str]] = {}
        for module in self.modules:
            for entry in module.contributions:
                if entry.kind is ContributionKind.TRANSFORM and entry.slot is not None:
                    for agent_type in entry.agent_types or tuple(self.agent_types):
                        slots.setdefault((agent_type, entry.slot), []).append(f"{module.name} {entry.key}")
        crowded = [DeclarationRefusal(", ".join(names), f"slot {slot} for {agent_type}", "one transform to a slot for each agent type")
                   for (agent_type, slot), names in slots.items() if len(names) > 1]
        return [*doubled, *crowded]

    def driver_refusals(self) -> list[DeclarationRefusal]:
        by_name = {driver.name: driver for driver in self.drivers}
        refusals = [DeclarationRefusal("sync", f"agent type {agent_type}", "declare a driver for it") for agent_type in self.agent_types
                    if agent_type not in {driver.agent_type for driver in self.drivers}]
        refusals += [DeclarationRefusal(driver.name, "work_stop", "a driver declares its work-stop contract") for driver in self.drivers if driver.work_stop is None]
        refusals += [DeclarationRefusal(driver.name, f"gathers {name}", "a driver gathers a core driver or one of its own suite")
                     for driver in self.drivers for name in driver.gathers if name in by_name and by_name[name].suite not in ("core", driver.suite)]
        refusals += [DeclarationRefusal(driver.name, "gathers", f"the gathering is a cycle: {' > '.join(cycle)}") for driver in self.drivers
                     if (cycle := self.gathering_cycle(driver, by_name))]
        return refusals

    @staticmethod
    def gathering_cycle(driver: DriverDeclaration, by_name: dict[str, DriverDeclaration]) -> list[str]:
        path, current = [driver.name], list(driver.gathers)
        while current:
            name = current.pop()
            if name == driver.name:
                return [*path, name]
            if name in by_name and name not in path:
                path.append(name)
                current += by_name[name].gathers
        return []

    def module_refusals(self) -> list[DeclarationRefusal]:
        names = {module.name for module in self.modules}
        missing = [DeclarationRefusal(module.name, f"dependency {dependency}", "the module it depends on is not installed")
                   for module in self.modules for dependency in module.dependencies if dependency not in names]
        states = [DeclarationRefusal(module.name, f"state {state}", "a module never defines a state: declare a need for an engine state")
                  for module in self.modules for state in module.state_classes]
        return [*missing, *states]

    def program_refusals(self) -> list[DeclarationRefusal]:
        return [DeclarationRefusal(program.name, f"{part} at {event}", "declare the capability, or the fallback the step takes")
                for program in self.programs for part, event in REQUIRED_PARTS if program.capabilities.capability(part, event) is None]
