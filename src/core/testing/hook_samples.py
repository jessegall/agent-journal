from core.testing.shell_part import ShellPart

SAMPLE_PROGRAM = "claude"


class HookSamples:
    """Prepared hook objects for stories, in the shape the Go hook program sends; each but the server's own tick is
    kept beside the Go examples and checked against the schema there."""

    @staticmethod
    def sample(event: str, tool: dict[str, object] | None = None, prompt: str | None = None) -> dict[str, object]:
        return {"version": 1, "program": SAMPLE_PROGRAM, "event": event, "session": "s-1", "firing": "story-1", "fired_at_ms": 1, "actor": "agent",
                "environment": "main", "subagent": "", "tool": tool, "prompt": prompt, "raw": {}}

    @staticmethod
    def stop() -> dict[str, object]:
        return HookSamples.sample("stop")

    @staticmethod
    def prompt(text: str) -> dict[str, object]:
        return HookSamples.sample("prompt", prompt=text)

    @staticmethod
    def session_start() -> dict[str, object]:
        return HookSamples.sample("session_start")

    @staticmethod
    def edit(path: str, added: int = 1, removed: int = 0) -> dict[str, object]:
        diff = {"path": path, "existed": True, "lines_added": added, "lines_removed": removed}
        return HookSamples.sample("pre_tool_use", {"name": "Edit", "kind": "edit", "files": [path], "diff": diff})

    @staticmethod
    def shell(line: str, *parts: ShellPart) -> dict[str, object]:
        texts = [text.strip() for text in line.split("&&")]
        prepared = [part.prepared(text) for part, text in zip(parts, texts, strict=True)]
        joined = [{**part, "joined_by": "&&"} if index < len(prepared) - 1 else part for index, part in enumerate(prepared)]
        shell = {"line": line, "parts": joined, "redirects": [], "kind": parts[0].category, "is_journal_only": all(part.program == "journal" for part in parts),
                 "parse_error": ""}
        return HookSamples.sample("pre_tool_use", {"name": "Bash", "kind": "shell", "files": [], "shell": shell, "diff": None})

    @staticmethod
    def subagent() -> dict[str, object]:
        return HookSamples.sample("pre_tool_use", {"name": "Agent", "kind": "agent", "files": [], "diff": None})

    @staticmethod
    def tick() -> dict[str, object]:
        return HookSamples.sample("tick")
