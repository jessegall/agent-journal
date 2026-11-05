from collections.abc import Sequence

from core.base.driver.hook_event import HOOK_EVENT_VERSION
from core.base.driver.tool_type import ToolType
from core.testing.hook_sample import HookSample
from core.testing.shell_part import ShellPart

SAMPLE_PROGRAM = "claude"
SAMPLE_FIRING = "story-1"


class HookSamples:
    """Prepared hook objects for stories, in the shape the Go hook program sends; each but the server's own
    tick is kept beside the Go examples and checked against the schema there."""

    @staticmethod
    def sample(event: str, tool: dict[str, object] | None = None, prompt: str | None = None) -> HookSample:
        return HookSample({"version": HOOK_EVENT_VERSION, "program": SAMPLE_PROGRAM, "event": event, "session": "s-1", "firing": SAMPLE_FIRING, "fired_at_ms": 1, "actor": "agent",
                "environment": "main", "tool": tool, "prompt": prompt, "raw": {}, "accepts_lines": True, "launch": "", "foreign": [], "child_agent": ""})

    @staticmethod
    def tool_use(name: str, category: ToolType, files: list[str], diff: object, **fields: object) -> HookSample:
        return HookSamples.sample("pre_tool_use", {"name": name, "category": category, "files": files, "diff": diff, **fields})

    @staticmethod
    def stop() -> HookSample:
        return HookSamples.sample("stop")

    @staticmethod
    def message_display(text: str, final: bool = True) -> HookSample:
        sample = HookSamples.sample("message_display")
        return sample.with_raw({"hook_event_name": "MessageDisplay", "turn_id": "turn-1", "message_id": "message-1", "index": 0, "final": final, "delta": text}).with_fields(accepts_lines=False)

    @staticmethod
    def prompt(text: str) -> HookSample:
        return HookSamples.sample("prompt", prompt=text)

    @staticmethod
    def session_start() -> HookSample:
        return HookSamples.sample("session_start")

    @staticmethod
    def edit(path: str, added: int = 1, removed: int = 0) -> HookSample:
        diff = {"path": path, "existed": True, "lines_added": added, "lines_removed": removed}
        return HookSamples.tool_use("Edit", ToolType.EDIT, [path], diff)

    @staticmethod
    def shell(line: str, *parts: ShellPart, redirects: Sequence[str] = ()) -> HookSample:
        texts = [text.strip() for text in line.split("&&")]
        prepared = [part.prepared(text) for part, text in zip(parts, texts, strict=True)]
        joined = [{**part, "joined_by": "&&"} if index < len(prepared) - 1 else part for index, part in enumerate(prepared)]
        shell = {"line": line, "parts": joined, "redirects": list(redirects), "is_journal_only": all(part.program == "journal" for part in parts),
                 "parse_error": ""}
        return HookSamples.tool_use("Bash", ToolType.SHELL, [], None, shell=shell)

    @staticmethod
    def helper(launch_name: str) -> HookSample:
        return HookSamples.session_start().with_fields(launch=launch_name)

    @staticmethod
    def tick() -> HookSample:
        return HookSamples.sample("tick")
