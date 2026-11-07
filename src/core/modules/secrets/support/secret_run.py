from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from core.base.user_approval import UserApproval
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.support.output_mask import OutputMask
from core.base.private.private_folder import PrivateFolder
from core.modules.secrets.support.secret_programs import SecretPrograms
from core.modules.secrets.support.secret_run_outcome import SecretRunOutcome
from core.base.private.secret_values import SecretValues
from pathlib import Path
import os
import re
import shutil
import subprocess
import tempfile

PLACEHOLDER = re.compile(r"\{(\w+)\}")
HOME_VARIABLES = ("HOME", "XDG_CONFIG_HOME", "XDG_CACHE_HOME", "XDG_DATA_HOME", "XDG_STATE_HOME", "GH_CONFIG_DIR", "DOCKER_CONFIG")
LIMIT_SECONDS = 120
RUNS_FOLDER = "runs"


class SecretRun:
    """A secret given to one program the user allowed: found bare on a search path without the project, run in
    the project with a throwaway home, nothing of the agent's environment and a limit of 120 seconds, given
    the value on its input or in its variables, and its output returned with every value masked."""

    def __init__(self, home: JournalHome, folder: PrivateFolder, values: SecretValues) -> None:
        self.home, self.folder, self.values = home, folder, values

    def run(self, secret: Secret, command: list[str], template: str, as_variables: bool) -> SecretRunOutcome:
        program = self.program(secret, command)
        stored = self.values.values()
        missing = [field.name for field in secret.secret_fields() if field.variable not in stored]
        if missing:
            raise Refusal(f"secret {secret.id} has no value for {', '.join(missing)}", "the user fills it on the Secrets window")
        field_values = {field.name: stored[field.variable] for field in secret.secret_fields()}
        hidden = next((stored[field.variable] for field in secret.secret_fields() if field.hidden), "")
        stdin_text = PLACEHOLDER.sub(lambda match: field_values.get(match[1], match[0]), template) if template else hidden
        variables = {field.variable: stored[field.variable] for field in secret.secret_fields()} if as_variables else {}
        runs = self.folder.made_folder() / RUNS_FOLDER
        runs.mkdir(mode=0o700, exist_ok=True)
        home = tempfile.mkdtemp(prefix="run-", dir=runs)
        try:
            environment = {"PATH": self.search_path(), "LANG": os.environ.get("LANG", "C.UTF-8"), **dict.fromkeys(HOME_VARIABLES, home), **variables}
            finished = subprocess.run([program, *command[1:]], input=f"{stdin_text}\n".encode(), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=environment,
                                      cwd=self.home.project_folder, timeout=LIMIT_SECONDS)
        except subprocess.TimeoutExpired as late:
            raise Refusal(f"{command[0]} ran past {LIMIT_SECONDS} seconds and was stopped", "give a secret to a program that finishes sooner") from late
        finally:
            shutil.rmtree(home, ignore_errors=True)
        return SecretRunOutcome(command[0], finished.returncode, OutputMask(self.values.hidden_values()).masked(finished.stdout).decode(errors="replace"))

    def program(self, secret: Secret, command: list[str]) -> str:
        if not command:
            raise Refusal(f"name the program after --, such as journal secret run {secret.id} -- gh api user")
        name = command[0]
        if "/" in name:
            raise Refusal(f"name the program bare, as {Path(name).name}", "a path could be a file of anyone's making")
        if SecretPrograms.is_skipped(name):
            raise Refusal(f"a secret never goes to {name}", "name the program that uses it, such as curl or gh")
        if name not in secret.programs:
            raise UserApproval(f"Allow {name} to use the secret {secret.title}?", ("secret", "allow", str(secret.id), name))
        program_path = shutil.which(name, path=self.search_path())
        if program_path is None:
            raise Refusal(f"no program {name} on this machine")
        return program_path

    def search_path(self) -> str:
        project = self.home.project_folder
        return os.pathsep.join(entry for entry in os.environ.get("PATH", "/usr/bin:/bin").split(os.pathsep) if entry and not Path(entry).resolve().is_relative_to(project))
