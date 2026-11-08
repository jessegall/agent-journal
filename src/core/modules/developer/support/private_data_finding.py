from dataclasses import dataclass

from core.modules.developer.support.private_data_category import PrivateDataCategory


@dataclass(frozen=True)
class PrivateDataFinding:
    """One place private data was found: the file, the line number and the kind, and none of the text."""

    file: str
    line: int
    category: PrivateDataCategory

    @property
    def key(self) -> str:
        return f"private-data:{self.file}:{self.line}:{self.category.name}"

    @property
    def text(self) -> str:
        return f"{self.file}, line {self.line}: {self.category.value}"
