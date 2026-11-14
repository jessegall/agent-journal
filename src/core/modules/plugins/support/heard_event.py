from dataclasses import dataclass

from engine.errors.refusal import Refusal
from engine.types.type_guards import is_list, is_text_mapping


@dataclass(frozen=True)
class HeardEvent:
    """One entry of a plugin's hears list: the event, the tools it is limited to when it names any, and the fewest
    minutes between two deliveries when it asks for an interval."""

    event: str
    tools: tuple[str, ...] = ()
    every_minutes: int = 0

    @classmethod
    def read(cls, entry: object) -> "HeardEvent":
        if not is_text_mapping(entry):
            return cls(str(entry))
        if "event" not in entry:
            raise Refusal(f"a hears entry has no event: {entry}", "name it with \"event\"")
        tools = entry["tools"] if "tools" in entry else ()
        every_minutes = entry["every_minutes"] if "every_minutes" in entry else 0
        if not is_list(tools) and tools != ():
            raise Refusal(f"the tools of hears entry {entry['event']} are not a list", "write \"tools\": [\"Edit\", \"Write\"]")
        if not isinstance(every_minutes, int) or every_minutes < 0:
            raise Refusal(f"every_minutes of hears entry {entry['event']} is not a whole number of minutes", "write \"every_minutes\": 5")
        return cls(str(entry["event"]), tuple(str(tool) for tool in tools), every_minutes)

    def accepts_tool(self, tool: object) -> bool:
        return not self.tools or tool in self.tools
