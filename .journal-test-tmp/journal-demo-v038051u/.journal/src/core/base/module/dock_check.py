from collections.abc import Sequence

from core.base.declaration_names import DeclarationNames
from core.base.module.button_check import ButtonCheck
from core.base.module.module import Module
from core.base.module.name_groups import NameGroups
from core.base.module.window_check import WindowCheck


class DockCheck:
    """Checks the docked items the modules declare before a sync writes anything: each type starts with
    its module's name and is used once, it holds at least one item, its icon is in the shell's icon set,
    its body is in the module's web/dist, its buttons run commands and its reads are read subcommands."""

    def __init__(self, buttons: ButtonCheck) -> None:
        self.buttons = buttons

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        reads, runs = WindowCheck.lines(modules)
        problems = list(NameGroups.duplicates([("dock types", [dock.type.value for module in modules for dock in module.docks])]))
        for module in modules:
            for dock in module.docks:
                name = f"the dock {dock.type.value}"
                problems += DeclarationNames.prefix_problems(name, dock.type.value, module.name)
                if dock.most < 1:
                    problems.append(f"{name} allows at most {dock.most} items, and it holds at least 1")
                problems += DeclarationNames.icon_problems(name, dock.icon)
                if not (module.web_folder() / dock.body).exists():
                    problems.append(f"{name} loads {dock.body}, which is not in its module's web/dist")
                problems += [f"{name} reads {line}, which is no read subcommand" for line in dock.reads if line not in reads]
                problems += self.buttons.problems(name, dock.buttons, frozenset(runs))
        return tuple(problems)
