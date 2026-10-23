import os
import shutil
from journal.providers.provider import HOOK_SCRIPT
from argparse import Namespace
from pathlib import Path

from journal.config import Config
from journal.console.command import Command
from journal.support.caller import Caller
from journal.support.law_text import LawText
from journal.features.profiles.support.profile_files import ProfileFiles
from journal.features.shell.support.restart_queue import RestartQueue
from journal.features.shell.support.shell_request import OUTPUT_FOLDER_VARIABLE
from journal.models.command_output import CommandOutput
from journal.models.environment import Environment
from journal.features.skills.support.skill_files import SkillFiles
from journal.providers.providers import Providers
from journal.repositories.environments import Environments
from journal.supervisor_link import SupervisorLink
from journal.launcher.dispatcher import Dispatcher
from journal.support.project_command import ProjectCommand



class SetupCommand(Command):
    """journal setup: everything a project needs to run under the journal, idempotently."""

    noun = "setup"
    default_verb = "project"

    def __init__(self, config: Config, providers: Providers, files: SkillFiles, profiles: ProfileFiles, environments: Environments, supervisor: SupervisorLink, queue: RestartQueue) -> None:
        self.config, self.providers, self.files, self.profiles, self.environments, self.supervisor, self.queue = config, providers, files, profiles, environments, supervisor, queue

    def arguments(self, verbs) -> None:
        self.verb(verbs, "project", "wire the hooks, write the skills and the law, put journal on the path; what journal setup does alone")
        self.verb(verbs, "hooks", "wire the hooks only")
        self.verb(verbs, "restart", "restart the running journals on the installed code; the agents keep running")

    def project(self, args: Namespace, caller: Caller) -> int:
        self.config.home.mkdir(parents=True, exist_ok=True)
        self.hooks(args, caller)
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
        for line in self.restarted():
            print(line)
        return 0

    def restart(self, args: Namespace, caller: Caller) -> int:
        lines = self.restarted()
        for line in lines:
            print(line)
        if not lines:
            print("no journal is running")
        return 0

    def restarted(self) -> list[str]:
        asking_folder = os.environ.get(OUTPUT_FOLDER_VARIABLE, "")
        return [self.restart_line(environment, self.queue.restart(environment.row_id, asking_folder)) for environment in self.supervisor.running(self.environments.all())]

    @staticmethod
    def restart_line(environment: Environment, outputs: list[CommandOutput]) -> str:
        if not outputs:
            return f"restart {environment.name}: the journal of that environment runs the new code"
        numbers = ", ".join(str(output.id) for output in outputs)
        return f"restart {environment.name} waits: outputs {numbers} still run, and the restart starts by itself once the last of them ends. check each with journal output status, whether it is still working and why, and end any that is stuck"

    def hooks(self, args: Namespace, caller: Caller) -> int:
        for provider in self.providers.all():
            if not provider.default and not (self.config.root / provider.home).is_dir() and not shutil.which(provider.name):
                continue
            command = provider.hook_command(self.config.root)
            print(f"hooks   {provider.wire_hooks(self.config.root, HOOK_SCRIPT, command).relative_to(self.config.root)}")
        return 0

    def law(self) -> Path:
        path = self.config.root / "AGENTS.md"
        prior = path.read_text() if path.is_file() else "# " + self.config.root.name + "\n"
        saved = LawText.installed(prior)
        if saved != prior:
            path.write_text(saved)
        return path

    def claude_md(self) -> Path:
        path = self.config.root / "CLAUDE.md"
        prior = path.read_text() if path.is_file() else ""
        if "@AGENTS.md" not in prior:
            path.write_text((prior.rstrip("\n") + "\n\n" if prior.strip() else "") + "@AGENTS.md\n")
        return path

    def ignored(self) -> Path:
        path = self.config.root / ".gitignore"
        prior = path.read_text() if path.is_file() else ""
        if "/.journal" not in prior.splitlines() and ".journal" not in prior.splitlines() and ".journal/" not in prior.splitlines():
            path.write_text((prior.rstrip("\n") + "\n" if prior.strip() else "") + "/.journal\n")
        return path

    def shim(self) -> Path:
        return ProjectCommand(self.config.root, self.package.parent / "journal.sh").write()

    @property
    def package(self) -> Path:
        return Path(__file__).resolve().parents[2]
