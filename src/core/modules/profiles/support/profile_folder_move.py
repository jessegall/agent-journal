import errno
import tomllib
from engine.enums.occupant import INDEPENDENT_OCCUPANTS
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.enums.log_level import LogLevel
from engine.errors.refusal import Refusal
from engine.log.system_log_writer import SystemLogWriter
from engine.text.text_digest import TextDigest
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_files import CLAUDE_FOLDER, CODEX_FOLDER, SHIPPED_PREFIX, ProfileFiles
from core.modules.profiles.support.profile_format import ProfileFormat


COPIED_FIELDS = ("description", "body", "access", "program", "preferred_program", "model", "codex_model", "occupant", "mcp_tools")


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
        profile = self.files.checked_type(native.copied(self.files.profile(path, native)))
        settings = {name: getattr(profile, name) for name in COPIED_FIELDS}
        fields = ProfileFields(settings, path.stem, profile.agent_type, source_digest=digest, could_write=native.could_write)
        if registered is not None:
            registered = self.files.checked_type(registered)
            fields = ProfileFields({name: value for name, value in settings.items() if value != getattr(registered, name)}, path.stem, module=registered.module,
                                   module_text=self.digest.hex_digest(registered.body), source_digest=digest, could_write=native.could_write)
        self.files.save_fields(fields)
        if fields.could_write:
            self.system_log.write(LogLevel.WARNING, f"Copied profile {path.stem}: Could write before; access is read-only")
        return True

    def copy_existing(self, source: Path, target: Path, text: str, digest: str) -> bool:
        fields = self.files.fields(target)
        if fields.source_digest == digest:
            return True
        if not fields.source_digest and self.is_published(source, text):
            return False
        changed_file = target.with_name(f"{source.stem}.clash.md")
        if changed_file.is_file() and FileAccess.shared().read(changed_file) == text:
            return True
        FileAccess.shared().write(changed_file, text)
        return True

    @staticmethod
    def native_fields(path: Path, text: str) -> ProfileFields:
        if path.suffix != ".toml":
            return ProfileFields.read(text).native
        native = tomllib.loads(text)
        codex_model = str(native.get("model", ""))
        writable = native.get("sandbox_mode") == "workspace-write"
        settings: dict[str, object] = {"description": str(native.get("description", "")), "body": str(native.get("developer_instructions", "")), "model": "",
                                       "codex_model": "" if codex_model == "inherit" else codex_model,
                                       "mcp_tools": ProfileFormat.tools(native.get("mcp_tools", [])), "occupant": INDEPENDENT_OCCUPANTS[native.get("independent", False) is True]}
        agent_type = ProfileFormat.agent_type(str(native.get("type", native.get("kind", "helper"))))
        return ProfileFields(settings, path.stem, agent_type, could_write=writable).native
