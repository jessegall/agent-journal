from pathlib import Path

from journal.hooks.hook_kind import HookKind
from journal.providers.provider import Provider


class Codex(Provider):
    name = "codex"
    home = ".codex"
    settings_file = "hooks.json"
    write_tools = frozenset({"apply_patch", "write_file"})
    read_tool = "read_file"
    hook_kinds = tuple(kind for kind in HookKind if kind != HookKind.MESSAGE_DISPLAY)

    def transcript(self, project: Path, session: str) -> Path | None:
        return next((Path.home() / ".codex" / "sessions").glob(f"**/rollout-*-{session}.jsonl"), None)

    def resume(self, session: str) -> tuple[str, ...]:
        return ("resume", session)

    def worker_command(self, brief: str, model: str) -> list[str]:
        return ["codex", "exec", "--dangerously-bypass-approvals-and-sandbox", "-m", model, brief]

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}] for kind in self.hook_kinds}
