import errno
import tomllib
from pathlib import Path

from core.base.access import Access
from core.base.file_access import FileAccess
from core.base.log_level import LogLevel
from core.base.profile.agent_profile import AgentProfile
from core.base.refusal import Refusal
from core.base.system_log_writer import SystemLogWriter
from core.base.text_digest import TextDigest
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_files import CLAUDE_FOLDER, CODEX_FOLDER, SHIPPED_PREFIX, ProfileFiles
from core.modules.profiles.support.profile_format import ProfileFormat


class ProfileFolderMove:
    """Copies native profiles once and keeps later source changes beside the personal copy."""

    def __init__(self, files: ProfileFiles, digest: TextDigest, system_log: SystemLogWriter) -> None:
        self.files, self.digest, self.system_log = files, digest, system_log

    def publish(self) -> None:
        try:
            self.files.publish(self.run())
        except OSError as error:
            if not isinstance(error, PermissionError) and error.errno not in (errno.EROFS, errno.EACCES, errno.EPERM):
                raise
            self.system_log.write(LogLevel.WARNING, f"Profiles left unchanged: the profile folder is read-only ({error})")

    def run(self) -> tuple[Path, ...]:
        claude = tuple(self.files.folder(CLAUDE_FOLDER).glob("*.md"))
        names = {path.stem for path in claude}
        codex = tuple(path for path in self.files.folder(CODEX_FOLDER).glob("*.toml") if path.stem not in names)
        preserved: list[Path] = []
        for path in (*claude, *codex):
            if path.name.startswith(SHIPPED_PREFIX):
                continue
            try:
                if self.copy(path):
                    preserved.append(path)
            except (Refusal, ValueError, tomllib.TOMLDecodeError) as error:
                preserved.append(path)
                self.system_log.write(LogLevel.WARNING, f"Cannot copy profile {path.name}: {error}")
        paired = [self.files.folder(CODEX_FOLDER) / f"{path.stem}.toml" for path in preserved if path.suffix == ".md"]
        return (*preserved, *(path for path in paired if path.is_file()))

    def is_published(self, path: Path, text: str) -> bool:
        registered = self.files.registered(path.stem)
        if registered is None:
            return False
        default = self.files.defaults(registered)
        published = self.files.codex_text(default) if path.suffix == ".toml" else self.files.claude_text(default)
        return text == published

    def copy(self, path: Path) -> bool:
        text = FileAccess.shared().read(path)
        digest = self.digest.hex_digest(text)
        target = self.files.path(path.stem)
        if target.is_file():
            return self.copy_existing(path, target, text, digest)
        if self.is_published(path, text):
            return False
        registered = self.files.registered(path.stem)
        native = self.native_fields(path, text)
        profile = self.files.checked_type(self.files.profile(path, native))
        fields = self.personal_fields(profile, native)
        if registered is not None:
            registered = self.files.checked_type(registered)
            fields = {name: value for name, value in fields.items() if name == "legacy_writing" or (name in ProfileFields.__annotations__ and hasattr(registered, name) and value != getattr(registered, name))}
            fields.pop("agent_type", None)
            fields.update(module=registered.module, module_text=self.digest.hex_digest(registered.body))
        fields.update(name=path.stem, source_digest=digest)
        self.files.save_fields(path.stem, fields)
        if "legacy_writing" in fields:
            self.system_log.write(LogLevel.WARNING, f"Copied profile {path.stem}: Could write before; access is read-only")
        return True

    def copy_existing(self, source: Path, target: Path, text: str, digest: str) -> bool:
        fields = self.files.fields(target)
        if fields.get("source_digest") == digest:
            return True
        if "source_digest" not in fields and self.is_published(source, text):
            return False
        changed_file = target.with_name(f"{source.stem}.clash.md")
        if changed_file.is_file() and FileAccess.shared().read(changed_file) == text:
            return True
        FileAccess.shared().write(changed_file, text)
        return True

    @staticmethod
    def personal_fields(profile: AgentProfile, fields: ProfileFields) -> dict[str, object]:
        values: dict[str, object] = {name: getattr(profile, name) for name in ("description", "body", "agent_type", "access", "program", "preferred_program", "model", "codex_model", "independent", "mcp_tools")}
        if fields.get("legacy_writing") == "true":
            values["legacy_writing"] = "true"
        return values

    @staticmethod
    def native_fields(path: Path, text: str) -> ProfileFields:
        if path.suffix == ".toml":
            native = tomllib.loads(text)
            codex_model = str(native.get("model", ""))
            fields = ProfileFields(name=path.stem, description=str(native.get("description", "")), body=str(native.get("developer_instructions", "")),
                                   agent_type=str(native.get("type", native.get("kind", "helper"))), model="", codex_model="" if codex_model == "inherit" else codex_model,
                                   independent=bool(native.get("independent", False)), mcp_tools=ProfileFormat.tools(native.get("mcp_tools", [])))
            if native.get("sandbox_mode") == "workspace-write":
                fields.update(access=Access.READ, legacy_writing="true")
            return ProfileFolderMove.complete_fields(fields)
        return ProfileFolderMove.complete_fields(ProfileFormat.fields(text))

    @staticmethod
    def complete_fields(fields: ProfileFields) -> ProfileFields:
        if fields.get("agent_type") == "subagent":
            fields["agent_type"] = "helper"
        fields.setdefault("agent_type", "helper")
        tools = ProfileFormat.tools(fields.get("tools", ""))
        fields["mcp_tools"] = tuple(dict.fromkeys((*fields.get("mcp_tools", ()), *(tool for tool in tools if tool.startswith("mcp__")))))
        if any(tool in ("Edit", "Write", "MultiEdit") for tool in tools):
            fields.update(access=Access.READ, legacy_writing="true")
        return fields
