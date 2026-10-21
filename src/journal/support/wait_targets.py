from journal.events.models.updated import Updated
from journal.models.check import Check
from journal.models.command_output import CommandOutput
from journal.models.question import Question
from journal.models.task import Task
from journal.repositories.checks import Checks
from journal.repositories.command_outputs import CommandOutputs

WAIT_TARGETS = (CommandOutput, Task, Question, Check)
POLL_INTERVAL_MINUTES = 0.5


class WaitTargets:
    """What an agent's wait ends on, by table:id, the rows it may name, and the one place it is asked whether a write settled a row something waits on."""

    def __init__(self, outputs: CommandOutputs, checks: Checks) -> None:
        self.outputs, self.checks = outputs, checks

    def output(self, n: int) -> str:
        return self.ref_of(self.outputs.find(n))

    def until(self, command: str, purpose: str, actor) -> str:
        check = self.checks.save(Check(title=f"the wait for {purpose} ends when this passes", command=command, every=POLL_INTERVAL_MINUTES, waited_on=True), actor)
        return self.ref_of(check)

    @staticmethod
    def ref_of(row: CommandOutput | Check) -> str:
        return f"{row.table()}:{row.id}"

    @staticmethod
    def title_of(name: str) -> str:
        table, _, number = name.partition(":")
        return f"{'output' if table == CommandOutput.table() else 'check'} {number}"

    @staticmethod
    def is_newly_resolved(event: Updated) -> bool:
        model, was = event.model, event.was
        return isinstance(model, WAIT_TARGETS) and model.is_resolved() and (was is None or not was.is_resolved())
