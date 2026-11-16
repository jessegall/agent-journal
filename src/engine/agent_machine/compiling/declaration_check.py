from collections.abc import Sequence

from engine.agent_machine.compiling.contribution_declaration import ContributionDeclaration
from engine.agent_machine.compiling.declaration_finding import DeclarationFinding
from engine.agent_machine.compiling.module_contributions import ModuleContributions
from engine.agent_machine.compiling.driver_declaration import DriverDeclaration
from engine.agent_machine.compiling.open_owners import OpenOwners
from engine.agent_machine.compiling.program_declaration import ProgramDeclaration
from engine.enums.capability_part import CapabilityPart
from engine.enums.contribution_type import ContributionType
from engine.enums.block_end import BlockEnd
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_channel import LineChannel

REQUIRED_STATE_NAMES = ("Working", "Waiting", "Blocked", "Compacting")
ENGINE_PLACED_STATES = ("Stopped", "Paused", "Ended")
MACHINE_TABLES = ("agent_stack", "agent_stack_move", "hidden_state", "agent_escalation", "agent_wake", "agent_step_request",
                  "agent_launch", "driver_table", "driver_version", "program_version", "driver_grant", "used_grant_record")
SOURCE_FORBIDDEN_TYPES = ("Bus", "Launcher", "ChildProcess", "FileAccess")
FORBIDDEN_TYPES = {ContributionType.AGENT_LISTENER: ("Bus", "State"), ContributionType.REQUIRED_STATE: SOURCE_FORBIDDEN_TYPES,
                   ContributionType.FACT: SOURCE_FORBIDDEN_TYPES, ContributionType.POLICY: SOURCE_FORBIDDEN_TYPES}
REQUIRED_PARTS = ((CapabilityPart.TOOL_DENIAL, HookEventName.PRE_TOOL_USE), (CapabilityPart.STOP_REFUSAL, HookEventName.STOP))


