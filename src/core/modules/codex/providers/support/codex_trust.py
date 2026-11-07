from core.base.file_access import FileAccess
import json
import re
import tomllib
from collections.abc import Mapping, Sequence
from pathlib import Path

from core.base.provider.hook_trust import HookTrust
from core.base.provider.program_hooks import ProgramHooks
from core.base.type_guards import is_list, is_mapping
from core.modules.codex.providers.support.codex_hook_definition import CodexHookDefinition
from core.modules.codex.providers.support.codex_hook_event import CodexHookEvent

CAPITAL = re.compile(r"(?<!^)(?=[A-Z])")
STATE_TABLE = re.compile(r'''(?ms)^\[hooks\.state\.(?:"(?:[^"\\]|\\.)*"|'[^']*')\][ \t]*(?:\r?\n|$).*?(?=^\[|\Z)''')


class CodexTrust:
    """Codex's record, in its config.toml, of which hooks of a hook file the person trusts: one state table
    per file, hook and position, which a worktree's hook file copies from the main checkout's."""

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

    def copied(self, source_file: Path, target_file: Path) -> None:
        states = self.states()
        source, target = f"{source_file}:", f"{target_file}:"
        source_hashes, target_hashes = self.hashes(source_file), self.hashes(target_file)
        added = {target + key.removeprefix(source): state for key, state in states.items()
                 if key.startswith(source) and target + key.removeprefix(source) not in states
                 and self.is_trusted(state, source_hashes.get(key))
                 and source_hashes[key] == target_hashes.get(target + key.removeprefix(source))}
        if added:
            tables = "\n".join(self.state_table(key, state) for key, state in added.items())
            FileAccess.shared().write(self.config_file, FileAccess.shared().read(self.config_file).rstrip("\n") + "\n\n" + tables)

    @staticmethod
    def is_trusted(state: object, digest: str | None) -> bool:
        return digest is not None and is_mapping(state) and state.get("enabled", True) is not False and state.get("trusted_hash") == digest

    @staticmethod
    def hashes(hook_file: Path) -> dict[str, str | None]:
        events = ProgramHooks.read(hook_file).get("hooks")
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
                                    for index, entry in enumerate(entries) if is_mapping(entry) and ProgramHooks.is_journals(entry)})
        return definitions

    def states(self) -> Mapping[str, object]:
        settings: object = tomllib.loads(FileAccess.shared().read(self.config_file)) if self.config_file.is_file() else {}
        hooks = settings.get("hooks") if is_mapping(settings) else None
        states = hooks.get("state") if is_mapping(hooks) else None
        return {str(key): state for key, state in states.items()} if is_mapping(states) else {}

    def remapped(self, hook_file: Path, original_hooks: object, updated_hooks: object) -> None:
        states = dict(self.states())
        positions = self.positions(hook_file, original_hooks)
        moved = {target: states[source] for identity, target in self.positions(hook_file, updated_hooks).items()
                 if (source := positions.get(identity)) in states and source != target}
        if not moved:
            return
        states.update(moved)
        settings = STATE_TABLE.sub("", FileAccess.shared().read(self.config_file)).rstrip("\n")
        tables = "\n".join(self.state_table(key, state) for key, state in states.items())
        FileAccess.shared().write(self.config_file, f"{settings}\n\n{tables}")

    @staticmethod
    def positions(hook_file: Path, events: object) -> dict[str, str]:
        if not is_mapping(events):
            return {}
        positions: dict[str, str] = {}
        for event, blocks in events.items():
            if not is_list(blocks):
                continue
            name = CAPITAL.sub("_", str(event)).lower()
            for group, block in enumerate(blocks):
                if not is_mapping(block) or not is_list(entries := block.get("hooks")):
                    continue
                for index, entry in enumerate(entries):
                    identity = json.dumps([name, {**block, "hooks": [entry]}], sort_keys=True)
                    positions[identity] = f"{hook_file}:{name}:{group}:{index}"
        return positions

    @staticmethod
    def state_table(key: str, state: object) -> str:
        values = "".join(f"{name} = {json.dumps(value)}\n" for name, value in state.items()) if is_mapping(state) else ""
        return f"[hooks.state.{json.dumps(key)}]\n{values}"
