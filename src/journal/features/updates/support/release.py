import re
from dataclasses import dataclass

TAG = re.compile(r"v?(\d+)\.(\d+)\.(\d+)$")


@dataclass(frozen=True)
class Release:
    """A release of the journal as its tag names it, such as v4.1.0; a version without the v is the same release."""

    tag: str

    @classmethod
    def lookup(cls, tags: list[str]) -> list["Release"]:
        return sorted((cls(tag) for tag in tags if TAG.match(tag)), key=lambda release: release.numbers)

    @property
    def numbers(self) -> tuple[int, ...]:
        matched = TAG.match(self.tag)
        if matched is None:
            raise ValueError(f"{self.tag} names no release")
        return tuple(int(number) for number in matched.groups())

    @property
    def version(self) -> str:
        return ".".join(str(number) for number in self.numbers)

    @property
    def major(self) -> int:
        return self.numbers[0]

    def upgrades(self, installed: "Release") -> bool:
        return self.major == installed.major and self.is_newer(installed)

    def is_newer(self, counterpart: "Release") -> bool:
        return self.numbers > counterpart.numbers
