from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool import Tool
from core.modules.plugins.support.plugin_event import PluginEvent

PLAIN_EVENTS = {HookEventName.STOP: "idle", HookEventName.PROMPT: "prompt_submitted", HookEventName.SESSION_START: "session_started",
                HookEventName.SESSION_END: "session_ended", HookEventName.COMPACT: "compacting", HookEventName.TICK: "ticked"}


class PluginEventNames:
    """Turns a version 5 hook into the version 4 events a plugin hears: a tool's start, each command of its shell
    line, each file a finished tool wrote, and the plain events by their version 4 names."""

    def events(self, hook: AgentHook) -> list[PluginEvent]:
        event, tool = hook.event.event, hook.event.tool
        if event in PLAIN_EVENTS:
            return [PluginEvent(PLAIN_EVENTS[event], {"prompt": hook.event.prompt} if hook.event.prompt else {})]
        if tool is None:
            return []
        if event is HookEventName.PRE_TOOL_USE:
            return [self.tool_event(hook, tool), *self.command_events(tool)]
        if event is HookEventName.POST_TOOL_USE and tool.is_writing_files():
            return [PluginEvent("file_edited", {"path": path, "kind": "edit"}) for path in tool.files]
        return []

    def tool_event(self, hook: AgentHook, tool: Tool) -> PluginEvent:
        return PluginEvent("tool_starting", {"tool": tool.name, "input": dict(hook.event.tool_input()), "writes": tool.is_writing_files()})

    def command_events(self, tool: Tool) -> list[PluginEvent]:
        if tool.shell is None or tool.shell.is_journal_line:
            return []
        parts = tool.shell.parts
        return [PluginEvent("command_starting", {"text": part.text, "files": [*part.input_paths, *part.output_paths], "position": place, "parts": len(parts)})
                for place, part in enumerate(parts)]
