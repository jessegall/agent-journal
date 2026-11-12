from engine.file.kept_bytes import KeptBytes
import json
import re
import tomllib
from collections.abc import Mapping, Sequence
from pathlib import Path

from engine.enums.hook_trust import HookTrust
from engine.provider.program_hooks import ProgramHooks
from engine.types.type_guards import is_list, is_mapping, is_text_mapping
from core.modules.codex.providers.support.codex_hook_definition import CodexHookDefinition
from core.modules.codex.models.enums.codex_hook_event import CodexHookEvent

CAPITAL = re.compile(r"(?<!^)(?=[A-Z])")


class CodexTrust:
    """Codex's stored hashes of trusted hooks in a config.toml, read to tell whether the journal's hooks are trusted."""

    def __init__(self, config_file: Path) -> None:
        self.config_file = config_file

    def trust(self, hook_file: Path, hook_names: Sequence[str]) -> HookTrust:
        states = self.states()
        if not any(key.startswith(f"{hook_file}:") and is_mapping(state) and isinstance(state.get("trusted_hash"), str) for key, state in states.items()):
            return HookTrust.UNTRUSTED
        hashes = self.hashes(hook_file)
        present = {key.rsplit(":", 3)[1] for key in hashes}
        expected = {CAPITAL.sub("_", name).lower() for name in hook_names}
        if not present >= expected:
            return HookTrust.CHANGED
        return HookTrust.READY if all(self.is_trusted(states.get(key), digest) for key, digest in hashes.items()
                                     if key.rsplit(":", 3)[1] in expected) else HookTrust.CHANGED

    @staticmethod
    def is_trusted(state: object, digest: str | None) -> bool:
        return digest is not None and is_mapping(state) and state.get("enabled", True) is not False and state.get("trusted_hash") == digest

    @staticmethod
    def hashes(hook_file: Path) -> dict[str, str | None]:
        return CodexTrust.definition_hashes(hook_file, ProgramHooks.read(hook_file).get("hooks"))

    @staticmethod
    def definition_hashes(hook_file: Path, events: object) -> dict[str, str | None]:
        if not is_mapping(events):
            return {}
        definitions: dict[str, str | None] = {}
        for event in CodexHookEvent:
            blocks = events.get(event.value)
            if not is_list(blocks):
                continue
            for group, block in enumerate(blocks):
                if not is_mapping(block) or not is_list(entries := block.get("hooks")):
                    continue
                definitions.update({f"{hook_file}:{event.key}:{group}:{index}": CodexHookDefinition(event, block.get("matcher"), entry).current_hash()
                                    for index, entry in enumerate(entries) if is_text_mapping(entry) and ProgramHooks.is_journals(entry)})
        return definitions

    def states(self) -> Mapping[str, object]:
        return self.state_values(self.read())

    def read(self) -> str:
        if not self.config_file.is_file():
            return ""
        return KeptBytes.read(self.config_file).decode()

    @staticmethod
    def state_values(text: str) -> Mapping[str, object]:
        settings: object = tomllib.loads(text)
        hooks = settings.get("hooks") if is_mapping(settings) else None
        states = hooks.get("state") if is_mapping(hooks) else None
        return {str(key): state for key, state in states.items()} if is_mapping(states) else {}

    @staticmethod
    def state_table(key: str, state: object) -> str:
        values = "".join(f"{name} = {json.dumps(value)}\n" for name, value in state.items()) if is_mapping(state) else ""
        return f"[hooks.state.{json.dumps(key)}]\n{values}"
