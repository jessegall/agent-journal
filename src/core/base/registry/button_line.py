from dataclasses import dataclass

ROW_ID = "{row_id}"
BUTTON_SUBJECT = "button:{module}"
COMMAND_NAME_PARTS = 2


@dataclass(frozen=True)
class ButtonLine:
    """The command line a module's button may run, with the module that declared it and whether the journal
    ships that module: {row_id} stands for a row's number."""

    module: str
    template: str
    shipped: bool

    @property
    def line(self) -> str:
        return " ".join(self.template.split()[:COMMAND_NAME_PARTS])

    @property
    def subject(self) -> str:
        return BUTTON_SUBJECT.format(module=self.module)

    def allows(self, argv: list[str]) -> bool:
        parts = self.template.split()
        return len(parts) == len(argv) and all(argv[place] == part or (part == ROW_ID and argv[place].isdigit()) for place, part in enumerate(parts))
