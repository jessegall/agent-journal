from dataclasses import dataclass


@dataclass(frozen=True, kw_only=True)
class TemplateDeclaration:
    """A reusable brief and its parts supplied by a suite."""

    title: str
    brief: str = ""
    targets: tuple[str, ...] = ()
    purpose: str = ""
    parts: tuple[str, ...] = ()
    commands: tuple[str, ...] = ()
