from dataclasses import dataclass

from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_fields import mapping, text, texts


@dataclass(frozen=True)
class Classification:
    """What a shell part is and does: its category and its effects, as the command table names them."""

    category: CommandCategory
    effects: tuple[CommandEffect, ...]

    @classmethod
    def parsed(cls, data: object) -> "Classification":
        fields = mapping(data, "classification")
        category, effects = text(fields, "category"), texts(fields, "effects")
        if category not in CommandCategory:
            raise HookEventError(f"a command's category is one of {', '.join(CommandCategory)}, not {category!r}")
        unknown = [effect for effect in effects if effect not in CommandEffect]
        if unknown:
            raise HookEventError(f"a command's effects are among {', '.join(CommandEffect)}, not {', '.join(unknown)}")
        return cls(CommandCategory(category), tuple(CommandEffect(effect) for effect in effects))
