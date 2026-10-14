import json
import re
from pathlib import Path
from typing import ClassVar

from journal.hooks.decision import Decision
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
    hook_kinds: ClassVar[tuple[HookKind, ...]] = tuple(HookKind)

    def transcript(self, project: Path, session: str) -> Path | None: ...

    def resume(self, session: str) -> tuple[str, ...]: ...

    def answer(self, kind: HookKind, decision: Decision) -> Response:
        """The hook's reply in this program's shape. A refusal is 409, which the script turns into exit 2 and the reason on stderr; on Stop a line to say is a refusal of the stop, since that is how the program is told to go on."""
        if not decision.allowed:
            return Response(409, {"error": decision.reason})
        if not decision.context:
            return Response(200, {})
        if kind == HookKind.STOP:
            return Response(409, {"error": decision.context})
        if kind in CONTEXT_HOOKS:
            return Response(200, {"hookSpecificOutput": {"hookEventName": kind.value, "additionalContext": decision.context}})
        return Response(200, {})

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"hooks": [{"type": "command", "command": command}]}] for kind in self.hook_kinds}

    def wire_hooks(self, project: Path, command: str) -> Path:
        """Writes the journal's hook into the program's settings file, replacing any older block of ours and keeping everything else."""
        path = project / self.home / self.settings_file
        settings = json.loads(path.read_text()) if path.is_file() else {}
        hooks = {kind: [b for b in blocks if not self.ours(b)] for kind, blocks in (settings.get("hooks") or {}).items()}
        for kind, blocks in self.hook_block(command).items():
            hooks[kind] = [*hooks.get(kind, []), *blocks]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({**settings, "hooks": {k: v for k, v in hooks.items() if v}}, indent=2) + "\n")
        return path

    @staticmethod
    def ours(block: dict) -> bool:
        return "hook.sh" in json.dumps(block) and "journal" in json.dumps(block)

    def read_path(self, tool: str, input: dict) -> str:
        return input.get("file_path", "") or input.get("path", "") if tool == self.read_tool else ""

    def writes(self, tool: str) -> bool:
        return tool in self.write_tools

    @staticmethod
    def folder_name(project: Path) -> str:
        return re.sub(r"[^A-Za-z0-9]", "-", str(project.resolve()))
