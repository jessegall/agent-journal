import os
from pathlib import Path

from journal.support.secret_values import SecretValues

VARIABLE = "GITHUB_TOKEN"


class GithubToken:
    """The GitHub token gh is given in a secret run: the project root's .env first, the journal's own GITHUB_TOKEN when that file has none, never GH_TOKEN or a cached login."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def found(self) -> str | None:
        return self.from_dotenv() or os.environ.get(VARIABLE, "").strip() or None

    def from_dotenv(self) -> str | None:
        path = self.root / ".env"
        if path.is_symlink() or not path.is_file():
            return None
        rows = dict(row for row in map(SecretValues.parsed, path.read_text().splitlines()) if row)
        value = rows.get(VARIABLE, rows.get(f"export {VARIABLE}", "")).strip()
        return value.strip("'") or None
