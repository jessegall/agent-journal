from core.base.driver.tool_type import ToolType
from core.testing.hook_sample import HookSample
from core.testing.shell_part import ShellPart

SAMPLE_PROGRAM = "claude"
SAMPLE_FIRING = "story-1"


class HookSamples:
    """Prepared hook objects for stories, in the shape the Go hook program sends; each but the server's own tick is
    kept beside the Go examples and checked against the schema there."""

    @staticmethod
    def sample(event: str, tool: dict[str, object] | None = None, prompt: str | None = None) -> HookSample:
        return HookSample({"version": 2, "program": SAMPLE_PROGRAM, "event": event, "session": "s-1", "firing": SAMPLE_FIRING, "fired_at_ms": 1, "actor": "agent",
                "environment": "main", "subagent": "", "tool": tool, "prompt": prompt, "raw": {}, "accepts_lines": True, "launch": ""})

    @staticmethod
    def stop() -> HookSample:
        return HookSamples.sample("stop")

    @staticmethod
    def prompt(text: str) -> HookSample:
        return HookSamples.sample("prompt", prompt=text)

    @staticmethod
    def session_start() -> HookSample:
        return HookSamples.sample("session_start")

    @staticmethod
    def edit(path: str, added: int = 1, removed: int = 0) -> HookSample:
        diff = {"path": path, "existed": True, "lines_added": added, "lines_removed": removed}
        return HookSamples.sample("pre_tool_use", {"name": "Edit", "category": ToolType.EDIT, "files": [path], "diff": diff})

    @staticmethod
    def shell(line: str, *parts: ShellPart) -> HookSample:
        texts = [text.strip() for text in line.split("&&")]
        prepared = [part.prepared(text) for part, text in zip(parts, texts, strict=True)]
        joined = [{**part, "joined_by": "&&"} if index < len(prepared) - 1 else part for index, part in enumerate(prepared)]
        shell = {"line": line, "parts": joined, "redirects": [], "category": parts[0].category, "is_journal_only": all(part.program == "journal" for part in parts),
                 "parse_error": ""}
        return HookSamples.sample("pre_tool_use", {"name": "Bash", "category": ToolType.SHELL, "files": [], "shell": shell, "diff": None})

    @staticmethod
    def subagent() -> HookSample:
        return HookSamples.sample("pre_tool_use", {"name": "Agent", "category": ToolType.AGENT, "files": [], "diff": None})

    @staticmethod
    def tick() -> HookSample:
        return HookSamples.sample("tick")
