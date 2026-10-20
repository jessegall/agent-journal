from pathlib import Path

from journal.config import Config
from journal.features.profiles.support.profile import Profile
from journal.features.profiles.support.profile_shown import ProfileShown
from journal.providers.providers import Providers
from journal.repositories.settings import Settings

PREFIX = "journal-"
"""Every profile the journal ships is named with it, so none is ever taken for a profile of the project's own."""
UNPREFIXED = ("researcher", "planner", "debugger", "senior", "medior")
"""The names the journal's profiles had before they were prefixed: a copy still the journal's own is removed."""
REPORTS = ("You only read: change no file, run no tests and write nothing to the journal; the agent that started you does the writing. "
           "Read narrowly: search for the line, read the range you need, never a whole large file. Answer in a short report written to "
           "the agent that started you, with the files and lines that show each point and what you could not check.")
"""What every shipped subagent is told about reading only and reporting back."""
WRITES = ("You write: change what the job needs and nothing beyond it. Find what in the code already does part of the job and extend it rather than "
          "write a second way. Write the test that proves your change and name it in your report; do not run the suite, the agent that sent you runs it. "
          "Commit nothing unless the brief says so. Report to the agent that sent you, never to the user: what you changed, file by file, with the lines "
          "that answer each point of the brief, and what you could not do.")
"""What every shipped worker is told about writing and reporting back."""


class ProfileFiles:
    """Writes the journal's own profiles, each named journal-*, and every profile saved, for every provider that has a folder here, Claude always; at every write the journal's are removed first and written fresh."""

    PROFILES = (
        Profile("journal-researcher", "Researches a question in the code, the journal's record or on the web and reports what it found, with evidence. Read-only.", "Read, Grep, Glob, WebFetch, WebSearch",
                f"You research one question. Find what already answers it before you look further: the code, the files the journal keeps in .journal and, when the question is about something outside the project, the web. Separate what you found from what you infer. {REPORTS}"),
        Profile("journal-planner", "Designs how to build a change: the files to touch, what already does part of it, the order of the steps and the risks. Read-only.", "Read, Grep, Glob",
                f"You plan one change. Find what in the code already does the job or most of it, and plan to extend that rather than write a second way. Name every file to touch and why, the order of the steps, the tests that prove each, and what could go wrong. {REPORTS}"),
        Profile("journal-debugger", "Traces a fault to where it starts and says the fix that belongs there. Read-only.", "Read, Grep, Glob",
                f"You debug one fault. Start from what was observed, then walk back through the code to where the bad value, missing check or wrong shape is born, and name the fix there, never where the fault only shows. Say how to reproduce it and which test would prove the fix. {REPORTS}"),
        Profile("journal-plan-reviewer", "Reviews a plan before it is approved: whether its phases and tasks reach its goal and nothing more, and what must change. Read-only.", "Read, Grep, Glob, Bash",
                f"You review one plan. Read its goal, its phases and its tasks with `journal plan show <n>`, and the code they would change. Say whether the plan reaches its goal and does nothing more, what is missing or wrong, and which task should change and how. {REPORTS}"),
        Profile("journal-senior", "A worker for a job that needs judgement: a design inside the code, a hard fault, a change across many files. Writes, on Opus.", "Read, Grep, Glob, Edit, Write, Bash",
                f"You are a senior worker on one bounded job that needs judgement. Weigh the ways to do it against the code as it is, choose the one that fits it, and say in your report why. {WRITES}", "worker", "opus"),
        Profile("journal-medior", "A worker for a job whose shape is settled: a change the brief spells out, tests to write, a rename. Writes, on Sonnet.", "Read, Grep, Glob, Edit, Write, Bash",
                f"You are a medium worker on one bounded job whose shape the brief settles. Do what it says and no more; where it leaves a choice open, take the plainest one and name it in your report. {WRITES}", "worker", "sonnet"),
    )

    def __init__(self, config: Config, providers: Providers, settings: Settings) -> None:
        self.config, self.providers, self.settings = config, providers, settings

    def folder(self) -> Path:
        return self.config.root / self.providers.named("claude").home / "agents"

    def read_all(self) -> list[ProfileShown]:
        """Every profile in Claude's agents folder, by name, each with its front matter and its instructions, and whether the journal ships it."""
        return sorted((self.read(path.stem) for path in self.folder().glob("*.md")), key=lambda p: p["name"])

    def names(self) -> list[str]:
        """The profiles in Claude's agents folder, by name, without reading them."""
        return sorted(path.stem for path in self.folder().glob("*.md"))

    def subagents(self) -> list[str]:
        """The profiles in Claude's agents folder a subagent may be dispatched as, by name: every one but the workers'."""
        return [p["name"] for p in self.read_all() if p["kind"] != "worker"]

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
        """Every profile of the journal's removed, then the newest written: one it no longer ships never lingers, and none is left as an old version."""
        from journal.features.profiles.feature import Profiles
        self.clear()
        model, codex_model = str(self.settings.option(Profiles.CLAUDE_MODEL)), str(self.settings.option(Profiles.CODEX_MODEL))
        return [path for profile in self.PROFILES for path in self.write(profile, profile.model_or(model), codex_model)]

    def clear(self) -> None:
        """The journal's profiles taken out of every agents folder: each journal-* one, and an unprefixed copy of an old name still as the journal wrote it."""
        bodies = [profile.body for profile in self.PROFILES]
        for folder in self.agent_folders():
            for path in [*folder.glob(f"{PREFIX}*.md"), *folder.glob(f"{PREFIX}*.toml")]:
                path.unlink()
            for path in [p for name in UNPREFIXED for p in (folder / f"{name}.md", folder / f"{name}.toml") if p.is_file()]:
                if any(body in path.read_text() for body in bodies):
                    path.unlink()

    def agent_folders(self) -> list[Path]:
        return [folder for folder in (self.config.root / provider.home / "agents" for provider in self.providers.all()) if folder.is_dir()]

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
