import os
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from journal.config import Config
from journal.support.output_mask import OutputMask
from journal.features.secrets.support.programs import Programs
from journal.models.secret import Secret
from journal.support.secret_field import SecretField
from journal.support.refused import Refused
from journal.repositories.mcp_servers import McpServers
from journal.support.secret_values import SecretValues

PLACEHOLDER = re.compile(r"\{(\w+)\}")
TEMPORARY_HOME_VARIABLES = ("HOME", "XDG_CONFIG_HOME", "XDG_CACHE_HOME", "XDG_DATA_HOME", "XDG_STATE_HOME", "GH_CONFIG_DIR", "DOCKER_CONFIG")
LONGEST = 120


class SecretRun:
    """A secret given to one program it allows, in the journal's own process: the program found on a search path that leaves out the project, run with a throwaway home and nothing of the agent's shell, given the value on its input or in variables, and its output handed back with every form of the value masked."""

    def __init__(self, config: Config, values: SecretValues, servers: McpServers) -> None:
        self.config, self.values, self.servers = config, values, servers

    def run(self, secret: Secret, command: list[str], template: str, as_variables: bool) -> tuple[int, bytes]:
        program = self.program(secret, command)
        fields = [SecretField.of(raw) for raw in secret.fields]
        keys = {s.key_var for s in self.servers.all() if s.needs_key}
        if any(f.variable in keys for f in fields):
            raise Refused(f"{secret.title} is the key of an MCP server, which only the journal itself uses: no program is given it")
        values = self.values.values()
        missing = [f.name for f in fields if f.variable not in values]
        if missing:
            raise Refused(f"secret {secret.id}, {secret.title}, has no value for {', '.join(missing)} on this machine: ask the user with `journal secret request`, and they fill it on the Secrets page")
        by_name = {f.name: values[f.variable] for f in fields}
        given = PLACEHOLDER.sub(lambda rows: by_name.get(rows[1], rows[0]), template) if template else next((values[f.variable] for f in fields if f.hidden), "")
        mask = OutputMask({values[f.variable]: f.variable for f in fields if f.hidden})
        runs = self.values.path.parent / "runs"
        runs.mkdir(mode=0o700, exist_ok=True)
        home = tempfile.mkdtemp(prefix="run-", dir=runs)
        try:
            environ = {"PATH": self.search_path(), "LANG": os.environ.get("LANG", "C.UTF-8"), **dict.fromkeys(TEMPORARY_HOME_VARIABLES, home), **({f.variable: values[f.variable] for f in fields} if as_variables else {})}
            done = subprocess.run([program, *command[1:]], input=f"{given}\n".encode(), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=environ, cwd=self.config.root, timeout=LONGEST)
            return done.returncode, mask.masked(done.stdout)
        finally:
            shutil.rmtree(home, ignore_errors=True)

    def program(self, secret: Secret, command: list[str]) -> str:
        if not command:
            raise Refused("name the program after --, such as `journal secret run github -- gh api user`")
        name = command[0]
        if "/" in name:
            raise Refused(f"name the program bare, as {Path(name).name}: a path could be a file of anyone's making")
        if Programs.never_given(name):
            raise Refused(f"a secret is never given to {name}: name the program that uses it directly, such as curl or gh")
        if name not in secret.programs:
            raise Refused(f"{name} is not among the programs secret {secret.id} may go to ({', '.join(secret.programs) or 'none yet'}): propose it with `journal secret propose {secret.id} {name}`, and the user allows it on the Secrets page")
        rows = shutil.which(name, path=self.search_path())
        if rows is None:
            raise Refused(f"no program {name} on this machine")
        return rows

    def search_path(self) -> str:
        root = self.config.root.resolve()
        kept = [p for p in os.environ.get("PATH", "/usr/bin:/bin").split(os.pathsep) if p and not Path(p).resolve().is_relative_to(root)]
        return os.pathsep.join(kept)
