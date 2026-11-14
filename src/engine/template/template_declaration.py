from dataclasses import dataclass

from engine.types.class_fields import class_fields


@dataclass(frozen=True, kw_only=True)
class TemplateDeclaration:
    """A reusable brief and its parts supplied by a module."""

    title: str
    brief: str = ""
    targets: tuple[str, ...] = ()
    purpose: str = ""
    parts: tuple[str, ...] = ()
    commands: tuple[str, ...] = ()

    # a template written as a class in its own file sets the fields as class attributes
    @classmethod
    def declared(cls) -> "TemplateDeclaration":
        return TemplateDeclaration(**class_fields(cls, TemplateDeclaration))
