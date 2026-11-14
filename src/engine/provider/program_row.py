from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.provider.provider import Provider


@dataclass(frozen=True)
class ProgramRow:
    """One agent program's row of the program table: its hook names under the journal's event names, the
    the events whose answer takes lines, its refusal styles, tool
    categories, decoder, the fields a rewritten tool input must carry and how it is stopped at each event."""

    events: Mapping[str, str]
    line_events: Sequence[str]
    plain_output_events: Sequence[str]
    refusals: Mapping[str, str]
    tool_categories: Mapping[str, str]
    decoder: str
    rewrites: Mapping[str, Mapping[str, object]]
    matchers: Mapping[str, str]
    halts: Mapping[str, str]

    @classmethod
    def row(cls, provider: type[Provider]) -> "ProgramRow":
        return cls({hook: name.value for hook, name in provider.hook_events.items()},
                   [name.value for name in provider.line_events], [name.value for name in provider.plain_output_events],
                   {name.value: style.value for name, style in provider.refusals.items()},
                   {tool: category.value for tool, category in provider.tool_categories.items()}, provider.decoder.value,
                   {name.value: dict(fields) for name, fields in provider.rewrites.items()}, dict(provider.matchers),
                   {name.value: style.value for name, style in provider.halts.items()})
