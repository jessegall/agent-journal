import json
import re
import shlex
from collections.abc import Mapping
from dataclasses import dataclass, field

from core.base.viewer.button_field import ButtonField
from core.base.viewer.choice_field import ChoiceField

ROW_BLANK = "row_id"
BUTTON_SUBJECT = "button:{module}"
BLANK = re.compile(r"(?P<prefix>[^{]*)\{(?P<name>\w+)\}")


@dataclass(frozen=True)
class ButtonLine:
    """The command line a module's button may run, with the module that declared it and whether the journal
    ships that module: {row_id} stands for a row's number."""

    module: str
    template: str
    shipped: bool
    fields: Mapping[str, ButtonField] = field(default_factory=dict[str, ButtonField])
    label: str = ""

    @property
    def line(self) -> str:
        return " ".join(self.template.split()[:2])

    @property
    def permission_line(self) -> str:
        choices = {name: sorted(choice.key for choice in item.choices) for name, item in self.fields.items() if isinstance(item, ChoiceField)}
        return f"{self.template} choices={json.dumps(choices, sort_keys=True)}" if choices else self.template

    @property
    def subject(self) -> str:
        return BUTTON_SUBJECT.format(module=self.module)

    def allows(self, argv: list[str]) -> bool:
        parts = shlex.split(self.template)
        return len(parts) == len(argv) and all(self.fits(part, word) for part, word in zip(parts, argv))

    def fits(self, part: str, word: str) -> bool:
        blank = BLANK.fullmatch(part)
        if blank is None:
            return part == word
        prefix, name = blank["prefix"], blank["name"]
        if not word.startswith(prefix):
            return False
        value = word[len(prefix):]
        if name == ROW_BLANK:
            return value.isdigit()
        return self.fields[name].accepts(value)
