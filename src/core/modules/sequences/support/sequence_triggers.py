import json
import re
from collections.abc import Mapping, Sequence
from fnmatch import fnmatch

from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_event_name import HookEventName
from core.base.refusal import Refusal
from core.base.type_guards import is_list, is_mapping

ROW_TRIGGER = "row"
PHRASE_TRIGGER = "phrase"
COMMAND_TRIGGER = "command"
FILE_TRIGGER = "file"
FILE_TEXT_TRIGGER = "file-text"
TOOL_TRIGGER = "tool"
REQUIRED_FIELDS = {ROW_TRIGGER: ("moment",), PHRASE_TRIGGER: ("text",), COMMAND_TRIGGER: ("pattern",), FILE_TRIGGER: ("pattern",), FILE_TEXT_TRIGGER: ("pattern", "text"), TOOL_TRIGGER: ("tool",)}
PATTERN_TRIGGERS = (COMMAND_TRIGGER, TOOL_TRIGGER)


class SequenceTriggers:
    """What starts a sequence on its own, kept as JSON on the sequence: a record made, words in the user's prompt, a command, an edited file, a text an edit adds, or a tool used."""

    @staticmethod
    def parsed(text: str) -> Sequence[Mapping[str, str]]:
        try:
            triggers: object = json.loads(text)
        except ValueError as error:
            raise Refusal(f"a sequence's triggers are JSON: {error}") from error
        if not is_list(triggers):
            raise Refusal("a sequence's triggers are a list")
        if not all(is_mapping(trigger) for trigger in triggers):
            raise Refusal("a sequence's trigger is an object")
        checked = [{str(name): str(value) for name, value in trigger.items()} for trigger in triggers if is_mapping(trigger)]
        for trigger in checked:
            SequenceTriggers.check(trigger)
        return checked

    @staticmethod
    def check(trigger: Mapping[str, str]) -> None:
        kind = trigger.get("trigger_type")
        if kind not in REQUIRED_FIELDS:
            raise Refusal(f"{kind} is no kind of trigger", f"the kinds are {', '.join(REQUIRED_FIELDS)}")
        missing = [name for name in REQUIRED_FIELDS[kind] if not str(trigger.get(name, "")).strip()]
        if missing:
            raise Refusal(f"a {kind} trigger needs its {', '.join(missing)}")
        if kind in PATTERN_TRIGGERS and trigger.get("pattern"):
            try:
                re.compile(trigger["pattern"])
            except re.error as error:
                raise Refusal(f"the pattern {trigger['pattern']} does not read: {error}") from error

    @staticmethod
    def met_by_hook(trigger: Mapping[str, str], hook: AgentHook) -> bool:
        event = hook.event
        kind = trigger["trigger_type"]
        if kind == PHRASE_TRIGGER:
            return event.event is HookEventName.PROMPT and trigger["text"].lower() in (event.prompt or "").lower()
        tool = event.tool
        if event.event is not HookEventName.POST_TOOL_USE or tool is None:
            return False
        if kind == COMMAND_TRIGGER:
            return tool.shell is not None and re.search(trigger["pattern"], tool.shell.line) is not None
        if kind == FILE_TRIGGER:
            return any(fnmatch(path, trigger["pattern"]) for path in tool.files)
        if kind == FILE_TEXT_TRIGGER:
            return any(fnmatch(path, trigger["pattern"]) for path in tool.files) and any(row["line_type"] == "add" and trigger["text"] in str(row["text"]) for row in tool.diff_rows)
        if kind == TOOL_TRIGGER:
            named = tool.shell.line if tool.shell is not None else " ".join(tool.files)
            return tool.name == trigger["tool"] and (not trigger.get("pattern") or re.search(trigger["pattern"], named) is not None)
        return False
