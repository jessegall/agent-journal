from collections.abc import Mapping
from dataclasses import dataclass, fields
from fnmatch import fnmatch
from typing import Self
import re

from engine.driver.agent_hook import AgentHook
from engine.enums.hook_event_name import HookEventName
from engine.errors.refusal import Refusal


ROW_TRIGGER = "row"
PHRASE_TRIGGER = "phrase"
COMMAND_TRIGGER = "command"
FILE_TRIGGER = "file"
FILE_TEXT_TRIGGER = "file-text"
TOOL_TRIGGER = "tool"
REQUIRED_FIELDS = {ROW_TRIGGER: ["event"], PHRASE_TRIGGER: ["text"], COMMAND_TRIGGER: ["pattern"], FILE_TRIGGER: ["pattern"], FILE_TEXT_TRIGGER: ["pattern", "text"], TOOL_TRIGGER: ["tool"]}
PATTERN_TRIGGERS = (COMMAND_TRIGGER, TOOL_TRIGGER)


@dataclass(frozen=True)
class SequenceTrigger:
    """One thing that starts a sequence on its own, by its type and the fields that type reads."""

    trigger_type: str = ""
    event: str = ""
    text: str = ""
    pattern: str = ""
    tool: str = ""
    end_events: str = ""
    link_source: str = ""

    @classmethod
    def parsed(cls, values: Mapping[object, object]) -> Self:
        names = {field.name for field in fields(cls)}
        return cls(**{str(name): str(value) for name, value in values.items() if name in names})

    def check(self) -> None:
        category = self.trigger_type
        if category not in REQUIRED_FIELDS:
            raise Refusal(f"{category} is no type of trigger", f"the types are {', '.join(REQUIRED_FIELDS)}")
        missing = [name for name in REQUIRED_FIELDS[category] if not getattr(self, name).strip()]
        if missing:
            raise Refusal(f"a {category} trigger needs its {', '.join(missing)}")
        if (self.end_events or self.link_source) and category != ROW_TRIGGER:
            raise Refusal(f"a {category} trigger cannot name end events or a link source", "only a row trigger takes end_events and link_source")
        if category in PATTERN_TRIGGERS and self.pattern:
            try:
                re.compile(self.pattern)
            except re.error as error:
                raise Refusal(f"the pattern {self.pattern} does not read: {error}") from error

    @property
    def row_model(self) -> str:
        return self.event.partition(".")[0]

    @property
    def end_event_names(self) -> tuple[str, ...]:
        return tuple(name.strip() for name in self.end_events.split(",") if name.strip())

    def matches_hook(self, hook: AgentHook) -> bool:
        event = hook.event
        category = self.trigger_type
        if category == PHRASE_TRIGGER:
            return event.event is HookEventName.PROMPT and event.prompt is not None and self.text.lower() in event.prompt.lower()
        tool = event.tool
        if event.event is not HookEventName.POST_TOOL_USE or tool is None:
            return False
        if category == COMMAND_TRIGGER:
            return tool.shell is not None and tool.shell.has_part_matching(self.pattern)
        if category == FILE_TRIGGER:
            return any(fnmatch(path, self.pattern) for path in tool.files)
        if category == FILE_TEXT_TRIGGER:
            added = any(row["line_type"] == "add" and self.text in str(row["text"]) for row in tool.diff_rows)
            return added and any(fnmatch(path, self.pattern) for path in tool.files)
        if category == TOOL_TRIGGER:
            matches = tool.shell.has_part_matching(self.pattern) if tool.shell is not None else re.search(self.pattern, " ".join(tool.files)) is not None
            return tool.name == self.tool and (not self.pattern or matches)
        return False
