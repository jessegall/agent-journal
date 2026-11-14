import re
from collections.abc import Mapping
from pathlib import Path

RESOURCES = Path(__file__).resolve().parents[1] / "resources"
PLACEHOLDER = re.compile(r"\{([A-Z][A-Z_]+)\}")


class ShippedTexts:
    """The long fixed texts the coding suite ships, read from the Markdown files of its resources folder by name: the
    rules of each kind of helper and the instructions of each shipped profile. A profile keeps a placeholder, written
    in capitals between braces, where another shipped text belongs."""

    @staticmethod
    def rule(name: str) -> str:
        return (RESOURCES / "rules" / f"{name}.md").read_text()

    @staticmethod
    def profile(name: str, values: Mapping[str, str]) -> str:
        text = (RESOURCES / "profiles" / f"{name}.md").read_text()
        return PLACEHOLDER.sub(lambda found: values[found.group(1)], text)
