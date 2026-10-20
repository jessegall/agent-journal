from journal.events.models.updated import Updated
from journal.models.check import Check
from journal.models.command_output import CommandOutput
from journal.models.question import Question
from journal.models.task import Task
from journal.repositories.checks import Checks
from journal.repositories.command_outputs import CommandOutputs
from journal.support.ref import Ref

AWAITABLE = (CommandOutput, Task, Question, Check)
"""The models a wait or a block may wait on, whose write may end it."""
UNTIL_EVERY = 0.5
"""Minutes between two runs of a wait's polling script."""


class Awaitables:
    """What an agent's wait ends on, by name, output:N or check:N, and the one place it is asked whether a write settled a row something waits on."""

    def __init__(self, outputs: CommandOutputs, checks: Checks) -> None:
        self.rows = {"output": outputs, "check": checks}

    def output(self, n: int) -> str:
        """The wait's name for a command's output, once the output is found."""
        return f"output:{self.rows['output'].find(n).id}"

    def until(self, command: str, what: str, by) -> str:
        """A check made for the wait, run every half minute until it passes; its name for the wait."""
        check = self.rows["check"].save(Check(title=f"the wait for {what} ends when this passes", command=command, every=UNTIL_EVERY, waited_on=True), by)
        return f"check:{check.id}"

    @staticmethod
    def just_settled(event: Updated) -> bool:
        """Whether the write settled a row something waits on: an output ended, a task closed, a question answered, a check passed."""
        model, was = event.model, event.was
        return isinstance(model, AWAITABLE) and model.is_settled() and (was is None or not was.is_settled())

    def all_settled(self, names: list[str]) -> bool:
        return all(self.row(name).is_settled() for name in names)

    def came_to(self, names: list[str]) -> str:
        return "; ".join(self.row(name).came_to() for name in names)

    def name_of(self, ref: Ref) -> str:
        """A row's name in a wait, from its table; empty for a row no wait names."""
        kind = next((kind for kind, rows in self.rows.items() if rows.model.table() == ref.type), "")
        return f"{kind}:{ref.id}" if kind else ""

    def row(self, name: str) -> CommandOutput | Check:
        kind, _, number = name.partition(":")
        return self.rows[kind].find(int(number))
