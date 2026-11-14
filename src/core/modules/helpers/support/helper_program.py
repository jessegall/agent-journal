from dataclasses import dataclass


@dataclass(frozen=True)
class HelperProgram:
    """The program and model a helper can start on, with its fallback explanation."""

    program: str
    model: str
    note: str = ""
