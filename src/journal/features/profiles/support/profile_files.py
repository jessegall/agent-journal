from pathlib import Path

from journal.providers.support.profile_type import ProfileType
from journal.config import Config
from journal.providers.support.profile import Profile
from journal.providers.support.profile_view import ProfileView
from journal.providers.providers import Providers
from journal.repositories.setting_rows import SettingRows
from journal.features.profiles.profiles_options import ProfilesOptions
from journal.features.workers.workers_options import WorkersOptions

PREFIX = "journal-"
UNPREFIXED = ("researcher", "planner", "debugger", "senior", "medior")
REPORTS = ("You only read: change no file, run no tests and write nothing to the journal; the agent that started you does the writing. "
           "Read narrowly: search for the line, read the range you need, never a whole large file. Answer in a short report written to "
           "the agent that started you, with the files and lines that show each point and what you could not check.")
TURN = ("You work the one task the agent that sent you assigned to you, whose brief follows. Clock in with journal clock-in once you have read it; "
         "it starts the task and names its number. Maintain your own to-do list with journal todo add, check and list. Prove each point of the brief with "
         "journal proof <point> \"<file:line, and the test that shows it>\", or say why it is not done with journal proof <point> --not-done \"<why>\". "
         "Commit your work, then clock out with journal clock-out \"<what you changed, file by file, and what you could not do>\": that is your one report, "
         "to the agent that sent you, never to the user.")
WRITES = ("You write: change what the job needs and nothing beyond it. Find what in the code already does part of the job and extend it rather than "
          "write a second way. Write the test that proves your change and name it in a proof. " + TURN)
JOURNAL_TESTING_INSTRUCTION = "Never run a test or the suite yourself: to check one test while you work, queue it with journal tests turn <test file or test>, and the worktree's build with journal build; the journal runs each in your worktree, one run at a time. Every other command runs in your own shell, make ws, make env, docker and composer included, and a command the journal refuses names the line to run instead. Write the tests that prove each point, and clock out once your queue is done with journal clock-out \"<report>\" --tests \"<the arguments the project's test command takes to run them>\", naming the tests that cover the files you changed and the tests you wrote, never the whole suite. The journal runs them in your worktree; a failing run refuses the clock-out with its failing lines, so fix them and clock out again."
DOCUMENT_WRITER_RULES = ("You change no file and run no tests, and use Bash only for journal commands. Read narrowly: search for the line, read the range you need, "
                         "never a whole large file. Answer in a short report written to the agent that started you, with the files and lines that show each point "
                         "and what you could not check. When the job asks for a document, a report or a plan, file it yourself: journal doc create \"<title>\" "
                         "--abstract \"<one line>\" --body \"<markdown>\", journal report create with the same options, or journal plan create, phase, add and todos.")


