from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from engine.template.template_declaration import TemplateDeclaration


@dataclass(frozen=True)
class TemplateEntry:
    """A template declaration and the module that registered it."""

    module: str
    declaration: TemplateDeclaration

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "TemplateEntry":
        declaration = stored["declaration"]
        return cls(stored["module"], TemplateDeclaration(title=declaration["title"], brief=declaration["brief"],
                   targets=tuple(declaration["targets"]), purpose=declaration["purpose"],
                   parts=tuple(declaration["parts"]), commands=tuple(declaration["commands"])))
