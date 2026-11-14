from engine.driver.agent_hook import AgentHook
from engine.enums.hook_event_name import HookEventName
from engine.driver.tool import Tool
from core.modules.plugins.support.plugin_event import PluginEvent

PLAIN_EVENTS = {HookEventName.STOP: "idle", HookEventName.PROMPT: "prompt_submitted", HookEventName.SESSION_START: "session_started",
                HookEventName.SESSION_END: "session_ended", HookEventName.COMPACT: "compacting", HookEventName.TICK: "ticked"}


class PluginEventNames:
    """Converts agent hooks into plugin events, including the agent's working folder."""

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
        if tool.shell is None or tool.shell.is_journal_line:
            return []
        parts = tool.shell.parts
        return [PluginEvent("command_starting", {"text": part.text, "files": [*part.input_paths, *part.output_paths], "position": place, "parts": len(parts)})
                for place, part in enumerate(parts)]
