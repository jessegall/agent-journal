from collections.abc import Sequence
from string import Formatter

from core.base.chat.mark_button import MarkButton
from core.base.viewer.window_icon import WindowIcon

ROW_PLACEHOLDER = "row_id"


class ButtonCheck:
    """Checks the buttons a mark or a docked item declares: each shows an icon of the shell's icon set,
    runs a command, and fills nothing but {row_id}."""

    def problems(self, owner: str, buttons: Sequence[MarkButton], runs: frozenset[str]) -> list[str]:
        problems: list[str] = []
        for button in buttons:
            fields = {field for _, field, _, _ in Formatter().parse(button.runs) if field is not None}
            line = " ".join(button.runs.replace(f"{{{ROW_PLACEHOLDER}}}", "").split()[:2])
            if button.icon not in tuple(WindowIcon):
                problems.append(f"{owner} has the button {button.label} with the icon {button.icon}, which is not in the shell's icon set")
            problems += [f"{owner} has the button {button.label} filling {{{field}}}, and only {{{ROW_PLACEHOLDER}}} is filled" for field in sorted(fields - {ROW_PLACEHOLDER})]
            if line not in runs:
                problems.append(f"{owner} has the button {button.label} running {button.runs}, which names no command")
        return problems
