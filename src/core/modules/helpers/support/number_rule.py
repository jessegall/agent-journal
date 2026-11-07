import math
from collections.abc import Iterator
from dataclasses import dataclass


@dataclass(frozen=True)
class NumberRule:
    """What a number setting accepts: a finite number, a whole number when integer is set, at least the minimum
    (more than the minimum when exclusive is set) and at most the maximum when there is one."""

    minimum: float
    integer: bool = True
    maximum: float | None = None
    exclusive: bool = False

    def problems(self, key: str, value: object) -> Iterator[str]:
        if isinstance(value, bool) or not isinstance(value, int | float):
            yield f"{key} is a number, not {value!r}"
        elif not math.isfinite(value):
            yield f"{key} must be a finite number, not {value!r}"
        elif self.integer and value != int(value):
            yield f"{key} must be a whole number, not {value!r}"
        elif value < self.minimum or (self.exclusive and value == self.minimum):
            yield f"{key} must be {'more than' if self.exclusive else 'at least'} {self.minimum:g}, not {value!r}"
        elif self.maximum is not None and value > self.maximum:
            yield f"{key} must be at most {self.maximum:g}, not {value!r}"
