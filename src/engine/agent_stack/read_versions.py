from dataclasses import dataclass


@dataclass(frozen=True)
class ReadVersions:
    """The three numbers a step reads first and compares in its save: the agent's stack version, the
    environment's driver epoch and the program's epoch, with the attempt that read them."""

    stack_version: int
    driver_epoch: int
    program_epoch: int
    attempt: int = 1

    def matches(self, current: "ReadVersions") -> bool:
        return (self.stack_version, self.driver_epoch, self.program_epoch) == (current.stack_version, current.driver_epoch, current.program_epoch)
