import re
from collections.abc import Iterator, Mapping, Sequence
from dataclasses import fields

from engine.enums.access import Access
from engine.agent.agent_roster import AgentRoster
from engine.agent.agent_group_book import AgentGroupBook
from engine.helper_type.helper_type import HelperType
from core.base.profile.agent_profile import AgentProfile
from core.base.registry.agent_group_entry import AgentGroupEntry
from engine.helper_type.helper_type_book import MAIN_KEY, HelperTypeBook
from core.base.module.module import Module
from core.base.registry.helper_type_entry import HelperTypeEntry
from core.base.registry.driver_rule_entry import DriverRuleEntry

HELPER_TYPE_WORD = re.compile(r"[a-z]+(-[a-z]+)*")
AGENTS_MODULE = "journal.core.agents"


class HelperTypeCheck:
    """Checks helper type declarations and every role modules use before a sync writes anything."""

    def problems(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> tuple[str, ...]:
        claimed: dict[str, str] = {}
        problems: list[str] = []
        for module in modules:
            for declaration in module.declared_helper_types():
                problems.extend(self.declaration_problems(module, declaration, claimed))
        if problems:
            return tuple(problems)
        entries = tuple(HelperTypeEntry.declared(module.name, declaration) for module in modules for declaration in module.declared_helper_types())
        book = HelperTypeBook(entries)
        problems.extend(problem for module in modules for declaration in module.declared_helper_types()
                        for problem in self.inheritance_problems(module.name, declaration, book))
        profiles = {profile.name: profile for module in modules for profile in module.profiles}
        for declaration in (declaration for module in modules for declaration in module.declared_helper_types() if declaration.default_profile):
            if declaration.default_profile not in profiles:
                problems.append(f"{declaration.key}: default profile {declaration.default_profile} is not registered")
                continue
            profile = profiles[declaration.default_profile]
            if profile.agent_type != declaration.key:
                problems.append(f"{declaration.key}: default profile {profile.name} has type {profile.agent_type}, not {declaration.key}")
        names = frozenset(book.entries)
        uses = [(driver.name, driver.role) for module in modules for driver in module.drivers]
        uses.extend((suite.name, role) for module in modules for suite in module.suites for role in suite.defaults)
        uses.extend((suite.name, role) for module in modules for suite in module.suites
                    for field in fields(suite.agent_policy) if field.name.endswith("_roles")
                    for role in getattr(suite.agent_policy, field.name))
        uses.extend((rule.name, role) for rule in rules for role in rule.roles)
        problems.extend(f"{owner}: {role} is no registered helper type; register it in a module's or suite's helper_types"
                        for owner, role in dict.fromkeys(uses) if role not in names)
        problems.extend(self.group_problems(modules, names, profiles))
        return tuple(problems)

    @staticmethod
    def group_problems(modules: Sequence[type[Module]], names: frozenset[str], profiles: Mapping[str, AgentProfile]) -> Iterator[str]:
        groups = tuple(AgentGroupEntry.declared(module.name, group) for module in modules for group in module.agent_groups)
        yield from AgentGroupBook(groups).problems(names)
        for group in groups:
            for name in group.profiles:
                if name not in profiles:
                    yield f"the agent group {group.key} names the profile {name}, which is not registered"
                elif profiles[name].agent_type != group.agent_type:
                    yield f"the agent group {group.key} names the profile {name}, which has type {profiles[name].agent_type}, not {group.agent_type}"

    def declaration_problems(self, module: type[Module], declaration: HelperType, claimed: dict[str, str]) -> list[str]:
        name = f"{module.name}'s helper type {declaration.key}"
        problems: list[str] = []
        if declaration.key == MAIN_KEY:
            problems.append(f"{name}: the main agent is no helper; a module or suite registers helper types only")
        if declaration.key in claimed:
            problems.append(f"{name}: {claimed[declaration.key]} registers that helper type too")
        claimed[declaration.key] = module.name
        if module.name != AGENTS_MODULE and AGENTS_MODULE not in module.dependencies:
            problems.append(f"{name}: the module does not depend on {AGENTS_MODULE}")
        if HELPER_TYPE_WORD.fullmatch(declaration.key) is None:
            problems.append(f"{name}: a key is lowercase letters and dashes")
        if not declaration.label.strip():
            problems.append(f"{name}: it has no label")
        roster = declaration.roster
        if roster is not None and not issubclass(roster, AgentRoster):
            problems.append(f"{name}: its roster does not implement AgentRoster")
        return problems

    def inheritance_problems(self, module: str, declaration: HelperType, book: HelperTypeBook) -> list[str]:
        name = f"{module}'s helper type {declaration.key}"
        if declaration.extends and declaration.extends not in book.entries:
            return [f"{name}: extends {declaration.extends}, which no module registers"]
        chain = book.type_chain(declaration.key)
        if len(set(chain)) != len(chain):
            return [f"{name}: extends loop through {chain[-1]}"]
        if book.is_helper(declaration.key) and declaration.access is Access.WRITING and not declaration.separate_folder:
            return [f"{name}: a writing helper needs its own folder"]
        return []
