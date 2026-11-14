import re
from collections import Counter
from collections.abc import Iterator, Mapping, Sequence, Set

from engine.enums.access import Access
from engine.agent.agent_roster import AgentRoster
from engine.agent.groups.agent_group_book import AgentGroupBook
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.helper_type import HelperType
from engine.helper_type.journal_line import JournalLine
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.module.journal_lines import JournalLines
from engine.profile.agent_profile import AgentProfile
from engine.agent.groups.agent_group_entry import AgentGroupEntry
from engine.helper_type.helper_type_book import MAIN_KEY, HelperTypeBook
from engine.module.module import Module
from engine.module.suite_list import SuiteList
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.registry.driver_rule_entry import DriverRuleEntry

HELPER_TYPE_WORD = re.compile(r"[a-z]+(-[a-z]+)*")
AGENTS_MODULE = "journal.core.agents"
REQUIRED_FIELDS = ("key", "label", "behaviours", "commands")


class HelperTypeCheck:
    """Checks helper type declarations and every role modules use before a sync writes anything."""

    def problems(self, modules: Sequence[type[Module]], rules: Sequence[DriverRuleEntry], suites: SuiteList) -> tuple[str, ...]:
        claimed: dict[str, str] = {}
        problems: list[str] = []
        for module in modules:
            for declaration in suites.helper_types(module):
                problems.extend(self.declaration_problems(module, declaration, claimed, self.owner(module, suites)))
        if problems:
            return tuple(problems)
        entries = tuple(HelperTypeEntry.declared(module.name, declaration) for module in modules for declaration in suites.helper_types(module))
        book = HelperTypeBook(entries)
        problems.extend(problem for module in modules for declaration in suites.helper_types(module)
                        for problem in self.inheritance_problems(module.name, declaration, book))
        lines = JournalLines().classes(modules)
        problems.extend(problem for module in modules for declaration in suites.helper_types(module)
                        for problem in self.list_problems(f"{module.name}'s helper type {declaration.key}", declaration.commands, lines))
        problems.extend(problem for module in modules for declaration in suites.helper_types(module)
                        for problem in self.run_problems(f"{module.name}'s helper type {declaration.key}", declaration.commands, declaration.journal_runs, lines))
        profiles = {profile.name: profile for module in modules for profile in module.profiles}
        for declaration in (declaration for module in modules for declaration in suites.helper_types(module) if declaration.default_profile):
            if declaration.default_profile not in profiles:
                problems.append(f"{declaration.key}: default profile {declaration.default_profile} is not registered")
                continue
            profile = profiles[declaration.default_profile]
            if not book.extends(declaration.key, profile.agent_type):
                problems.append(f"{declaration.key}: default profile {profile.name} has type {profile.agent_type}, which {declaration.key} does not extend")
        names = frozenset(book.entries)
        uses = [(driver.name, driver.role) for module in modules for driver in module.drivers]
        uses.extend((rule.name, role) for rule in rules for role in rule.roles)
        problems.extend(f"{owner}: {role} is no registered helper type; register it in a module's or suite's helper_types"
                        for owner, role in dict.fromkeys(uses) if role not in names)
        problems.extend(self.group_problems(modules, names, profiles))
        problems.extend(f"profile {profile.name} lists {name}, which its type {profile.agent_type} does not list" for profile in profiles.values()
                        if profile.commands is not None and profile.agent_type in book.entries for name in book.entries[profile.agent_type].commands.widened_names(profile.commands))
        return tuple(problems)

    @staticmethod
    def group_problems(modules: Sequence[type[Module]], names: frozenset[str], profiles: Mapping[str, AgentProfile]) -> Iterator[str]:
        groups = tuple(AgentGroupEntry.declared(module.name, group) for module in modules for group in module.group_declarations())
        yield from AgentGroupBook(groups).problems(names)
        for group in groups:
            for name in group.profiles:
                if name not in profiles:
                    yield f"the agent group {group.key} names the profile {name}, which is not registered"
                elif profiles[name].agent_type != group.agent_type:
                    yield f"the agent group {group.key} names the profile {name}, which has type {profiles[name].agent_type}, not {group.agent_type}"

    @staticmethod
    def owner(module: type[Module], suites: SuiteList) -> str:
        names = suites.suite_names(module)
        return f"suite {names[-1]}" if names else f"module {module.name}"

    def declaration_problems(self, module: type[Module], declaration: type[HelperType], claimed: dict[str, str], owner: str) -> list[str]:
        missing = [field for field in REQUIRED_FIELDS if not declaration.declares(field)]
        if "key" in missing:
            return [f"{module.name}'s helper type {declaration.__name__} has no key"]
        name = f"{module.name}'s helper type {declaration.key}"
        problems = [f"{name} has no {field}" for field in missing]
        if declaration.key == MAIN_KEY:
            problems.append(f"{name}: the main agent is no helper; a module or suite registers helper types only")
        if declaration.key in claimed:
            problems.append(f"{' and '.join(sorted([claimed[declaration.key], owner]))} both register helper type {declaration.key}")
        claimed[declaration.key] = owner
        if module.name != AGENTS_MODULE and AGENTS_MODULE not in module.dependencies:
            problems.append(f"{name}: the module does not depend on {AGENTS_MODULE}")
        if HELPER_TYPE_WORD.fullmatch(declaration.key) is None:
            problems.append(f"{name}: a key is lowercase letters and dashes")
        if "label" not in missing and not declaration.label.strip():
            problems.append(f"{name} has no label")
        roster = declaration.roster
        if roster is not None and not issubclass(roster, AgentRoster):
            problems.append(f"{name}: its roster does not implement AgentRoster")
        return problems

    @staticmethod
    def list_problems(name: str, commands: CommandAllowList, lines: Mapping[str, Set[JournalLineClass]]) -> Iterator[str]:
        groups = {line.partition(" ")[0] for line in lines}
        yield from (f"{name} lists the group {group}, which no module serves" for group in commands.groups if group not in groups)
        yield from (f"{name} lists the line {line}, which no module serves" for line in commands.lines if line not in lines)
        yield from (f"{name} names {entry} twice" for entry, count in Counter(commands.entries()).items() if count > 1)
        yield from (f"{name} lists the line {line} and its whole group" for line in commands.lines if line.partition(" ")[0] in commands.groups)
        yield from (f"{name} lists the class {line_class}, which no line has" for line_class in commands.classes
                    if not any(line_class in classes for classes in lines.values()))

    # a line the journal runs under an agent of the type is judged by the type's own list like any line the agent types
    @staticmethod
    def run_problems(name: str, commands: CommandAllowList, journal_runs: Sequence[str], lines: Mapping[str, Set[JournalLineClass]]) -> Iterator[str]:
        yield from (f"{name} names the line {line} the journal runs under it, which no module serves" for line in journal_runs if line not in lines)
        yield from (f"{name} does not list the line {line}, which the journal runs under it" for line in journal_runs
                    if line in lines and not commands.allows(JournalLine(line, lines[line])))

    def inheritance_problems(self, module: str, declaration: type[HelperType], book: HelperTypeBook) -> list[str]:
        name = f"{module}'s helper type {declaration.key}"
        unregistered = [base for base in declaration.bases() if base not in book.entries]
        if unregistered:
            return [f"{name}: extends {unregistered[0]}, which no module registers"]
        if book.is_helper(declaration.key) and declaration.access is Access.WRITING and not declaration.separate_folder:
            return [f"{name}: a writing helper needs its own folder"]
        return []
