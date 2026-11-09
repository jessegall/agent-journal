from typing import ClassVar


class StepCondition:
    """One thing that must be true of the row a sequence step works on before the step is complete."""

    name: ClassVar[str]

    def problem(self, subject_id: int) -> str | None:
        raise NotImplementedError
