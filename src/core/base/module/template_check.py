from collections import defaultdict
from collections.abc import Sequence

from core.base.module.module import Module
from core.base.module.subcommand_line import subcommand_line


class TemplateCheck:
    """Checks that template titles are unique and their targets are registered models or commands."""

    def problems(self, modules: Sequence[type[Module]]) -> tuple[str, ...]:
        targets = self.known_targets(modules)
        owners: defaultdict[str, list[str]] = defaultdict(list[str])
        problems: list[str] = []
        for module in modules:
            for template in module.templates:
                owners[template.title].append(module.name)
                problems.extend(f"the module {module.name}'s template {template.title} targets {target}, "
                                "which is neither a model nor the first word of a command"
                                for target in template.targets if target not in targets)
        problems.extend(f"the modules {' and '.join(names)} both register the template {title}"
                        for title, names in owners.items() if len(names) > 1)
        return tuple(problems)

    @staticmethod
    def known_targets(modules: Sequence[type[Module]]) -> frozenset[str]:
        return frozenset([*(declaration.model.cli_name for module in modules for declaration in module.models),
                          *(subcommand_line(command).split()[0] for module in modules for command in module.subcommands)])
