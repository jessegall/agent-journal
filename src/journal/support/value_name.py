from dataclasses import dataclass


@dataclass(frozen=True)
class ValueName:
    """A count or time a workflow keeps, by the workflow's number and the value's own name, stored as charts:<workflow>:<name>."""

    workflow: int
    name: str

    @property
    def stored(self) -> str:
        return f"{self.prefix(self.workflow)}{self.name}"

    @staticmethod
    def prefix(workflow: int) -> str:
        """What the stored names of a workflow's values begin with."""
        return f"charts:{workflow}:"
