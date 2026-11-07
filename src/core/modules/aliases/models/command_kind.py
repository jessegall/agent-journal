import shlex
from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.model.model import Model
from core.base.refusal import Refusal

UNCHOOSABLE = (CommandCategory.UNKNOWN, CommandCategory.JOURNAL)


@dataclass(frozen=True, kw_only=True)
class CommandKind(Model):
    """The kind an agent gave a command the journal could not classify, by the command's leading words, such as
    scripts/dev go test as a test run; every later command starting with those words is of that kind."""

    model_name = "command_kind"
    cli_name = "command-kind"

    creator_id: int
    words: str
    category: CommandCategory

    def __post_init__(self) -> None:
        if not shlex.split(self.words):
            raise Refusal("a command kind names the command's leading words", "name its program and first arguments")
        if self.category in UNCHOOSABLE:
            raise Refusal(f"a command is not classified as {self.category.value}", "choose the kind it is, such as test run, build or check")
