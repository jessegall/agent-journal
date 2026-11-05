from core.base.file_access import FileAccess
import json
from dataclasses import replace
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.profile.agent_profile import SUBAGENT, AgentProfile
from core.modules.profiles.support.profile_settings import CLAUDE_MODEL_SETTING, CODEX_MODEL_SETTING
from core.base.registry.registry import Registry
from core.modules.settings.bindings.support.setting_values import SettingValues

CLAUDE_FOLDER, CODEX_FOLDER = ".claude/agents", ".codex/agents"
CODEX_HOME = ".codex"
SHIPPED_PREFIX = "journal-"
FRONT_MATTER_START, FRONT_MATTER_END = "---\n", "\n---\n"


class ProfileFiles:
    """The profile files of the agent programs in the project: a markdown file for Claude Code always, a
    toml file for Codex where it has a folder. Each start writes the journal's own again; a person's
    profile stays."""

    def __init__(self, home: JournalHome, settings: SettingValues, registry: Registry) -> None:
        self.home, self.settings, self.registry = home, settings, registry

    @property
    def suite_profiles(self) -> tuple[AgentProfile, ...]:
        return tuple(profile for suite in self.registry.suites for profile in suite.profiles)

    @property
    def profile_types(self) -> tuple[str, ...]:
        return tuple(dict.fromkeys((SUBAGENT, *(profile_type for suite in self.registry.suites for profile_type in suite.profile_types))))

    def listed(self) -> list[AgentProfile]:
        return [self.read(path) for path in sorted(self.folder(CLAUDE_FOLDER).glob("*.md"))]

    def has(self, name: str) -> bool:
        return (self.folder(CLAUDE_FOLDER) / f"{name}.md").is_file()

    def publish(self) -> None:
        for folder in (self.folder(CLAUDE_FOLDER), self.folder(CODEX_FOLDER)):
            for path in (*folder.glob(f"{SHIPPED_PREFIX}*.md"), *folder.glob(f"{SHIPPED_PREFIX}*.toml")):
                path.unlink()
        claude_model = self.settings.text(CLAUDE_MODEL_SETTING, None)
        codex_model = self.settings.text(CODEX_MODEL_SETTING, None)
        for profile in self.suite_profiles:
            self.save(replace(profile, model=profile.model or claude_model, codex_model=profile.codex_model or codex_model))

    def save(self, profile: AgentProfile) -> AgentProfile:
        path = self.folder(CLAUDE_FOLDER) / f"{profile.name}.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, self.claude_text(profile))
        if (self.home.project_folder / CODEX_HOME).is_dir():
            codex_path = self.folder(CODEX_FOLDER) / f"{profile.name}.toml"
            codex_path.parent.mkdir(parents=True, exist_ok=True)
            FileAccess.shared().write(codex_path, self.codex_text(profile))
        return self.read(path)

    def folder(self, program_folder: str) -> Path:
        return self.home.project_folder / program_folder

    def read(self, path: Path) -> AgentProfile:
        text = FileAccess.shared().read(path)
        head, _, body = text.partition(FRONT_MATTER_END) if text.startswith(FRONT_MATTER_START) else ("", "", text)
        fields = {key.strip(): value.strip() for key, value in (line.partition(":")[::2] for line in head.splitlines()[1:] if ":" in line)}
        return AgentProfile(path.stem, fields.get("description", ""), fields.get("tools", ""), body.strip("\n"), fields.get("kind", SUBAGENT), fields.get("model", ""), fields.get("codex-model", ""),
                            shipped=path.stem in {profile.name for profile in self.suite_profiles}, path=str(path.relative_to(self.home.project_folder)))

    @staticmethod
    def claude_text(profile: AgentProfile) -> str:
        models = "".join(f"{key}: {value}\n" for key, value in (("model", profile.model), ("codex-model", profile.codex_model)) if value)
        return f"---\nname: {profile.name}\ndescription: {profile.description}\ntools: {profile.tools}\nkind: {profile.profile_type}\n{models}---\n\n{profile.body}\n"

    @staticmethod
    def codex_text(profile: AgentProfile) -> str:
        sandbox = "read-only" if profile.profile_type == SUBAGENT else "workspace-write"
        model = f"model = {json.dumps(profile.codex_model)}\n" if profile.codex_model else ""
        return (f"name = {json.dumps(profile.name)}\ndescription = {json.dumps(profile.description, ensure_ascii=False)}\n{model}"
                f"sandbox_mode = \"{sandbox}\"\ndeveloper_instructions = {json.dumps(profile.body, ensure_ascii=False)}\n")
