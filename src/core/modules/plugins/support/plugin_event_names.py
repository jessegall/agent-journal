from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.tool import Tool
from core.modules.plugins.support.plugin_event import PluginEvent

PLAIN_EVENTS = {HookEventName.STOP: "idle", HookEventName.PROMPT: "prompt_submitted", HookEventName.SESSION_START: "session_started",
                HookEventName.SESSION_END: "session_ended", HookEventName.COMPACT: "compacting", HookEventName.TICK: "ticked"}


class PluginEventNames:
    """Converts agent hooks into plugin events, including the agent's working folder. A shell line is one
    command_starting event, so a plugin that holds it starts once for the line, whatever its number of parts."""

    def events(self, hook: AgentHook) -> list[PluginEvent]:
        events = self.hook_events(hook)
        folder = hook.event.raw.get("cwd")
        if not isinstance(folder, str):
            return events
        return [PluginEvent(event.name, {**event.data, "cwd": folder}) for event in events]

    def hook_events(self, hook: AgentHook) -> list[PluginEvent]:
        event, tool = hook.event.event, hook.event.tool
        if event in PLAIN_EVENTS:
            return [PluginEvent(PLAIN_EVENTS[event], {"prompt": hook.event.prompt} if hook.event.prompt else {})]
        if tool is None:
            return []
        if event is HookEventName.PRE_TOOL_USE:
            return [self.tool_event(hook, tool), *self.command_events(tool)]
        return []

    def tool_event(self, hook: AgentHook, tool: Tool) -> PluginEvent:
        return PluginEvent("tool_starting", {"tool": tool.name, "input": dict(hook.event.tool_input()), "writes": tool.is_writing_files()})

    def command_events(self, tool: Tool) -> list[PluginEvent]:
        if tool.shell is None or tool.shell.is_journal_line or not tool.shell.parts:
            return []
        parts = tool.shell.parts
        commands = [{"text": part.text, "files": [*part.input_paths, *part.output_paths], "position": place} for place, part in enumerate(parts)]
        files = list(dict.fromkeys(file for command in commands for file in command["files"]))
        return [PluginEvent("command_starting", {"text": " ; ".join(command["text"] for command in commands), "files": files, "position": 0, "parts": len(parts), "commands": commands})]
