from dataclasses import dataclass


@dataclass(frozen=True)
class PhaseWork:
    """The phase a task is in, as a worker's question shows it: the phase's title, the test of the phase when the
    phase is a checkpoint, and the unfinished tasks of that phase and the later ones, each with what it waits on."""

    title: str
    test_command: str | None
    unfinished_tasks: tuple[str, ...]

    def lines(self) -> list[str]:
        test = self.test_command if self.test_command is not None else "none"
        return [f"phase: {self.title}, its test: {test}", *self.unfinished_tasks]
