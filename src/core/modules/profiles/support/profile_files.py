import json
from dataclasses import replace
from pathlib import Path

from core.base.access import Access
from core.base.file_access import FileAccess
from core.base.kept_file_text import KeptFileText
from core.base.journal_home import JournalHome
from core.base.profile.agent_profile import AgentProfile
from core.base.profile.profile_name import PROFILE_NAME
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.text_digest import TextDigest
from core.modules.profiles.support.profile_format import ProfileFormat
from core.modules.profiles.support.profile_fields import ProfileFields
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.base.provider.providers import Providers
from core.modules.settings.bindings.support.setting_values import SettingValues

CLAUDE_FOLDER, CODEX_FOLDER = ".claude/agents", ".codex/agents"
CODEX_HOME = ".codex"
PROFILE_FOLDER = ".agents/profiles"
SHIPPED_PREFIX = "journal-"
OVERLAID_FIELDS = ("title", "description", "body", "access", "program", "program_if_possible", "model", "codex_model", "program_models", "tier", "mcp_tools", "independent")


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
        return tuple(entry.key for entry in self.registry.agent_type_book().startable())

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
            if "agent_type" in fields:
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
        types = self.registry.agent_type_book()
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
        fields = ProfileFormat.fields(self.kept.read(path))
        if path.parent == self.folder(PROFILE_FOLDER) and "agent_type" not in fields and "body" in fields and "module_text" not in fields:
            raise Refusal("a change file with instructions needs module-text")
        return fields

    def read(self, path: Path) -> AgentProfile:
        return self.profile(path, self.fields(path))

    def profile(self, path: Path, fields: ProfileFields) -> AgentProfile:
        values = {name: fields[name] for name in OVERLAID_FIELDS if name in fields}
        notes = self.notes(path, fields)
        return AgentProfile(path.stem, values.pop("description", ""), values.pop("body", ""),
                            agent_type=fields.get("agent_type", "helper"), path=str(path.relative_to(self.home.project_folder)), notes=notes, source_digest=fields.get("source_digest", ""), **values)

    def notes(self, path: Path, fields: ProfileFields) -> tuple[str, ...]:
        notes: list[str] = []
        if fields.get("legacy_writing") == "true" or fields.get("legacy_writing") is True:
            notes.append("Could write before")
        if path.with_name(f"{path.stem}.clash.md").is_file():
            notes.append(f"Changed original kept in {path.stem}.clash.md")
        return tuple(notes)

    def overlaid(self, registered: AgentProfile, path: Path) -> AgentProfile:
        return self.overlaid_fields(registered, path, self.fields(path))

    def overlaid_fields(self, registered: AgentProfile, path: Path, fields: ProfileFields) -> AgentProfile:
        changed = tuple(name for name in OVERLAID_FIELDS if name in fields)
        text_changed = "body" in changed and fields.get("module_text") != self.digest.hex_digest(registered.body)
        return replace(registered, **{name: fields[name] for name in changed}, changed=changed, module_text_changed=text_changed, module_body=registered.body,
                       path=str(path.relative_to(self.home.project_folder)), notes=self.notes(path, fields), source_digest=fields.get("source_digest", ""))

    def save(self, profile: AgentProfile) -> AgentProfile:
        fields = {name: getattr(profile, name) for name in OVERLAID_FIELDS}
        fields.update(name=profile.name, agent_type=profile.agent_type)
        if profile.source_digest:
            fields["source_digest"] = profile.source_digest
        if "Could write before" in profile.notes:
            fields["legacy_writing"] = "true"
        self.save_fields(profile.name, fields)
        return self.row(profile.name)

    def save_changes(self, registered: AgentProfile, profile: AgentProfile) -> AgentProfile:
        registered = self.checked_type(registered)
        fields = {name: getattr(profile, name) for name in OVERLAID_FIELDS if getattr(profile, name) != getattr(registered, name)}
        fields.update(name=profile.name, **{"module_text": self.digest.hex_digest(registered.body), "module": registered.module})
        if profile.source_digest:
            fields["source_digest"] = profile.source_digest
        if "Could write before" in profile.notes:
            fields["legacy_writing"] = "true"
        self.save_fields(profile.name, fields)
        return self.row(profile.name)

    def save_fields(self, name: str, fields: ProfileFields) -> None:
        path = self.path(name)
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, ProfileFormat.text(fields))

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
        access = profile.access if profile.access is not None else self.registry.agent_type_book().find(profile.agent_type).access
        sandbox = "read-only" if access is Access.READ else "workspace-write"
        model = f"model = {json.dumps(profile.codex_model)}\n" if profile.codex_model else ""
        return (f"name = {json.dumps(profile.name)}\ndescription = {json.dumps(profile.description, ensure_ascii=False)}\n{model}"
                f"sandbox_mode = \"{sandbox}\"\ndeveloper_instructions = {json.dumps(profile.body, ensure_ascii=False)}\n")
