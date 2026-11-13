import json
import tomllib
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path
from textwrap import dedent

from engine.types.type_guards import is_mapping
from core.modules.codex.providers.support.codex_trust import CodexTrust

PERSON_CONFIG_KEYS = ("model_provider", "model_providers")
CONFIG_HEADER = dedent("""\
    # Written by the journal at every start; changes are put back.
    approval_policy = "never"
    sandbox_mode = "danger-full-access"
""")
TRUSTED_PROJECT = 'trust_level = "trusted"'


@dataclass(frozen=True)
class CodexJournalConfig:
    """The config.toml the journal writes whole for Codex: bypass, the model providers copied from the user's
    config, the folders Codex trusts and the trusted hashes of the journal's hooks."""

    person_config: bytes
    folders: Sequence[Path]
    hooks_file: Path
    hooks: Mapping[str, list[object]]

    def text(self) -> str:
        return "\n".join([CONFIG_HEADER, *self.person_sections(), *self.project_sections(), *self.trust_sections()])

    def person_sections(self) -> list[str]:
        person_values = {key: value for key, value in self.person_settings().items() if key in PERSON_CONFIG_KEYS}
        lines = "".join(f"{json.dumps(key)} = {json.dumps(value)}\n" for key, value in person_values.items() if not is_mapping(value))
        tables = [self.tables(tuple([key]), value) for key, value in person_values.items() if is_mapping(value)]
        return [lines, *tables] if lines else tables

    def project_sections(self) -> list[str]:
        return [f"[projects.{json.dumps(str(folder))}]\n{TRUSTED_PROJECT}\n" for folder in sorted(self.folders)]

    def trust_sections(self) -> list[str]:
        return [CodexTrust.state_table(key, {"enabled": True, "trusted_hash": digest})
                for key, digest in CodexTrust.definition_hashes(self.hooks_file, self.hooks).items() if digest is not None]

    def person_settings(self) -> dict[str, object]:
        try:
            return tomllib.loads(self.person_config.decode())
        except (tomllib.TOMLDecodeError, UnicodeDecodeError):
            return {}

    @classmethod
    def tables(cls, keys: tuple[str, ...], table: Mapping[object, object]) -> str:
        header = ".".join(json.dumps(key) for key in keys)
        values = "".join(f"{json.dumps(str(name))} = {json.dumps(value)}\n" for name, value in table.items() if not is_mapping(value))
        nested = "".join(f"\n{cls.tables((*keys, str(name)), value)}" for name, value in table.items() if is_mapping(value))
        return f"[{header}]\n{values}{nested}"
