import json
import re
from datetime import datetime
from pathlib import Path
from typing import ClassVar, Iterator

from journal.features.shell.reads import Reads
from journal.features.shell.writes import Writes
from journal.events.decision import Decision
from journal.providers.hook import Hook
from journal.providers.hook_kind import HookKind
from journal.http.response import Response
from journal.models.entry import Entry
from journal.providers.tool_input import ToolInput
from journal.providers.turn import Turn

CONTEXT_HOOKS = (HookKind.SESSION_START, HookKind.USER_PROMPT, HookKind.PRE_TOOL_USE, HookKind.POST_TOOL_USE)


TAIL = 400_000
"""How far from its end a transcript is read for its last turn."""
PATH_KEYS = ("file_path", "path", "notebook_path")
"""The keys an editing tool names its file by."""

class Provider:
    """One agent program, Claude or Codex: the few things the journal has to know about it and nothing else."""

    name: ClassVar[str]
    home: ClassVar[str]
    """The folder the program keeps in a project, such as .claude."""
    settings_file: ClassVar[str]
    """The file in that folder that holds the hooks."""
    write_tools: ClassVar[frozenset[str]]
    read_tool: ClassVar[str]
    shell_tool: ClassVar[str] = "Bash"
    settings_extras: ClassVar[dict] = {}
    """What else the program's settings file must say for the journal's sake, such as taking the project's MCP servers without asking."""
    hook_kinds: ClassVar[tuple[HookKind, ...]] = tuple(HookKind)
    controls: ClassVar[dict] = {"groups": [], "note": ""}
    """The model, effort and context choices the viewer's agent bar offers, each with the line typed into the agent to take it."""

    def transcript(self, project: Path, session: str) -> Path | None: ...

    def latest_session(self, project: Path, since: float) -> str:
        """The session of the newest conversation the provider wrote for the project since a time, for a run whose answer named none; none for a provider that keeps no such file."""
        return ""

    def subagent_transcript(self, project: Path, parent: str, agent_id: str) -> Path | None:
        """The file a subagent of the parent session wrote its conversation in; none for a provider that keeps no such file."""
        return None

    def turns(self, path: Path) -> list[Turn]: ...

    @staticmethod
    def json_lines(path: Path) -> Iterator[tuple[int, dict]]:
        """Each whole line of a transcript with its number; a last line still being written is left for the next read."""
        text = path.read_text(errors="replace")
        for number, line in enumerate(text[: text.rfind("\n") + 1].splitlines(), 1):
            if line.startswith("{"):
                yield number, json.loads(line)

    @staticmethod
    def seconds(stamp: str) -> float:
        return datetime.fromisoformat(stamp.replace("Z", "+00:00")).timestamp() if stamp else 0.0

    def thoughts_this_turn(self, project: Path, session: str) -> list[str]:
        """What the agent thought since the user's last prompt, when the provider writes thinking down: nothing for most."""
        return []

    def texts_written_before(self, project: Path, session: str, read: int, until: float) -> tuple[list[str], int]:
        """The text blocks written since the byte read last up to a moment, and the byte of the first line after it: what the hooks have not read and are past waiting for."""
        path = self.transcript(project, session)
        if path is None or read < 0:
            return [], read
        with path.open("rb") as file:
            file.seek(read)
            raw = file.read()
        texts, at = [], read
        for line in raw[:raw.rfind(b"\n") + 1].splitlines(keepends=True):
            row = json.loads(line) if line.startswith(b"{") else {}
            if self.seconds(str(row.get("timestamp", ""))) >= until:
                break
            texts += self.texts_in(row)
            at += len(line)
        return texts, at

    def texts_written(self, project: Path, session: str, read: int) -> tuple[list[str], int]:
        path = self.transcript(project, session)
        if path is None:
            return [], read
        size = path.stat().st_size
        if read > size:
            return [], size
        if read < 0:
            read = self.last_line_start(path, size)
        with path.open("rb") as file:
            file.seek(read)
            raw = file.read()
        whole = raw.rfind(b"\n") + 1
        lines = [json.loads(line) for line in raw[:whole].decode(errors="replace").splitlines() if line.startswith("{")]
        return [text for line in lines for text in self.texts_in(line)], read + whole

    def texts_in(self, line: dict) -> list[str]:
        return []

    @staticmethod
    def last_line_start(path: Path, size: int) -> int:
        with path.open("rb") as file:
            file.seek(max(0, size - TAIL))
            tail = file.read()
        body = tail[:-1] if tail.endswith(b"\n") else tail
        cut = body.rfind(b"\n")
        return max(0, size - TAIL) + cut + 1 if cut != -1 else max(0, size - TAIL)

    def resume(self, session: str) -> tuple[str, ...]: ...

    def worker_command(self, brief: str, model: str, resume: str) -> list[str]:
        """The program run headless on one job, printing its report; given a session, the same worker again with its memory."""
        ...

    def worker_outcome(self, out: str, err: str) -> tuple[str, str]:
        """What a finished worker printed, as its report, and the session a next job can resume, when the provider names one."""
        return out.strip() or err.strip(), ""

    def answer(self, hook: Hook, decision: Decision) -> Response:
        """The hook's reply in this program's shape. A refusal is 409, which the script turns into exit 2 and the reason on stderr; on Stop a line to say holds the stop in the form the program shows as feedback, not as an error, since that is how the program is told to go on, and a stop already refused once is let through."""
        kind = hook.kind
        if kind == HookKind.STOP and (not decision.allowed or decision.context):
            return Response(200, {"decision": "block", "reason": "\n".join(part for part in (decision.reason, decision.context) if part)})
        if not decision.allowed:
            return Response(409, {"error": decision.reason})
        if not decision.context:
            return Response(200, {})
        if kind in CONTEXT_HOOKS:
            return Response(200, {"hookSpecificOutput": {"hookEventName": kind.value, "additionalContext": decision.context}})
        return Response(200, {})

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"hooks": [{"type": "command", "command": command}]}] for kind in self.hook_kinds}

    def wire_hooks(self, project: Path, script: Path, command: str) -> Path:
        """Writes the journal's hook into the program's settings file, replacing any older block of ours and keeping everything else."""
        path = project / self.home / self.settings_file
        settings = json.loads(path.read_text()) if path.is_file() else {}
        hooks = {kind: [b for b in blocks if not self.ours(b)] for kind, blocks in (settings.get("hooks") or {}).items()}
        for kind, blocks in self.hook_block(command).items():
            hooks[kind] = [*hooks.get(kind, []), *blocks]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({**settings, **self.settings_extras, "hooks": {k: v for k, v in hooks.items() if v}}, indent=2) + "\n")
        return path

    @staticmethod
    def ours(block: dict) -> bool:
        """The journal's own hook, by the one path only this package's script has; a hook.sh of another package is somebody else's."""
        return "journal/hooks/hook.sh" in json.dumps(block)

    def hooks_trusted(self, project: Path) -> bool:
        """Whether the program runs the journal's hooks in this project without asking the user first."""
        return True

    def read_paths(self, tool: str, input: dict) -> tuple[str, ...]:
        """The files this tool use reads: the read tool's file, or those a shell line prints."""
        if tool == self.read_tool:
            return tuple(p for p in (ToolInput.from_json(input).file,) if p)
        return Reads.of(ToolInput.from_json(input).command) if tool == self.shell_tool else ()

    def written_paths(self, tool: str, input: dict) -> list[str]:
        """The files this tool use writes: the targets a shell line writes to, or the path an editing tool names."""
        if tool == self.shell_tool:
            return Writes.targets(ToolInput.from_json(input).command)
        return [value for key, value in input.items() if key in PATH_KEYS and isinstance(value, str)]

    def skill_loaded(self, tool: str, input: dict) -> str:
        """The skill folder a skill tool call loaded, or empty."""
        return ToolInput.from_json(input).skill if tool == "Skill" else ""

    def wrote(self, use: Entry) -> bool:
        """A recorded tool use that changed files and was not held."""
        return not use.data.get("refused") and self.writes(use.data.get("tool_name", ""), use.data.get("tool_input", {}) or {})

    def writes(self, tool: str, input: dict) -> bool:
        """Whether this tool use changes files: the editor's writing tools, or a shell line that writes."""
        return tool in self.write_tools or (tool == self.shell_tool and Writes.of(ToolInput.from_json(input).command))

    @staticmethod
    def folder_name(project: Path) -> str:
        return re.sub(r"[^A-Za-z0-9]", "-", str(project.resolve()))
