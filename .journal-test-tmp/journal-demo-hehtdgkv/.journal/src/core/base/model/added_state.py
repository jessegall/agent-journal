from enum import StrEnum


class AddedState(str):
    """A state a module added to a model. It reads like a member of the model's enum, so stored values, comparisons
    and .value work the same for both."""

    __slots__ = ()

    @property
    def value(self) -> str:
        return str(self)


StateValue = StrEnum | AddedState
