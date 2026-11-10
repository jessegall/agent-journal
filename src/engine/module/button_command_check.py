from collections.abc import Sequence

from engine.module.module import Module
from engine.registry.button_line import ButtonLine
from engine.viewer.person_lines import PERSON_LINES


class ButtonCommandCheck:
    """Refuses third-party button commands that bypass consent or share another module's permission."""

    def problems(self, buttons: Sequence[ButtonLine], peers: Sequence[ButtonLine], windows: frozenset[str]) -> list[str]:
        problems: list[str] = []
        for button in buttons:
            if button.shipped:
                continue
            sharing = sorted({peer.module for peer in peers if peer.line == button.line and peer.module != button.module})
            if button.line in PERSON_LINES:
                problems.append(f"{button.module} has a button that runs {button.line}, which only a person runs")
            if button.line in windows:
                problems.append(f"{button.module} has a button that runs {button.line}, which the journal's own windows run with no permission")
            problems += [f"{button.module} has a button that runs {button.line}, which {peer} also runs" for peer in sharing]
        return problems

    @staticmethod
    def declared_lines(modules: Sequence[type[Module]], shipped: set[str] | frozenset[str]) -> tuple[ButtonLine, ...]:
        return tuple(ButtonLine(module.name, action.runs, module.name in shipped) for module in modules
                     for button in module.declared_buttons() for action in (button, *button.menu))
