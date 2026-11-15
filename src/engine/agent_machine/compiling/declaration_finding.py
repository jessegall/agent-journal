from dataclasses import dataclass


@dataclass(frozen=True)
class DeclarationFinding:
    """One thing sync refuses in the declarations: the module or driver, the declaration and the fix."""

    owner: str
    declaration: str
    fix: str

    def text(self) -> str:
        return f"{self.owner}: {self.declaration}: {self.fix}"
