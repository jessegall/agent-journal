from dataclasses import dataclass

from engine.driver.command_category import CommandCategory
from engine.driver.command_effect import CommandEffect
from engine.driver.hook_event_error import HookEventError
from engine.driver.hook_fields import mapping, text, texts


@dataclass(frozen=True)
class Classification:
    """What a shell part is and does: its category and its effects, as the command table names them, and whether
    the hook could not judge it from the line. A hook too old to say counts as not having judged it."""

    category: CommandCategory
    effects: tuple[CommandEffect, ...]
    uncertain: bool = False
    uncertainty_absent: bool = False

    @classmethod
    def parsed(cls, data: object) -> "Classification":
        fields = mapping(data, "classification")
        category, effects = text(fields, "category"), texts(fields, "effects")
        if category not in CommandCategory:
            raise HookEventError(f"a command's category is one of {', '.join(CommandCategory)}, not {category!r}")
        unknown = [effect for effect in effects if effect not in CommandEffect]
        if unknown:
            raise HookEventError(f"a command's effects are among {', '.join(CommandEffect)}, not {', '.join(unknown)}")
        return cls(CommandCategory(category), tuple(CommandEffect(effect) for effect in effects), fields.get("uncertain") is True, "uncertain" not in fields)
