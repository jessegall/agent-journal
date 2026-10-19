from pathlib import Path

from journal.config import Config
from journal.features.profiles.support.profile import Profile
from journal.features.profiles.support.profile_shown import ProfileShown
from journal.providers.providers import Providers
from journal.repositories.settings import Settings

REPORTS = ("You only read: change no file, run no tests and write nothing to the journal; the agent that started you does the writing. "
           "Read narrowly: search for the line, read the range you need, never a whole large file. Answer in a short report written to "
           "the agent that started you, with the files and lines that show each point and what you could not check.")
"""What every shipped subagent is told about reading only and reporting back."""


class ProfileFiles:
    """Writes the researcher, the planner and the debugger, and every profile saved, for every provider that has a folder here, Claude always."""

    PROFILES = (
        Profile("researcher", "Researches a question in the code, the journal's record or on the web and reports what it found, with evidence. Read-only.", "Read, Grep, Glob, WebFetch, WebSearch",
                f"You research one question. Find what already answers it before you look further: the code, the files the journal keeps in .journal and, when the question is about something outside the project, the web. Separate what you found from what you infer. {REPORTS}"),
        Profile("planner", "Designs how to build a change: the files to touch, what already does part of it, the order of the steps and the risks. Read-only.", "Read, Grep, Glob",
                f"You plan one change. Find what in the code already does the job or most of it, and plan to extend that rather than write a second way. Name every file to touch and why, the order of the steps, the tests that prove each, and what could go wrong. {REPORTS}"),
        Profile("debugger", "Traces a fault to where it starts and says the fix that belongs there. Read-only.", "Read, Grep, Glob",
                f"You debug one fault. Start from what was observed, then walk back through the code to where the bad value, missing check or wrong shape is born, and name the fix there, never where the fault only shows. Say how to reproduce it and which test would prove the fix. {REPORTS}"),
    )

    def __init__(self, config: Config, providers: Providers, settings: Settings) -> None:
        self.config, self.providers, self.settings = config, providers, settings

    def folder(self) -> Path:
        return self.config.root / self.providers.named("claude").home / "agents"

    def read_all(self) -> list[ProfileShown]:
        """Every profile in Claude's agents folder, by name, each with its front matter and its instructions, and whether the journal ships it."""
        return sorted((self.read(path.stem) for path in self.folder().glob("*.md")), key=lambda p: p["name"])

    def read(self, name: str) -> ProfileShown:
        path = self.folder() / f"{name}.md"
        text = path.read_text()
        head, _, body = text.partition("\n---\n") if text.startswith("---\n") else ("", "", text)
        fields = {key.strip(): value.strip() for key, value in (line.partition(":")[::2] for line in head.splitlines()[1:] if ":" in line)}
        return ProfileShown(name=name, description=fields.get("description", ""), tools=fields.get("tools", ""), kind=fields.get("kind", "subagent"), model=fields.get("model", ""),
                            codex_model=fields.get("codex-model", ""), body=body.strip("\n"), shipped=name in {profile.name for profile in self.PROFILES}, path=str(path.relative_to(self.config.root)))

    def kind_of(self, name: str) -> str:
        """Whether the profile of this name is a worker or a subagent; empty when there is none."""
        return self.read(name)["kind"] if (self.folder() / f"{name}.md").is_file() else ""

    def save(self, profile: Profile, model: str, codex_model: str) -> ProfileShown:
        self.write(profile, model, codex_model)
        return self.read(profile.name)

    def write_all(self) -> list[Path]:
        from journal.features.profiles.feature import Profiles
        model, codex_model = str(self.settings.option(Profiles.CLAUDE_MODEL)), str(self.settings.option(Profiles.CODEX_MODEL))
        return [path for profile in self.PROFILES for path in self.write(profile, model, codex_model)]

    def write(self, profile: Profile, model: str, codex_model: str) -> list[Path]:
        """The profile in Claude's agents folder and, where Codex has a folder here, in Codex's, each on its own model."""
        texts = {"claude": (f"{profile.name}.md", profile.claude_text(model, codex_model)), "codex": (f"{profile.name}.toml", profile.codex_text(codex_model))}
        written = []
        for provider in self.providers.all():
            if provider.name != "claude" and not (self.config.root / provider.home).is_dir():
                continue
            file, text = texts[provider.name]
            path = self.config.root / provider.home / "agents" / file
            path.parent.mkdir(parents=True, exist_ok=True)
            if not path.is_file() or path.read_text() != text:
                path.write_text(text)
            written.append(path)
        return written
