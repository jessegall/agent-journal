import os
import shlex
import shutil
from argparse import Namespace
from pathlib import Path

from journal.config import Config
from journal.console.command import Command
from journal.console.where import Where
from journal.features.laws.law_text import LawText
from journal.features.profiles.profile_files import ProfileFiles
from journal.features.skills.skill_files import SkillFiles
from journal.providers.providers import Providers
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink
from journal.launcher.dispatcher import Dispatcher
from journal.launcher.project_command import ProjectCommand



class SetupCommand(Command):
    """journal setup: everything a project needs to run under the journal, idempotently."""

    noun = "setup"
    default_verb = "project"

    def __init__(self, config: Config, providers: Providers, files: SkillFiles, profiles: ProfileFiles, environments: Environments, supervisor: SupervisorLink) -> None:
        self.config, self.providers, self.files, self.profiles, self.environments, self.supervisor = config, providers, files, profiles, environments, supervisor

    def arguments(self, verbs) -> None:
        self.verb(verbs, "project", "wire the hooks, write the skills and the law, put journal on the path; what journal setup does alone")
        self.verb(verbs, "hooks", "wire the hooks only")
        self.verb(verbs, "restart", "restart the running journals on the installed code; the agents keep running")

    def project(self, args: Namespace, where: Where) -> int:
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
        for name in self.restarted():
            print(f"restart {name}: the journal of that environment runs the new code")
        return 0

    def restart(self, args: Namespace, where: Where) -> int:
        names = self.restarted()
        for name in names:
            print(f"restart {name}: the journal of that environment runs the new code")
        if not names:
            print("no journal is running")
        return 0

    def restarted(self) -> list[str]:
        """Every environment with an agent running is told to restart its journal, so an install is live at once."""
        names = [e.name for e in self.environments.all() if self.supervisor.runs(e.id)]
        for environment in self.environments.all():
            if environment.name in names:
                self.supervisor.restart_journal(environment.id)
        return names

    def hooks(self, args: Namespace, where: Where) -> int:
        """The hooks of every agent present: Claude always, another where the project has its folder or its program is installed. Each hook first tests that its script is still there, so a package moved away fails silent instead of in the chat."""
        script = self.package / "hooks" / "hook.sh"
        for provider in self.providers.all():
            if provider.name != "claude" and not (self.config.root / provider.home).is_dir() and not shutil.which(provider.name):
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
