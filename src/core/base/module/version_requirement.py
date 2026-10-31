import re
from dataclasses import dataclass

from core.base.module.module_error import ModuleError

BOUND = re.compile(r"^(>=|<=|>|<|==)(\d+(?:\.\d+){0,2})$")


@dataclass(frozen=True)
class VersionRequirement:
    """The core versions a module works with, written as bounds such as >=5.0,<6."""

    text: str

    def allows(self, version: tuple[int, int, int]) -> bool:
        return all(self.bound_allows(bound.strip(), version) for bound in self.text.split(","))

    def bound_allows(self, bound: str, version: tuple[int, int, int]) -> bool:
        match = BOUND.match(bound)
        if match is None:
            raise ModuleError(f"{bound} is no version bound; write it like >=5.0 or <6")
        operator, number = match.groups()
        parts = tuple(int(part) for part in number.split("."))
        wanted = parts + (0,) * (3 - len(parts))
        comparisons = {">=": version >= wanted, "<=": version <= wanted, ">": version > wanted, "<": version < wanted, "==": version == wanted}
        return comparisons[operator]
