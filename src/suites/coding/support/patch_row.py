from collections.abc import Mapping
from dataclasses import asdict, dataclass, replace

ROW_TEXT_CHARACTERS = 400


@dataclass(frozen=True)
class PatchRow:
    """One line of a patch as the file feed reads it, with its text cut as the hook cuts an edit tool's lines."""

    line_type: str
    line: int
    text: str

    def listed(self) -> Mapping[str, object]:
        return asdict(replace(self, text=self.text[:ROW_TEXT_CHARACTERS]))
