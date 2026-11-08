from collections.abc import Sequence
import re
import shlex
from string import Formatter

from core.base.declaration_names import DeclarationNames
from core.base.chat.mark_button import MarkButton
from core.base.module.button_command_check import ButtonCommandCheck
from core.base.module.button_slots import ButtonSlots
from core.base.module.module import Module
from core.base.module.name_groups import NameGroups
from core.base.module.template_check import TemplateCheck
from core.base.module.window_check import WindowCheck
from core.base.registry.button_line import BLANK
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.button_field import ButtonField
from core.base.viewer.panel_words import PanelLabels
from core.base.viewer.text_field import TextField

ROW_PLACEHOLDER = "row_id"
CARD_SLOT_PREFIX = "dock."
MODEL_SLOT_PREFIXES = ("row.", CARD_SLOT_PREFIX)


class ButtonCheck:
    """Checks mark, dock and declared buttons before they enter the registry."""

    def problems(self, owner: str, buttons: Sequence[MarkButton], runs: frozenset[str]) -> list[str]:
        problems: list[str] = []
        for button in buttons:
            fields = {field for _, field, _, _ in Formatter().parse(button.runs) if field is not None}
            line = " ".join(button.runs.replace(f"{{{ROW_PLACEHOLDER}}}", "").split()[:2])
            problems += DeclarationNames.icon_problems(f"{owner}'s button {button.label}", button.icon)
            problems += self.label_problems(f"{owner}'s button", button.label)
            problems += [f"{owner} has the button {button.label} filling {{{field}}}, and only {{{ROW_PLACEHOLDER}}} is filled" for field in sorted(fields - {ROW_PLACEHOLDER})]
            if line not in runs:
                problems.append(f"{owner} has the button {button.label} running {button.runs}, which names no command")
        return problems

    def declared_problems(self, modules: Sequence[type[Module]], shipped: frozenset[str]) -> tuple[str, ...]:
        offered_slots = ButtonSlots(modules)
        slots = offered_slots.owners
        targets = TemplateCheck.target_names(modules)
        runs = frozenset(WindowCheck.lines(modules)[1])
        problems = [*offered_slots.problems(), *NameGroups.duplicates([("buttons", [button.name for module in modules for button in module.declared_buttons()])])]
        for module, button in ((module, button) for module in modules for button in module.declared_buttons()):
            owner = f"the button {button.name} of module {module.name}"
            problems += DeclarationNames.prefix_problems(owner, button.name, module.name)
            if button.icon:
                problems += DeclarationNames.icon_problems(owner, button.icon)
            if module.name in shipped:
                problems += self.style_problems(module, button)
            if button.primary and module.name not in shipped:
                problems.append(f"{owner} is primary, which only a shipped module may declare")
            for slot in button.slots:
                if slot not in slots:
                    problems.append(f"{owner} uses unknown slot {slot}")
                    continue
                if slots[slot] != module.name and slots[slot] not in module.dependencies:
                    problems.append(f"{owner} uses slot {slot} of {slots[slot]}, which it depends on only when listed in dependencies")
            for action in (button, *button.menu):
                problems += self.action_problems(f"{owner}, action {action.label}", action.runs, action.fields, runs, targets)
        buttons = ButtonCommandCheck.declared_lines(modules, shipped)
        peers = (*buttons, *WindowCheck.mark_dock_lines(modules, shipped))
        problems += ButtonCommandCheck().problems(buttons, peers, WindowCheck.allowed_button_lines(modules, shipped))
        return tuple(problems)

    def declared_warnings(self, modules: Sequence[type[Module]], shipped: frozenset[str]) -> dict[str, str]:
        warnings = {button.name: "; ".join(self.style_problems(module, button)) for module in modules if module.name not in shipped for button in module.declared_buttons()}
        return {name: text for name, text in warnings.items() if text}

    def style_problems(self, module: type[Module], button: ButtonDeclaration) -> list[str]:
        owner = f"the button {button.name} of module {module.name}"
        inspector_actions = {action.name for inspector in module.inspectors for action in inspector.actions}
        card_button = button.name in inspector_actions or any(slot.startswith(CARD_SLOT_PREFIX) for slot in button.slots)
        problems = [f"{owner} shows no icon, and a button on a card or in an inspector has one"] if card_button and not button.icon else []
        if any(slot.startswith(MODEL_SLOT_PREFIXES) for slot in button.slots):
            problems += self.label_problems(owner, button.label)
        return problems

    @staticmethod
    def label_problems(owner: str, label: str) -> list[str]:
        return [f"{owner} has the label {label}, which starts with a panel word, and the panel owns those words"] if PanelLabels.begins(label) else []

    def action_problems(self, owner: str, text: str, fields: Sequence[ButtonField], runs: frozenset[str], targets: frozenset[str]) -> list[str]:
        try:
            argv = shlex.split(text)
            parsed = tuple(Formatter().parse(text))
        except ValueError:
            return [f"{owner} has invalid blanks or quoting"]
        problems = [] if " ".join(argv[:2]) in runs else [f"{owner} runs {text}, which names no command"]
        blanks = {name for _, name, _, _ in parsed if name is not None}
        names = {field.name for field in fields}
        problems += [f"{owner} fills unknown field {name}" for name in sorted(blanks - names - {ROW_PLACEHOLDER})]
        problems += [f"{owner} has unused field {name}" for name in sorted(names - blanks)]
        problems += list(NameGroups.duplicates([("fields", [field.name for field in fields])]))
        for field in fields:
            problems += field.problems(f"{owner}, field {field.name}", targets)
        text_fields = {field.name for field in fields if isinstance(field, TextField)}
        for word in argv:
            problems += self.word_problems(owner, word, text_fields)
        return problems

    def word_problems(self, owner: str, word: str, text_fields: set[str]) -> list[str]:
        try:
            word_blanks = {name for _, name, _, _ in Formatter().parse(word) if name is not None}
        except ValueError:
            return [f"{owner} has invalid blanks"]
        if not word_blanks:
            return []
        blank = BLANK.fullmatch(word)
        if blank is None:
            return [f"{owner} must put each blank at the end of one word, with one blank per word"]
        if blank["name"] in text_fields and re.fullmatch(r"--[\w-]+=", blank["prefix"]) is None:
            return [f"{owner} must put text field {blank['name']} after --flag="]
        return []
