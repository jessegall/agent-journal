import re
from collections.abc import Iterator, Mapping, Sequence
from dataclasses import fields

from core.base.access import Access
from core.base.agent_roster import AgentRoster
from core.base.agent_group_book import AgentGroupBook
from core.base.agent_type import AgentType
from core.base.profile.agent_profile import AgentProfile
from core.base.registry.agent_group_entry import AgentGroupEntry
from core.base.agent_type_book import AgentTypeBook
from core.base.module.module import Module
from core.base.registry.agent_type_entry import AgentTypeEntry
from core.base.registry.driver_rule_entry import DriverRuleEntry

AGENT_TYPE_WORD = re.compile(r"[a-z]+(-[a-z]+)*")
AGENTS_MODULE = "journal.core.agents"


class AgentTypeCheck:
    """Checks agent declarations and every role modules use before a sync writes anything."""

    def problems(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry]) -> tuple[str, ...]:
        claimed: dict[str, str] = {}
        problems: list[str] = []
        for module in modules:
            for declaration in module.agent_types:
                problems.extend(self.declaration_problems(module, declaration, claimed))
        if problems:
            return tuple(problems)
        entries = tuple(AgentTypeEntry.declared(module.name, declaration) for module in modules for declaration in module.agent_types)
        book = AgentTypeBook(entries)
        problems.extend(problem for module in modules for declaration in module.agent_types
                        for problem in self.inheritance_problems(module.name, declaration, book))
        profiles = {profile.name: profile for module in modules for profile in module.profiles}
        for declaration in (declaration for module in modules for declaration in module.agent_types if declaration.default_profile):
            if declaration.default_profile not in profiles:
                problems.append(f"{declaration.key}: default profile {declaration.default_profile} is not registered")
                continue
            profile = profiles[declaration.default_profile]
            if profile.agent_type != declaration.key:
                problems.append(f"{declaration.key}: default profile {profile.name} has type {profile.agent_type}, not {declaration.key}")
        names = frozenset(entry.key for entry in entries)
        uses = [(driver.name, driver.role) for module in modules for driver in module.drivers]
        uses.extend((suite.name, role) for module in modules for suite in module.suites for role in suite.defaults)
        uses.extend((suite.name, role) for module in modules for suite in module.suites
                    for field in fields(suite.agent_policy) if field.name.endswith("_roles")
                    for role in getattr(suite.agent_policy, field.name))
        uses.extend((rule.name, role) for rule in rules for role in rule.roles)
        problems.extend(f"{owner}: {role} is no registered agent type; register it in a module's agent_types"
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

    def declaration_problems(self, module: type[Module], declaration: AgentType, claimed: dict[str, str]) -> list[str]:
        name = f"{module.name}'s agent type {declaration.key}"
        problems: list[str] = []
        if declaration.key in claimed:
            problems.append(f"{name}: {claimed[declaration.key]} registers that agent type too")
        claimed[declaration.key] = module.name
        if module.name != AGENTS_MODULE and AGENTS_MODULE not in module.dependencies:
            problems.append(f"{name}: the module does not depend on {AGENTS_MODULE}")
        if AGENT_TYPE_WORD.fullmatch(declaration.key) is None:
            problems.append(f"{name}: a key is lowercase letters and dashes")
        if not declaration.label.strip():
            problems.append(f"{name}: it has no label")
        roster = declaration.roster
        if roster is not None and (not isinstance(roster, type) or not issubclass(roster, AgentRoster)):
            problems.append(f"{name}: its roster does not implement AgentRoster")
        return problems

    def inheritance_problems(self, module: str, declaration: AgentType, book: AgentTypeBook) -> list[str]:
        name = f"{module}'s agent type {declaration.key}"
        if declaration.extends and declaration.extends not in book.entries:
            return [f"{name}: extends {declaration.extends}, which no module registers"]
        chain = book.type_chain(declaration.key)
        if len(set(chain)) != len(chain):
            return [f"{name}: extends loop through {chain[-1]}"]
        if book.extends(declaration.key, "helper") and declaration.access is Access.WRITING and not declaration.separate_folder:
            return [f"{name}: a writing helper needs its own folder"]
        return []
