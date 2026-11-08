from dataclasses import dataclass


@dataclass(frozen=True)
class InstructionImport:
    """One file an instruction file imports, how many times it names it, and whether that file imports it back."""

    file: str
    imported: str
    count: int
    imports_back: bool
