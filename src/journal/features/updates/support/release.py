import re
from dataclasses import dataclass

TAG = re.compile(r"v?(\d+)\.(\d+)\.(\d+)$")


@dataclass(frozen=True)
class Release:
    """A release of the journal as its tag names it, such as v4.1.0; a version without the v is the same release."""

    tag: str

    @classmethod
    def named(cls, tags: list[str]) -> list["Release"]:
        """The tags that are plain releases, oldest first; a pre-release or any other tag is left out."""
        return sorted((cls(tag) for tag in tags if TAG.match(tag)), key=lambda release: release.numbers)

    @property
    def numbers(self) -> tuple[int, ...]:
        return tuple(int(number) for number in TAG.match(self.tag).groups())

    @property
    def version(self) -> str:
        return ".".join(str(number) for number in self.numbers)

    @property
    def major(self) -> int:
        return self.numbers[0]

    def upgrades(self, installed: "Release") -> bool:
        """Newer than the installed release and of the same major version: an update never crosses a major."""
        return self.major == installed.major and self.is_newer_than(installed)

    def is_newer_than(self, other: "Release") -> bool:
        return self.numbers > other.numbers
