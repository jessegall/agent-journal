from collections.abc import Sequence

from core.base.change.event_pattern import EventPattern
from core.base.cli.bookkeeping_subcommands import BOOKKEEPING_SUBCOMMANDS
from core.base.cli.default_subcommands import COMMAND_SUBCOMMANDS, READ_SUBCOMMANDS
from core.base.module.module import Module
from core.base.module.module_finder import ModuleFinder
from core.base.module.name_groups import NameGroups
from core.base.module.subcommand_line import subcommand_line
from core.base.module.version_requirement import VersionRequirement
from core.base.subcommand.subcommand import ReadSubcommand
from core.base.viewer.viewer_kit import VIEWER_KIT
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading



class WindowCheck:
    """Checks the windows the modules declare before a sync writes anything: each name is used once and
    starts with its module's name, a file it loads is in its module's web/dist, it reads only read
    subcommands and runs only commands, it follows only events of models it reads, and only a module the
    journal ships loads one in the page."""

    def __init__(self, finder: ModuleFinder) -> None:
        self.finder = finder

    def problems(self, modules: Sequence[type[Module]], events: Sequence[str]) -> tuple[str, ...]:
        names = [window.name for module in modules for window in module.windows]
        shipped = set(self.finder.default_modules())
        reads, runs = self.lines(modules)
        problems = list(NameGroups.duplicates([("windows", names)]))
        for module in modules:
            for window in module.windows:
                problems += self.window_problems(module, window, module in shipped, (reads, runs), events)
        return tuple(problems)

    def window_problems(self, module: type[Module], window: WindowDeclaration, shipped: bool, lines: tuple[set[str], set[str]],
                        events: Sequence[str]) -> list[str]:
        reads, runs = lines
        short_name = module.name.rsplit(".", 1)[-1]
        problems = [f"the window {window.name} does not start with its module's name, {short_name}"] if not window.name.startswith(f"{short_name}.") else []
        if window.loading is not WindowLoading.DOCUMENT and not (module.web_folder() / window.entry).exists():
            problems.append(f"{window.name} loads {window.entry}, which is not in its module's web/dist")
        problems += [f"{window.name} reads {line}, which is no read subcommand" for line in window.reads if line not in reads]
        problems += [f"{window.name} runs {line}, which is no command" for line in window.runs if line not in runs]
        problems += [f"{window.name} follows {pattern}, which no model's events match" for pattern in window.events if not self.matches(pattern, events)]
        read_models = {line.split(" ", 1)[0].replace("-", "_") for line in window.reads}
        problems += [f"{window.name} follows {pattern} but reads no {pattern.split('.', 1)[0]}" for pattern in window.events
                     if self.matches(pattern, events) and pattern.split(".", 1)[0] not in read_models]
        if window.loading is WindowLoading.PAGE and not shipped:
            problems.append(f"{window.name} loads in the page, which only a module the journal ships may do")
        return problems

    @staticmethod
    def matches(pattern: str, events: Sequence[str]) -> bool:
        return any(EventPattern(pattern).matches(event) for event in events)

    @staticmethod
    def lines(modules: Sequence[type[Module]]) -> tuple[set[str], set[str]]:
        reads, runs = set(BOOKKEEPING_SUBCOMMANDS), set[str]()
        for module in modules:
            for declaration in module.models:
                model, excluded = declaration.model, set(declaration.excluded_subcommands)
                moves = tuple(move.name for move in model.lifecycle.moves()) if model.lifecycle else ()
                reads |= {f"{model.cli_name} {name}" for name in READ_SUBCOMMANDS if name not in excluded}
                runs |= {f"{model.cli_name} {name}" for name in (*COMMAND_SUBCOMMANDS, *moves) if name not in excluded}
            for subcommand in module.subcommands:
                (reads if issubclass(subcommand, ReadSubcommand) else runs).add(subcommand_line(subcommand))
        return reads, runs


def unavailable_reason(window: WindowDeclaration) -> str:
    if VersionRequirement(window.kit).allows(VIEWER_KIT):
        return ""
    return f"built for window kit {window.kit}; this viewer has kit {VIEWER_KIT[0]}"
