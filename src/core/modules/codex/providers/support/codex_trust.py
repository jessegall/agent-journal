import json
import re
import tomllib
from collections.abc import Mapping, Sequence
from pathlib import Path

from core.base.provider.hook_trust import HookTrust
from core.base.type_guards import is_mapping

CAPITAL = re.compile(r"(?<!^)(?=[A-Z])")


class CodexTrust:
    """Codex's record, in its config.toml, of which hooks of a hook file the person trusts: one state table per
    file, hook and position, which a worktree's hook file copies from the main checkout's."""

    def __init__(self, config_file: Path) -> None:
        self.config_file = config_file

    def trust(self, hook_file: Path, hook_names: Sequence[str]) -> HookTrust:
        trusted = {key.rsplit(":", 3)[1] for key, state in self.states().items() if key.startswith(f"{hook_file}:") and key.count(":") >= 3
                   and (not is_mapping(state) or state.get("enabled", True) is not False)}
        if not trusted:
            return HookTrust.UNTRUSTED
        return HookTrust.READY if trusted >= {CAPITAL.sub("_", name).lower() for name in hook_names} else HookTrust.CHANGED

    def copied(self, source_file: Path, target_file: Path) -> None:
        states = self.states()
        source, target = f"{source_file}:", f"{target_file}:"
        added = {target + key.removeprefix(source): state for key, state in states.items()
                 if key.startswith(source) and target + key.removeprefix(source) not in states}
        if added:
            tables = "\n".join(self.state_table(key, state) for key, state in added.items())
            self.config_file.write_text(self.config_file.read_text().rstrip("\n") + "\n\n" + tables)

    def states(self) -> Mapping[str, object]:
        settings: object = tomllib.loads(self.config_file.read_text()) if self.config_file.is_file() else {}
        hooks = settings.get("hooks") if is_mapping(settings) else None
        states = hooks.get("state") if is_mapping(hooks) else None
        return {str(key): state for key, state in states.items()} if is_mapping(states) else {}

    @staticmethod
    def state_table(key: str, state: object) -> str:
        values = "".join(f"{name} = {json.dumps(value)}\n" for name, value in state.items()) if is_mapping(state) else ""
        return f"[hooks.state.{json.dumps(key)}]\n{values}"
