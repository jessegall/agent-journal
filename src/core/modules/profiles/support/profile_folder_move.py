import errno
import logging
import tomllib
from pathlib import Path

from core.base.access import Access
from core.base.file_access import FileAccess
from core.base.refusal import Refusal
from core.base.text_digest import TextDigest
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_files import CLAUDE_FOLDER, CODEX_FOLDER, SHIPPED_PREFIX, ProfileFiles
from core.modules.profiles.support.profile_format import ProfileFormat


class ProfileFolderMove:
    """Copies native profiles once and keeps later source changes beside the personal copy."""

    def __init__(self, files: ProfileFiles, digest: TextDigest) -> None:
        self.files, self.digest = files, digest

    def publish(self) -> None:
        try:
            self.run()
            self.files.publish()
        except OSError as error:
            if not isinstance(error, PermissionError) and error.errno not in (errno.EROFS, errno.EACCES, errno.EPERM):
                raise
            logging.getLogger(__name__).warning("Profiles left unchanged: the profile folder is read-only (%s)", error)

    def run(self) -> None:
        claude = tuple(self.files.folder(CLAUDE_FOLDER).glob("*.md"))
        names = {path.stem for path in claude}
        codex = tuple(path for path in self.files.folder(CODEX_FOLDER).glob("*.toml") if path.stem not in names)
        for path in (*claude, *codex):
            if path.name.startswith(SHIPPED_PREFIX):
                continue
            try:
                self.copy(path)
            except (Refusal, ValueError, tomllib.TOMLDecodeError) as error:
                logging.getLogger(__name__).warning("Cannot copy profile %s: %s", path.name, error)

    def copy(self, path: Path) -> None:
        text = FileAccess.shared().read(path)
        digest = self.digest.hex_digest(text)
        target = self.files.path(path.stem)
        if target.is_file():
            self.copy_existing(path, target, text, digest)
            return
        registered = self.files.registered(path.stem)
        if registered is not None:
            default = self.files.defaults(registered)
            published = self.files.codex_text(default) if path.suffix == ".toml" else self.files.claude_text(default)
            if text == published:
                return
        fields = self.native_fields(path, text)
        profile = self.files.checked_type(self.files.profile(path, fields))
        fields = self.personal_fields(profile, fields)
        if registered is not None:
            registered = self.files.checked_type(registered)
            fields = {name: value for name, value in fields.items() if name == "legacy_writing" or (name in ProfileFields.__annotations__ and hasattr(registered, name) and value != getattr(registered, name))}
            fields.pop("agent_type", None)
            fields.update(module=registered.module, module_text=self.digest.hex_digest(registered.body))
        fields.update(name=path.stem, source_digest=digest)
        self.files.save_fields(path.stem, fields)
        if "legacy_writing" in fields:
            logging.getLogger(__name__).warning("Copied profile %s: Could write before; access is read-only", path.stem)

    def copy_existing(self, source: Path, target: Path, text: str, digest: str) -> None:
        fields = self.files.fields(target)
        if fields.get("source_digest") == digest:
            return
        changed_file = target.with_name(f"{source.stem}.clash.md")
        if changed_file.is_file() and FileAccess.shared().read(changed_file) == text:
            return
        FileAccess.shared().write(changed_file, text)

    @staticmethod
    def personal_fields(profile, fields: ProfileFields) -> ProfileFields:
        values: ProfileFields = {name: getattr(profile, name) for name in ("description", "body", "agent_type", "access", "program", "model", "codex_model", "independent", "mcp_tools")}
        if fields.get("legacy_writing") == "true":
            values["legacy_writing"] = "true"
        return values

    @staticmethod
    def native_fields(path: Path, text: str) -> ProfileFields:
        if path.suffix == ".toml":
            native = tomllib.loads(text)
            fields = ProfileFields(name=path.stem, description=str(native.get("description", "")), body=str(native.get("developer_instructions", "")),
                                   agent_type=str(native.get("type", native.get("kind", "helper"))), model="", codex_model=str(native.get("model", "")))
            if fields["codex_model"] == "inherit":
                fields["codex_model"] = ""
            if native.get("sandbox_mode") == "workspace-write":
                fields.update(access=Access.READ, legacy_writing="true")
            return fields
        fields = ProfileFormat.fields(text)
        fields.setdefault("agent_type", "helper")
        tools = ProfileFormat.tools(fields.get("tools", ""))
        fields["mcp_tools"] = tuple(dict.fromkeys((*fields.get("mcp_tools", ()), *(tool for tool in tools if tool.startswith("mcp__")))))
        if any(tool in ("Edit", "Write", "MultiEdit") for tool in tools):
            fields.update(access=Access.READ, legacy_writing="true")
        return fields
