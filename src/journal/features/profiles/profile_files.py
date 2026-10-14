from pathlib import Path

from journal.config import Config
from journal.features.profiles.profile import Profile
from journal.providers.providers import Providers
from journal.repositories.settings import PROJECT, Settings

MODELS = {"claude": "sonnet", "codex": "gpt-6-sol"}


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

    def write_all(self) -> list[Path]:
        written = []
        for provider in self.providers.all():
            if provider.name != "claude" and not (self.config.root / provider.home).is_dir():
                continue
            model = str(self.settings.get(PROJECT, f"profiles.model.{provider.name}", MODELS[provider.name]))
            for profile in self.PROFILES:
                path = self.config.root / provider.home / "agents" / (f"{profile.name}.md" if provider.name == "claude" else f"{profile.name}.toml")
                text = profile.claude_text(model) if provider.name == "claude" else profile.codex_text(model)
                path.parent.mkdir(parents=True, exist_ok=True)
                if not path.is_file() or path.read_text() != text:
                    path.write_text(text)
                written.append(path)
        return written
