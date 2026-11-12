import json
from dataclasses import replace
from pathlib import Path

from engine.enums.access import Access
from engine.file.file_access import FileAccess
from engine.file.versions.kept_file_text import KeptFileText
from engine.journal.journal_home import JournalHome
from engine.profile.agent_profile import AgentProfile
from engine.profile.profile_name import PROFILE_NAME
from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
from engine.text.text_digest import TextDigest
from core.modules.profiles.support.profile_format import OVERLAID_FIELDS
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_problem import ProfileProblem
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues

CLAUDE_FOLDER, CODEX_FOLDER = ".claude/agents", ".codex/agents"
CODEX_HOME = ".codex"
PROFILE_FOLDER = ".agents/profiles"
SHIPPED_PREFIX = "journal-"
COULD_WRITE_NOTE = "Could write before"


class ProfileFiles:
    """Reads module profiles and personal files, preserving personal changes across module upgrades."""

    def __init__(self, home: JournalHome, settings: SettingValues, registry: Registry, digest: TextDigest, providers: Providers) -> None:
        self.home, self.settings, self.registry, self.digest = home, settings, registry, digest
        self.providers = providers
        self.kept = KeptFileText()

    @property
    def module_profiles(self) -> tuple[AgentProfile, ...]:
        return tuple(entry.profile for entry in self.registry.profiles)

    @property
    def profile_types(self) -> tuple[str, ...]:
        return tuple(entry.key for entry in self.registry.helper_type_book().startable())

    def path(self, name: str) -> Path:
        if not PROFILE_NAME.fullmatch(name):
            raise Refusal(f"{name} cannot name a profile", "use letters, digits, dashes and underscores")
        return self.folder(PROFILE_FOLDER) / f"{name}.md"

    def registered(self, name: str) -> AgentProfile | None:
        return next((profile for profile in self.module_profiles if profile.name == name), None)

    def has(self, name: str) -> bool:
        return bool(PROFILE_NAME.fullmatch(name)) and (self.registered(name) is not None or self.path(name).is_file())

    def listed(self) -> list[AgentProfile | ProfileProblem]:
        names = {profile.name for profile in self.module_profiles}
        names.update(path.stem for path in self.folder(PROFILE_FOLDER).glob("*.md") if not path.name.endswith(".clash.md"))
        return [self.listed_row(name) for name in sorted(names)]

    def listed_row(self, name: str) -> AgentProfile | ProfileProblem:
        profile = self.row(name)
        return self.defaults(profile) if isinstance(profile, AgentProfile) else profile

    def effective(self, name: str) -> AgentProfile:
        profile = self.row(name)
        if isinstance(profile, ProfileProblem) or profile.problem:
            raise Refusal(profile.problem, f"journal profile reset {name} restores its module version; fix or remove an own profile")
        return self.defaults(profile)

    def row(self, name: str) -> AgentProfile | ProfileProblem:
        registered = self.registered(name)
        path = self.path(name)
        if not path.is_file():
            if registered is None:
                raise Refusal(f"no profile is named {name}", "run journal profile list to see the available profiles")
            return self.checked_type(registered)
        try:
            fields = self.fields(path)
            if fields.agent_type:
                profile = self.profile(path, fields)
                if registered is not None:
                    profile = replace(profile, problem="Name taken by a module")
            elif registered is not None:
                profile = self.overlaid_fields(registered, path, fields)
            else:
                return ProfileProblem(name, str(path.relative_to(self.home.project_folder)), "Its module no longer offers this profile")
            return self.checked_type(profile)
        except (Refusal, OSError, ValueError, TypeError) as error:
            return ProfileProblem(name, str(path.relative_to(self.home.project_folder)), f"Unreadable: {error}")

    def checked_type(self, profile: AgentProfile) -> AgentProfile:
        types = self.registry.helper_type_book()
        if profile.agent_type not in self.profile_types:
            return replace(profile, problem=profile.problem or f"Type: gone — {profile.agent_type} is not registered")
        access = profile.access if profile.access is not None else types.find(profile.agent_type).access
        if access is Access.WRITING and types.find(profile.agent_type).access is not Access.WRITING:
            return replace(profile, access=access, problem=profile.problem or f"a {types.find(profile.agent_type).label} only reads")
        return replace(profile, access=access)

    def defaults(self, profile: AgentProfile) -> AgentProfile:
        if profile.tier is not None:
            return profile
        for provider in self.providers.all():
            model = provider.profile_model(profile)
            if not model and provider.profile_model_setting:
                model = self.settings.project.text(provider.profile_model_setting)
            profile = provider.with_profile_model(profile, model)
        return profile

    def fields(self, path: Path) -> ProfileFields:
        fields = ProfileFields.read(self.kept.read(path))
        if path.parent == self.folder(PROFILE_FOLDER) and not fields.agent_type and fields.changes_instructions and not fields.module_text:
            raise Refusal("a change file with instructions needs module-text")
        return fields

    def read(self, path: Path) -> AgentProfile:
        return self.profile(path, self.fields(path))

    def profile(self, path: Path, fields: ProfileFields) -> AgentProfile:
        profile = AgentProfile(path.stem, agent_type=fields.agent_type, path=str(path.relative_to(self.home.project_folder)),
                               notes=self.notes(path, fields), source_digest=fields.source_digest)
        return replace(profile, **fields.settings)

    def notes(self, path: Path, fields: ProfileFields) -> tuple[str, ...]:
        notes: list[str] = []
        if fields.could_write:
            notes.append(COULD_WRITE_NOTE)
        if path.with_name(f"{path.stem}.clash.md").is_file():
            notes.append(f"Changed original kept in {path.stem}.clash.md")
        return tuple(notes)

    def overlaid(self, registered: AgentProfile, path: Path) -> AgentProfile:
        return self.overlaid_fields(registered, path, self.fields(path))

    def overlaid_fields(self, registered: AgentProfile, path: Path, fields: ProfileFields) -> AgentProfile:
        text_changed = fields.changes_instructions and fields.module_text != self.digest.hex_digest(registered.body)
        return replace(registered, **fields.settings, changed=tuple(fields.settings), module_text_changed=text_changed, module_body=registered.body,
                       path=str(path.relative_to(self.home.project_folder)), notes=self.notes(path, fields), source_digest=fields.source_digest)

    def save(self, profile: AgentProfile) -> AgentProfile:
        settings = {name: getattr(profile, name) for name in OVERLAID_FIELDS}
        self.save_fields(ProfileFields(settings, profile.name, profile.agent_type, source_digest=profile.source_digest, could_write=COULD_WRITE_NOTE in profile.notes))
        return self.stored(profile.name)

    def save_changes(self, registered: AgentProfile, profile: AgentProfile) -> AgentProfile:
        registered = self.checked_type(registered)
        settings = {name: getattr(profile, name) for name in OVERLAID_FIELDS if getattr(profile, name) != getattr(registered, name)}
        self.save_fields(ProfileFields(settings, profile.name, module=registered.module, module_text=self.digest.hex_digest(registered.body),
                                                     source_digest=profile.source_digest, could_write=COULD_WRITE_NOTE in profile.notes))
        return self.stored(profile.name)

    def stored(self, name: str) -> AgentProfile:
        profile = self.row(name)
        if isinstance(profile, ProfileProblem):
            raise Refusal(profile.problem, f"fix or remove {profile.path}")
        return profile

    def save_fields(self, fields: ProfileFields) -> None:
        path = self.path(fields.name)
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, fields.text())

    def reset(self, name: str) -> None:
        self.path(name).unlink(missing_ok=True)

    def remove(self, name: str) -> None:
        if self.registered(name) is not None:
            raise Refusal(f"{name} comes with a module", f"journal profile reset {name} removes personal changes")
        self.path(name).unlink(missing_ok=True)

    def folder(self, program_folder: str) -> Path:
        return self.home.project_folder / program_folder

    def publish(self, preserved: tuple[Path, ...] = ()) -> None:
        for folder in (self.folder(CLAUDE_FOLDER), self.folder(CODEX_FOLDER)):
            for path in (*folder.glob(f"{SHIPPED_PREFIX}*.md"), *folder.glob(f"{SHIPPED_PREFIX}*.toml")):
                path.unlink()
        for profile in self.module_profiles:
            profile = self.defaults(profile)
            path = self.folder(CLAUDE_FOLDER) / f"{profile.name}.md"
            path.parent.mkdir(parents=True, exist_ok=True)
            if path not in preserved:
                FileAccess.shared().write(path, self.claude_text(profile))
            if (self.home.project_folder / CODEX_HOME).is_dir():
                path = self.folder(CODEX_FOLDER) / f"{profile.name}.toml"
                path.parent.mkdir(parents=True, exist_ok=True)
                if path not in preserved:
                    FileAccess.shared().write(path, self.codex_text(profile))

    @staticmethod
    def claude_text(profile: AgentProfile) -> str:
        models = "".join(f"{key}: {value}\n" for key, value in (("model", profile.model), ("codex-model", profile.codex_model)) if value)
        return f"---\nname: {profile.name}\ndescription: {profile.description}\nkind: {profile.agent_type}\n{models}---\n\n{profile.body}\n"

    def codex_text(self, profile: AgentProfile) -> str:
        access = profile.access if profile.access is not None else self.registry.helper_type_book().find(profile.agent_type).access
        sandbox = "read-only" if access is Access.READ else "workspace-write"
        model = f"model = {json.dumps(profile.codex_model)}\n" if profile.codex_model else ""
        return (f"name = {json.dumps(profile.name)}\ndescription = {json.dumps(profile.description, ensure_ascii=False)}\n{model}"
                f"sandbox_mode = \"{sandbox}\"\ndeveloper_instructions = {json.dumps(profile.body, ensure_ascii=False)}\n")
