from dataclasses import dataclass


@dataclass(frozen=True)
class Fault:
    """One reason a workflow is not saved, in words, naming the node it is about when it is about one."""

    words: str
    node: str = ""

    def __str__(self) -> str:
        return self.words
