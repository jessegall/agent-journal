import json
import os
import uuid
from pathlib import Path

PROJECT_ID = "project-id"
FOLDER_VARIABLE = "AGENT_JOURNAL_SECRETS"
HEADER = """# The values of this project's secrets, written by agent-journal.
# One line per field: NAME="value". The journal never copies this file anywhere.
"""


def secrets_folder() -> Path:
    if FOLDER_VARIABLE in os.environ:
        return Path(os.environ[FOLDER_VARIABLE])
    if os.name == "nt":
        return Path(os.environ["APPDATA"]) / "agent-journal" / "secrets"
    return Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-journal" / "secrets"


def project_id(root: Path) -> str:
    path = root / PROJECT_ID
    if not path.is_file():
        path.write_text(uuid.uuid4().hex)
    return path.read_text().strip()


def parsed(line: str) -> tuple[str, str] | None:
    name, equals, rest = line.strip().partition("=")
    if not equals or name.startswith("#"):
        return None
    return name.strip(), json.loads(rest) if rest.startswith('"') else rest


class ValuesFile:
    def __init__(self, root: Path):
        self.path = secrets_folder() / f"{project_id(root)}.env"

    def values(self) -> dict[str, str]:
        if not self.path.is_file():
            return {}
        return dict(found for found in map(parsed, self.path.read_text().splitlines()) if found)

    def put(self, variable: str, value: str) -> None:
        self.write({**self.values(), variable: value})

    def drop(self, variables: list[str]) -> None:
        self.write({name: value for name, value in self.values().items() if name not in variables})

    def write(self, values: dict[str, str]) -> None:
        self.path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
        self.path.parent.chmod(0o700)
        written = self.path.with_suffix(".writing")
        handle = os.open(written, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(handle, "w") as out:
            out.write(HEADER + "".join(f"{name}={json.dumps(value)}\n" for name, value in values.items()))
        os.replace(written, self.path)
