from pathlib import Path

from journal.config import Config
from journal.features.profiles.profile import Profile
from journal.features.profiles.profile_shown import ProfileShown
from journal.providers.providers import Providers
from journal.repositories.settings import Settings



class ProfileFiles:
    """Writes the researcher, the planner and the debugger for every provider that has a folder here, Claude always."""

    PROFILES = (
        Profile("researcher", "Researches a question in the code, the journal's record or on the web and reports what it found, with evidence. Read-only.", "Read, Grep, Glob, WebFetch, WebSearch",
                "You research one question. Find what already answers it before you look further: the code, the journal's record (journal commands that list and show are reads you may run) and, when the question is about something outside the project, the web. Separate what you found from what you infer."),
        Profile("planner", "Designs how to build a change: the files to touch, what already does part of it, the order of the steps and the risks. Read-only.", "Read, Grep, Glob",
                "You plan one change. Find what in the code already does the job or most of it, and plan to extend that rather than write a second way. Name every file to touch and why, the order of the steps, the tests that prove each, and what could go wrong."),
        Profile("debugger", "Traces a fault to where it starts and says the fix that belongs there. Read-only.", "Read, Grep, Glob",
                "You debug one fault. Start from what was observed, then walk back through the code to where the bad value, missing check or wrong shape is born, and name the fix there, never where the fault only shows. Say how to reproduce it and which test would prove the fix."),
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
        fields = dict(line.partition(":")[::2] for line in head.splitlines()[1:] if ":" in line)
        return ProfileShown(name=name, description=fields.get("description", "").strip(), tools=fields.get("tools", "").strip(), model=fields.get("model", "").strip(),
                            body=body.strip("\n"), shipped=name in {profile.name for profile in self.PROFILES}, path=str(path.relative_to(self.config.root)))

    def save(self, name: str, description: str, tools: str, model: str, body: str) -> ProfileShown:
        """A profile written as Claude reads it: the front matter, then the instructions."""
        path = self.folder() / f"{name}.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(f"---\nname: {name}\ndescription: {description}\ntools: {tools}\nmodel: {model}\n---\n\n{body}\n")
        return self.read(name)

    def write_all(self) -> list[Path]:
        written = []
        for provider in self.providers.all():
            if provider.name != "claude" and not (self.config.root / provider.home).is_dir():
                continue
            from journal.features.profiles.feature import Profiles
            model = str(self.settings.option(Profiles.CLAUDE_MODEL if provider.name == "claude" else Profiles.CODEX_MODEL))
            for profile in self.PROFILES:
                path = self.config.root / provider.home / "agents" / (f"{profile.name}.md" if provider.name == "claude" else f"{profile.name}.toml")
                text = profile.claude_text(model) if provider.name == "claude" else profile.codex_text(model)
                path.parent.mkdir(parents=True, exist_ok=True)
                if not path.is_file() or path.read_text() != text:
                    path.write_text(text)
                written.append(path)
        return written