class ProfileFiles:
    """Writes the journal's own profiles, each named journal-*, and every saved profile, for every provider that has a folder here, Claude always; at every write the journal's are removed first and written again."""

    PROFILES = (
        Profile("journal-researcher", "Researches a question in the code, the journal's record or on the web and reports what it found, with evidence. It reads, and files its findings as a document or report.", "Read, Grep, Glob, WebFetch, WebSearch, Bash",
                f"You research one question. Find what already answers it before you look further: the code, the files the journal stores in .journal and, when the question is about something outside the project, the web. Separate what you found from what you infer. {DOCUMENT_WRITER_RULES}"),
        Profile("journal-planner", "Designs how to build a change: the files to touch, what already does part of it, the order of the steps and the risks. It reads, and files its design as a document or a plan.", "Read, Grep, Glob, Bash",
                f"You plan one change. Find what in the code already does the job or most of it, and plan to extend that rather than write a second way. Name every file to touch and why, the order of the steps, the tests that prove each, and what could go wrong. {DOCUMENT_WRITER_RULES}"),
        Profile("journal-debugger", "Traces a fault to where it starts and states the fix that belongs there. Read-only.", "Read, Grep, Glob",
                f"You debug one fault. Start from what was observed, then walk back through the code to where the bad value, missing check or wrong shape originates, and name the fix there, never where the fault only shows. Say how to reproduce it and which test would prove the fix. {REPORTS}"),
        Profile("journal-plan-reviewer", "Reviews a plan before it is approved: whether its phases and tasks reach its goal and nothing more, and what must change. Read-only.", "Read, Grep, Glob, Bash",
                f"You review one plan. Read its goal, its phases and its tasks with `journal plan show <n>`, and the code they would change. Say whether the plan reaches its goal and does nothing more, what is missing or wrong, and which task should change and how. {REPORTS}"),
        Profile("journal-senior", "A worker for a job that needs judgement: a design inside the code, a hard fault, a change across many files. Writes, on Opus.", "Read, Grep, Glob, Edit, Write, Bash",
                f"You are a senior worker on one bounded job that needs judgement. Weigh the ways to do it against the code as it is, choose the one that fits it, and say in your report why. {WRITES}", "worker", "opus"),
        Profile("journal-medior", "A worker for a job whose shape is defined: a change the brief spells out, tests to write, a rename. Writes, on Sonnet.", "Read, Grep, Glob, Edit, Write, Bash",
                f"You are a medium worker on one bounded job whose shape the brief defines. Do what it says and no more; where it leaves a choice undecided, take the plainest one and name it in your report. {WRITES}", "worker", "sonnet"),
    )

    def __init__(self, config: Config, providers: Providers, settings: SettingRows) -> None:
        self.config, self.providers, self.settings = config, providers, settings

    def folder(self) -> Path:
        return self.config.root / self.providers.lookup("claude").home / "agents"

    def read_all(self) -> list[ProfileView]:
        return sorted((self.read(path.stem) for path in self.folder().glob("*.md")), key=lambda p: p["name"])

    def names(self) -> list[str]:
        return sorted(path.stem for path in self.folder().glob("*.md"))

    def subagents(self) -> list[str]:
        return [p["name"] for p in self.read_all() if p["profile_type"] != ProfileType.WORKER]

    def read(self, name: str) -> ProfileView:
        path = self.folder() / f"{name}.md"
        text = path.read_text()
        head, _, body = text.partition("\n---\n") if text.startswith("---\n") else ("", "", text)
        fields = {key.strip(): value.strip() for key, value in (line.partition(":")[::2] for line in head.splitlines()[1:] if ":" in line)}
        return ProfileView(name=name, description=fields.get("description", ""), tools=fields.get("tools", ""), profile_type=fields.get("kind", ProfileType.SUBAGENT), model=fields.get("model", ""),
                            codex_model=fields.get("codex-model", ""), body=body.strip("\n"), shipped=name in {profile.name for profile in self.PROFILES}, path=str(path.relative_to(self.config.root)))

    def worker_instructions(self, name: str) -> str:
        profile = self.read(name)
        body = profile["body"] if profile["shipped"] else f"{TURN}\n\n{profile['body']}"
        return f"{body}\n\n{JOURNAL_TESTING_INSTRUCTION}"

    def profile_type(self, name: str) -> str:
        return self.read(name)["profile_type"] if (self.folder() / f"{name}.md").is_file() else ""

    def save(self, profile: Profile, model: str, codex_model: str) -> ProfileView:
        self.write(profile, model, codex_model)
        return self.read(profile.name)

    def is_saved(self, name: str) -> bool:
        return (self.folder() / f"{name}.md").is_file()

    def saved(self, profile: Profile) -> str:
        model, codex_model = str(self.settings.option(ProfilesOptions.CLAUDE_MODEL)), str(self.settings.option(ProfilesOptions.CODEX_MODEL))
        return self.save(profile, profile.model_default(model), codex_model)["path"]

    def write_all(self) -> list[Path]:
        self.clear()
        model, codex_model = str(self.settings.option(ProfilesOptions.CLAUDE_MODEL)), str(self.settings.option(ProfilesOptions.CODEX_MODEL))
        return [path for profile in self.PROFILES for path in self.write(profile, profile.model_default(model), codex_model)]

    def clear(self) -> None:
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
        saved = []
        for provider in self.providers.all():
            if not provider.default and not (self.config.root / provider.home).is_dir():
                continue
            text = provider.profile_text(profile, model, codex_model)
            path = self.config.root / provider.home / "agents" / f"{profile.name}{provider.profile_suffix}"
            path.parent.mkdir(parents=True, exist_ok=True)
            if not path.is_file() or path.read_text() != text:
                path.write_text(text)
            saved.append(path)
        return saved
