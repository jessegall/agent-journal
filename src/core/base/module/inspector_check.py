from collections.abc import Sequence

from core.base.module.module import Module
from core.base.module.window_check import WindowCheck
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.registry_lines import RegistryLines
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_place import WindowPlace


class InspectorCheck:
    """Checks the inspectors the modules declare before a sync writes anything: each model has one, the parts it draws
    are section windows of its own module or one it depends on, it reads a read subcommand, it follows only events of the
    model it reads, and its actions sit on the row of its own model."""

    def problems(self, modules: Sequence[type[Module]], events: Sequence[str]) -> tuple[str, ...]:
        reads, runs = WindowCheck.lines(modules)
        provided = RegistryLines(frozenset(reads), frozenset(runs), events)
        windows = {window.name: (module, window) for module in modules for window in module.windows}
        owners: dict[str, str] = {}
        problems: list[str] = []
        for module in modules:
            for declaration in module.inspectors:
                noun = declaration.model.cli_name
                if noun in owners:
                    problems.append(f"the model {noun} has two inspectors, one in {owners[noun]} and one in {module.name}")
                owners.setdefault(noun, module.name)
                problems += self.component_problems(module, declaration, windows)
                problems += self.read_problems(declaration, provided)
                problems += self.action_problems(declaration)
        return tuple(problems)

    @staticmethod
    def component_problems(module: type[Module], declaration: InspectorDeclaration, windows: dict[str, tuple[type[Module], WindowDeclaration]]) -> list[str]:
        problems: list[str] = []
        for component in declaration.components:
            name = f"the inspector of {declaration.noun}"
            if component.window not in windows:
                problems.append(f"{name} draws the window {component.window}, which no module declares")
                continue
            owner, window = windows[component.window]
            if window.place is not WindowPlace.SECTION:
                problems.append(f"{name} draws the window {component.window}, which is not a section")
            if owner.name != module.name and owner.name not in module.dependencies:
                problems.append(f"{name} draws the window {component.window} of {owner.name}, which it depends on only when listed in dependencies")
        return problems

    @staticmethod
    def read_problems(declaration: InspectorDeclaration, provided: RegistryLines) -> list[str]:
        name = f"the inspector of {declaration.noun}"
        line = declaration.read_line()
        problems = [] if line in provided.reads else [f"{name} reads {line}, which is no read subcommand"]
        read_model = declaration.read_noun()
        for pattern in declaration.events:
            if not provided.matches(pattern):
                problems.append(f"{name} follows {pattern}, which no model's events match")
            elif not WindowDeclaration.reads_model(pattern.split(".", 1)[0], {read_model.replace("-", "_")}):
                problems.append(f"{name} follows {pattern} but reads no {pattern.split('.', 1)[0]}")
        return problems

    @staticmethod
    def action_problems(declaration: InspectorDeclaration) -> list[str]:
        own_slot = f"row.{declaration.noun}"
        problems: list[str] = []
        for action in declaration.actions:
            name = f"the inspector of {declaration.noun}, action {action.label},"
            problems += [f"{name} is on {slot}, which is another model's row" for slot in action.slots if slot.startswith("row.") and slot != own_slot]
        return problems
