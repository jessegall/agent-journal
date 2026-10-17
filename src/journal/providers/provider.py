import json
import re
from pathlib import Path
from typing import ClassVar

from journal.features.shell.reads import Reads
from journal.features.shell.writes import Writes
from journal.hooks.decision import Decision
from journal.hooks.hook import Hook
from journal.hooks.hook_kind import HookKind
from journal.http.response import Response

CONTEXT_HOOKS = (HookKind.SESSION_START, HookKind.USER_PROMPT, HookKind.PRE_TOOL_USE, HookKind.POST_TOOL_USE)


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

    def transcript(self, project: Path, session: str) -> Path | None: ...

    def thoughts_this_turn(self, project: Path, session: str) -> list[str]:
        """What the agent thought since the user's last prompt, when the provider writes thinking down: nothing for most."""
        return []

    def texts_written(self, project: Path, session: str, read: int) -> tuple[list[str], int]:
        """The text blocks the agent wrote for the user since the byte of its transcript read last, and the byte to read from next; a provider with no transcript writes none."""
        return [], read

    def resume(self, session: str) -> tuple[str, ...]: ...

    controls: ClassVar[dict] = {"groups": [], "note": ""}
    """The model, effort and context choices the viewer's agent bar offers, each with the line typed into the agent to take it."""

    def worker_command(self, brief: str, model: str, resume: str = "") -> list[str]:
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
        """The journal's own hook, by the one path only this package's script has; version 3's hook.sh is somebody else's."""
        return "journal/hooks/hook.sh" in json.dumps(block)

    def read_paths(self, tool: str, input: dict) -> tuple[str, ...]:
        """The files this tool use reads: the read tool's file, or those a shell line prints."""
        if tool == self.read_tool:
            return tuple(p for p in (input.get("file_path", "") or input.get("path", ""),) if p)
        return Reads.of(input.get("command", "")) if tool == self.shell_tool else ()

    def skill_loaded(self, tool: str, input: dict) -> str:
        """The skill folder a skill tool call loaded, or empty."""
        return input.get("skill", "") if tool == "Skill" else ""

    def writes(self, tool: str, input: dict) -> bool:
        """Whether this tool use changes files: the editor's writing tools, or a shell line that writes."""
        return tool in self.write_tools or (tool == self.shell_tool and Writes.of(input.get("command", "")))

    @staticmethod
    def folder_name(project: Path) -> str:
        return re.sub(r"[^A-Za-z0-9]", "-", str(project.resolve()))
