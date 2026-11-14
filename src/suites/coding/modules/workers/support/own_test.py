import shlex
from dataclasses import dataclass


@dataclass(frozen=True)
class OwnTest:
    """The test a checkpoint runs beside the proofs of its window: the test command of its phase, with the
    paths an earlier checkpoint deferred added to it. A phase with no test command has no own test. At the
    end of a plan with no flagged phase the phase is the last one of the plan."""

    test_command: str
    deferred_paths: tuple[str, ...] = ()

    @property
    def command(self) -> str:
        if not self.test_command:
            return ""
        return " ".join([self.test_command, *(shlex.quote(path) for path in self.deferred_paths)])
