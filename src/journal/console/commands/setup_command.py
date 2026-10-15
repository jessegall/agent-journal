import os
import shlex
from argparse import Namespace
from pathlib import Path

from journal.config import Config
from journal.console.command import Command
from journal.console.where import Where
from journal.features.laws.law_text import LawText
from journal.features.profiles.profile_files import ProfileFiles
from journal.features.skills.skill_files import SkillFiles
from journal.providers.providers import Providers
from supervisor.dispatcher import Dispatcher
from supervisor.project_command import ProjectCommand



class SetupCommand(Command):
    """journal setup here: everything a project needs to run under the journal, idempotently."""

    noun = "setup"

    def __init__(self, config: Config, providers: Providers, files: SkillFiles, profiles: ProfileFiles) -> None:
        self.config, self.providers, self.files, self.profiles = config, providers, files, profiles

    def arguments(self, verbs) -> None:
        self.verb(verbs, "here", "wire the hooks, write the skills and the law, put journal on the path")
        self.verb(verbs, "hooks", "wire the hooks only")

    def here(self, args: Namespace, where: Where) -> int:
        self.config.home.mkdir(parents=True, exist_ok=True)
        self.hooks(args, where)
        for path in self.files.write_all():
            print(f"skill   {path.relative_to(self.config.root)}")
        for path in self.profiles.write_all():
            print(f"profile {path.relative_to(self.config.root)}")
        print(f"law     {self.law().relative_to(self.config.root)}")
        print(f"imports {self.claude_md().relative_to(self.config.root)}")
        print(f"command {self.shim()}")
        if dispatcher := Dispatcher(Path.home()).write():
            print(f"journal {dispatcher}")
        print(f"ignored {self.ignored().relative_to(self.config.root)}")
        return 0

    def hooks(self, args: Namespace, where: Where) -> int:
        """Each hook first tests that its script is still there, so a package moved away fails silent instead of in the chat."""
        script = self.package / "hooks" / "hook.sh"
        for provider in self.providers.all():
            if provider.name != "claude" and not (self.config.root / provider.home).is_dir():
                continue
            command = f"test -f {shlex.quote(str(script))} && exec {shlex.join(['sh', str(script), provider.name, str(self.config.root)])}; exit 0"
            print(f"hooks   {provider.wire_hooks(self.config.root, script, command).relative_to(self.config.root)}")
        return 0

    def law(self) -> Path:
        path = self.config.root / "AGENTS.md"
        had = path.read_text() if path.is_file() else "# " + self.config.root.name + "\n"
        written = LawText.written_into(had)
        if written != had:
            path.write_text(written)
        return path

    def claude_md(self) -> Path:
        path = self.config.root / "CLAUDE.md"
        had = path.read_text() if path.is_file() else ""
        if "@AGENTS.md" not in had:
            path.write_text((had.rstrip("\n") + "\n\n" if had.strip() else "") + "@AGENTS.md\n")
        return path

    def ignored(self) -> Path:
        """The project's .gitignore keeps the journal's own folder out of the repository."""
        path = self.config.root / ".gitignore"
        had = path.read_text() if path.is_file() else ""
        if "/.journal" not in had.splitlines() and ".journal" not in had.splitlines() and ".journal/" not in had.splitlines():
            path.write_text((had.rstrip("\n") + "\n" if had.strip() else "") + "/.journal\n")
        return path

    def shim(self) -> Path:
        """The command, written inside the project at .journal/bin/journal and nowhere else."""
        return ProjectCommand(self.config.root, self.package.parent / "journal.sh").write()

    @property
    def package(self) -> Path:
        return Path(__file__).resolve().parents[2]
