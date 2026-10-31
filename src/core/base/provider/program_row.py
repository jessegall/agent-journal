from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.provider.provider import Provider


@dataclass(frozen=True)
class ProgramRow:
    """One agent program's row of the program table: its hook names under the journal's event names, the
    hooks a subagent's run still sends, the events whose answer takes lines, its refusal styles, tool
    categories and decoder."""

    events: Mapping[str, str]
    subagent_events: Sequence[str]
    line_events: Sequence[str]
    refusals: Mapping[str, str]
    tool_categories: Mapping[str, str]
    decoder: str

    @classmethod
    def row(cls, provider: type[Provider]) -> "ProgramRow":
        return cls({hook: name.value for hook, name in provider.hook_events.items()}, list(provider.subagent_events),
                   [name.value for name in provider.line_events], {name.value: style.value for name, style in provider.refusals.items()},
                   {tool: category.value for tool, category in provider.tool_categories.items()}, provider.decoder.value)