class DeclarationCheck:
    """Everything sync refuses in the agent machine's declarations (doc 1310 section 5.3), each refusal naming
    the owner, the declaration and the fix; it reads declarations only, and asks the database only through
    OpenOwners."""

    def __init__(self, drivers: Sequence[DriverDeclaration], modules: Sequence[ModuleContributions], programs: Sequence[ProgramDeclaration],
                 agent_types: Sequence[str]) -> None:
        self.drivers, self.modules, self.programs, self.agent_types = drivers, modules, programs, agent_types

    def refusals(self) -> list[DeclarationFinding]:
        return [*self.contribution_refusals(), *self.rank_refusals(), *self.key_refusals(), *self.driver_refusals(), *self.module_refusals(),
                *self.program_refusals()]

    def removal_refusals(self, removed_modules: Sequence[str], migrated_modules: Sequence[str], owners: OpenOwners) -> list[DeclarationFinding]:
        return [DeclarationFinding(module, f"{owners.open_count(module)} open holds or frames", "ship a migration that keeps them judgeable, closes them as cancelled, or marks them cannot be judged")
                for module in removed_modules if module not in migrated_modules and owners.open_count(module) > 0]

    def contribution_refusals(self) -> list[DeclarationFinding]:
        refusals = []
        for module in self.modules:
            for entry in module.contributions:
                refusals += [DeclarationFinding(module.name, entry.key, fix) for fix in self.entry_fixes(module, entry)]
        return refusals

    def entry_fixes(self, module: ModuleContributions, entry: ContributionDeclaration) -> list[str]:
        fixes = [f"agent type {agent_type} has no driver: name one of {', '.join(self.agent_types)}" for agent_type in entry.agent_types if agent_type not in self.agent_types]
        if entry.contribution_type is ContributionType.REQUIRED_STATE and entry.state_name in ENGINE_PLACED_STATES:
            fixes.append(f"a state source may not ask for {entry.state_name}: the engine places it from facts")
        elif entry.contribution_type is ContributionType.REQUIRED_STATE and entry.state_name not in REQUIRED_STATE_NAMES:
            fixes.append(f"state {entry.state_name or 'none'} is unknown: a need asks for one of {', '.join(REQUIRED_STATE_NAMES)}")
        if entry.is_safety and not module.is_core:
            fixes.append("a safety policy may only come from a core module")
        if entry.contribution_type is ContributionType.SUBJECT and entry.key in MACHINE_TABLES:
            fixes.append("the machine's own tables are no subject")
        if self.has_unsupported_line(entry):
            fixes.append(f"no program carries lines on any of {', '.join(entry.events)}: give the line a waiting carrier")
        forbidden = FORBIDDEN_TYPES.get(entry.contribution_type, ())
        fixes += [f"it takes a {name}: read rows through injected queries only" for name in entry.constructor_types if name in forbidden]
        if entry.contribution_type is ContributionType.EFFECT and entry.is_required and not entry.has_failure:
            fixes.append("a required effect declares its failure line and text")
        if entry.contribution_type is ContributionType.BLOCK_CONDITION and not entry.ends:
            fixes.append("a hold condition declares the ends it may take")
        if entry.contribution_type is ContributionType.BLOCK_CONDITION and BlockEnd.SATISFIED in entry.ends and not entry.lifting_lines:
            fixes.append("a hold that can be satisfied names the command lines that satisfy it")
        return fixes

    def has_unsupported_line(self, entry: ContributionDeclaration) -> bool:
        is_line = entry.contribution_type is ContributionType.LINE
        return is_line and entry.channel is not LineChannel.WAITING and not self.supports_events(entry.events)

    def supports_events(self, events: Sequence[HookEventName]) -> bool:
        return any(program.capabilities.supports(CapabilityPart.LINES, event) for program in self.programs for event in events)

    def rank_refusals(self) -> list[DeclarationFinding]:
        declared = {entry.rank for module in self.modules for entry in module.contributions if entry.rank}
        listed = {rank for driver in self.drivers for rank in (*driver.rank_order.policies, *driver.rank_order.blocks)}
        unknown = [DeclarationFinding(module.name, entry.key, f"no driver lists the rank key {entry.rank}: the drivers list {', '.join(sorted(listed)) or 'none'}")
                   for module in self.modules for entry in module.contributions if entry.rank and entry.rank not in listed]
        unused = [DeclarationFinding(driver.name, f"rank key {rank}", "no module declares it: remove it from the rank order")
                  for driver in self.drivers for rank in (*driver.rank_order.policies, *driver.rank_order.blocks) if rank not in declared]
        unranked_findings = [DeclarationFinding(driver.name, f"rank key {entry.rank} of {entry.key}", "add the rank key to the driver's rank order")
                     for driver in self.drivers for module in self.modules for entry in module.contributions
                     if entry.rank and entry.covers(driver.agent_type) and driver.rank_order.place(entry.rank) == len(driver.rank_order.policies) + len(driver.rank_order.blocks)]
        return [*unknown, *unused, *unranked_findings]

    def key_refusals(self) -> list[DeclarationFinding]:
        owners: dict[tuple[str, str], list[str]] = {}
        for module in self.modules:
            for entry in module.contributions:
                owners.setdefault((entry.contribution_type, entry.key), []).append(module.name)
        duplicate_keys = [DeclarationFinding(", ".join(names), key, f"a {contribution_type} key is declared once") for (contribution_type, key), names in owners.items() if len(names) > 1]
        slots: dict[tuple[str, str], list[str]] = {}
        transforms = [(module, entry) for module in self.modules for entry in module.contributions if entry.slot is not None]
        for module, entry in transforms:
            for agent_type in entry.agent_types or tuple(self.agent_types):
                slots.setdefault((agent_type, entry.slot), []).append(f"{module.name} {entry.key}")
        shared_slots = [DeclarationFinding(", ".join(names), f"slot {slot} for {agent_type}", "one transform to a slot for each agent type")
                   for (agent_type, slot), names in slots.items() if len(names) > 1]
        return [*duplicate_keys, *shared_slots]

    def driver_refusals(self) -> list[DeclarationFinding]:
        driver_index = {driver.name: driver for driver in self.drivers}
        refusals = [DeclarationFinding("sync", f"agent type {agent_type}", "declare a driver for it") for agent_type in self.agent_types
                    if agent_type not in {driver.agent_type for driver in self.drivers}]
        refusals += [DeclarationFinding(driver.name, "work_stop", "a driver declares its work-stop contract") for driver in self.drivers if driver.work_stop is None]
        refusals += [DeclarationFinding(driver.name, f"gathers {name}", "a driver gathers a core driver or one of its own suite")
                     for driver in self.drivers for name in driver.gathers if name in driver_index and driver_index[name].suite not in ("core", driver.suite)]
        refusals += [DeclarationFinding(driver.name, "gathers", f"the gathering is a cycle: {' > '.join(cycle)}") for driver in self.drivers
                     if (cycle := self.gathering_cycle(driver, driver_index))]
        return refusals

    @staticmethod
    def gathering_cycle(driver: DriverDeclaration, driver_index: dict[str, DriverDeclaration]) -> list[str]:
        path, current = [driver.name], list(driver.gathers)
        while current:
            name = current.pop()
            if name == driver.name:
                return [*path, name]
            if name in driver_index and name not in path:
                path.append(name)
                current += driver_index[name].gathers
        return []

    def module_refusals(self) -> list[DeclarationFinding]:
        names = {module.name for module in self.modules}
        missing = [DeclarationFinding(module.name, f"dependency {dependency}", "the module it depends on is not installed")
                   for module in self.modules for dependency in module.dependencies if dependency not in names]
        states = [DeclarationFinding(module.name, f"state {state}", "a module never defines a state: declare a need for an engine state")
                  for module in self.modules for state in module.state_classes]
        return [*missing, *states]

    def program_refusals(self) -> list[DeclarationFinding]:
        return [DeclarationFinding(program.name, f"{part} at {event}", "declare the capability, or the fallback the step takes")
                for program in self.programs for part, event in REQUIRED_PARTS if program.capabilities.capability(part, event) is None]
