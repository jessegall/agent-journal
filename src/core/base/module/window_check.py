from collections.abc import Sequence

from core.base.bookkeeping.bookkeeping_subcommands import BOOKKEEPING_SUBCOMMANDS
from core.base.subcommand.default_lines import COMMAND_SUBCOMMANDS, READ_SUBCOMMANDS
from core.base.module.module import Module
from core.base.module.name_groups import NameGroups
from core.base.module.subcommand_line import subcommand_line
from core.base.module.version_requirement import VersionRequirement
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.viewer.viewer_kit import VIEWER_KIT
from core.base.viewer.registry_lines import RegistryLines



class WindowCheck:
    """Checks the windows the modules declare before a sync writes anything: each name is used once and
    starts with its module's name, a file it loads is in its module's web/dist, it reads only read
    subcommands and runs only commands, and it follows only events of models it reads."""

    def problems(self, modules: Sequence[type[Module]], events: Sequence[str]) -> tuple[str, ...]:
        names = [window.name for module in modules for window in module.windows]
        reads, runs = self.lines(modules)
        provided = RegistryLines(frozenset(reads), frozenset(runs), events)
        problems = list(NameGroups.duplicates([("windows", names)]))
        for module in modules:
            for window in module.windows:
                problems += window.problems(module.name, module.web_folder(), provided)
        return tuple(problems)

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


def unavailable_reason(kit: str) -> str:
    if VersionRequirement(kit).allows(VIEWER_KIT):
        return ""
    return f"built for window kit {kit}; this viewer has kit {VIEWER_KIT[0]}"
