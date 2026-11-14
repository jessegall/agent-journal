import re
from collections.abc import Mapping
from pathlib import Path

from engine.file.file_access import FileAccess

RESOURCES = Path(__file__).resolve().parents[1] / "resources"
PLACEHOLDER = re.compile(r"\{([A-Z][A-Z_]+)\}")


class ShippedTexts:
    """The long fixed texts the coding suite ships, read from the Markdown files of its resources folder by
    name: the rules of each kind of helper and the instructions of each shipped profile. A profile keeps a
    placeholder, written in capitals between braces, where another shipped text belongs."""

    @staticmethod
    def rule(name: str) -> str:
        return FileAccess.read(RESOURCES / "rules" / f"{name}.md")

    @staticmethod
    def profile(name: str, values: Mapping[str, str]) -> str:
        text = FileAccess.read(RESOURCES / "profiles" / f"{name}.md")
        return PLACEHOLDER.sub(lambda matched: values[matched.group(1)], text)
