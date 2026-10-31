import sys
from pathlib import Path

from install.program_hooks import ProgramHooks

CLAUDE_EVENTS = ["SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse", "PostToolUseFailure", "PreCompact", "Stop", "StopFailure",
                 "SubagentStart", "SubagentStop", "SessionEnd"]
CODEX_EVENTS = ["SessionStart", "Stop", "UserPromptSubmit", "PreToolUse", "PostToolUse", "SessionEnd", "PreCompact", "SubagentStart", "SubagentStop"]
HOOK_TIMEOUT_SECONDS = 60


class HookWriter:
    """Writes the hooks of both agent programs into a project, each calling the given hook runner."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.programs = [ProgramHooks("claude", root / ".claude" / "settings.local.json", CLAUDE_EVENTS, HOOK_TIMEOUT_SECONDS),
                         ProgramHooks("codex", root / ".codex" / "hooks.json", CODEX_EVENTS, HOOK_TIMEOUT_SECONDS)]

    def write(self, runner: str) -> None:
        for program in self.programs:
            program.write(runner, self.root)


if __name__ == "__main__":
    HookWriter(Path(sys.argv[1])).write(sys.argv[2])
