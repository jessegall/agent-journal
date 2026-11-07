from collections.abc import Sequence

from core.base.bookkeeping.bookkeeping_subcommands import BOOKKEEPING_SUBCOMMANDS
from core.base.subcommand.default_lines import COMMAND_SUBCOMMANDS, READ_SUBCOMMANDS
from core.base.module.inspector_slots import InspectorSlots
from core.base.module.module import Module
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_states import modules_book
from core.base.module.name_groups import NameGroups
from core.base.module.subcommand_line import subcommand_line
from core.base.module.version_requirement import VersionRequirement
from core.base.registry.button_line import ButtonLine
from core.base.registry.button_window import ButtonWindow
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.viewer.person_lines import PERSON_LINES
from core.base.viewer.viewer_kit import VIEWER_KIT
from core.base.viewer.registry_lines import RegistryLines
from core.base.viewer.window_place import WindowPlace
from core.base.module.window_extensions import WindowExtensions
from core.base.module.button_command_check import ButtonCommandCheck



class WindowCheck:
    """Checks the windows the modules declare before a sync writes anything: each name is used once and
    starts with its module's name, a file it loads is in its module's web/dist, it reads only read
    subcommands and runs only commands, and it follows only events of models it reads. A module the journal
    does not ship adds no commands to a window the journal ships, which asks for no permission, and its
    buttons run a line of their own: none a person alone runs, none a shipped window or button already
    allows, none another module's button runs, since a press does not say which button it came from."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.finder = finder

    def problems(self, modules: Sequence[type[Module]], events: Sequence[str]) -> tuple[str, ...]:
        names = [window.name for module in modules for window in module.windows]
        reads, runs = self.lines(modules)
        provided = RegistryLines(frozenset(reads), frozenset(runs), events)
        problems = list(NameGroups.duplicates([("windows", names)]))
        extensions = WindowExtensions(modules)
        owners = {window.name: module.name for module in modules for window in module.windows}
        shipped = {module.name for module in self.finder.default_modules()}
        inspector_slots = InspectorSlots(modules)
        for module in modules:
            for extension in module.window_extensions:
                if extension.window not in owners:
                    problems.append(f"module {module.name} extends unknown window {extension.window}")
                    continue
                owner = owners[extension.window]
                if owner != module.name and owner not in module.dependencies:
                    problems.append(f"module {module.name} extends window {extension.window} without depending on {owner}")
                if owner in shipped and module.name not in shipped:
                    problems += [f"{module.name} adds {line} to {extension.window}, which the journal ships" for line in extension.runs]
            for window in map(extensions.extend, module.windows):
                problems += window.problems(module.name, module.web_folder(), provided)
                problems += inspector_slots.problems(module, window.name, window.slots)
        return (*problems, *self.suite_section_problems(modules), *self.button_problems(modules, shipped))

    @staticmethod
    def suite_section_problems(modules: Sequence[type[Module]]) -> list[str]:
        sections = {window.name for module in modules for window in module.windows if window.place is WindowPlace.SECTION}
        return [f"suite {suite.name} names the section {name}, which an inspector draws and no pane offers"
                for module in modules for suite in module.suites for name in suite.windows if name in sections]

    def button_problems(self, modules: Sequence[type[Module]], shipped: set[str]) -> list[str]:
        buttons = self.mark_dock_lines(modules, shipped)
        peers = (*buttons, *ButtonCommandCheck.declared_lines(modules, shipped))
        return ButtonCommandCheck().problems(buttons, peers, self.allowed_button_lines(modules, shipped))

    @staticmethod
    def allowed_button_lines(modules: Sequence[type[Module]], shipped: set[str] | frozenset[str]) -> frozenset[str]:
        extensions = WindowExtensions(modules)
        return frozenset(line for module in modules if module.name in shipped for window in map(extensions.extend, module.windows) if window.name in ButtonWindow
                         for line in (*window.reads, *window.runs))

    @staticmethod
    def mark_dock_lines(modules: Sequence[type[Module]], shipped: set[str] | frozenset[str]) -> tuple[ButtonLine, ...]:
        return tuple(ButtonLine(module.name, button.runs, module.name in shipped) for module in modules
                     for button in (*(button for mark in module.marks for button in (*mark.buttons, *mark.group_buttons)),
                                    *(button for dock in module.docks for button in dock.buttons)))

    @staticmethod
    def lines(modules: Sequence[type[Module]]) -> tuple[set[str], set[str]]:
        reads, runs = set(BOOKKEEPING_SUBCOMMANDS), set[str]()
        book = modules_book(modules)
        for module in modules:
            for declaration in module.models:
                model, excluded = declaration.model, set(declaration.excluded_subcommands)
                lifecycle = book.lifecycle(model)
                moves = tuple(move.name for move in lifecycle.moves()) if lifecycle else ()
                reads |= {f"{model.cli_name} {name}" for name in READ_SUBCOMMANDS if name not in excluded}
                runs |= {f"{model.cli_name} {name}" for name in (*COMMAND_SUBCOMMANDS, *moves) if name not in excluded}
            for subcommand in module.subcommands:
                (reads if issubclass(subcommand, ReadSubcommand) else runs).add(subcommand_line(subcommand))
        return reads, runs


def unavailable_reason(kit: str) -> str:
    if VersionRequirement(kit).allows(VIEWER_KIT):
        return ""
    return f"built for window kit {kit}; this viewer has kit {VIEWER_KIT[0]}"
