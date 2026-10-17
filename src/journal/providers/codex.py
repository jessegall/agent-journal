import re
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

    def hooks_trusted(self, project: Path) -> bool:
        """Codex runs a project's hooks only once the user trusted them, which it notes in its own settings by the hooks file."""
        settings = Path.home() / ".codex" / "config.toml"
        hooks = project.resolve() / self.home / self.settings_file
        return settings.is_file() and f'[hooks.state."{hooks}:session_start' in settings.read_text()

    def transcript(self, project: Path, session: str) -> Path | None:
        return next((Path.home() / ".codex" / "sessions").glob(f"**/rollout-*-{session}.jsonl"), None)

    def resume(self, session: str) -> tuple[str, ...]:
        return ("resume", session)

    def worker_command(self, brief: str, model: str, resume: str = "") -> list[str]:
        resumed = ["resume", resume] if resume else []
        return ["codex", "exec", *resumed, "--dangerously-bypass-approvals-and-sandbox", "-m", model, brief]

    def worker_outcome(self, out: str, err: str) -> tuple[str, str]:
        """Codex prints its report; its session id, named in the run's header, is what a next job resumes."""
        found = re.search(r"session id: ([0-9a-f-]{8,})", f"{out}\n{err}", re.IGNORECASE)
        return out.strip() or err.strip(), found.group(1) if found else ""

    def hook_block(self, command: str) -> dict:
        return {kind.value: [{"matcher": "", "hooks": [{"type": "command", "command": command, "timeout": 60}]}] for kind in self.hook_kinds}
