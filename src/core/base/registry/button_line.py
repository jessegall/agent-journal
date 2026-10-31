from dataclasses import dataclass

ROW_ID = "{row_id}"


@dataclass(frozen=True)
class ButtonLine:
    """The command line a module's button may run, with the module that declared it: {row_id} stands for a row's
    number."""

    module: str
    template: str

    def allows(self, argv: list[str]) -> bool:
        words = self.template.split()
        return len(words) == len(argv) and all(argv[place] == word or (word == ROW_ID and argv[place].isdigit()) for place, word in enumerate(words))
