import re

from pathlib import Path

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome

# github.com itself, or an ssh host alias for it such as github-work or github.com-work
REMOTE_URL = re.compile(r"github[\w.-]*[:/]([\w.-]+)/([\w.-]+?)(?:\.git)?\s*$", re.MULTILINE)
SECTION = re.compile(r"^\s*\[([^\]]+)\]\s*$")
INCLUDE_PATH = re.compile(r"^\s*path\s*=\s*(.+?)\s*$")
INCLUDE_SECTIONS = ("include", "includeif")
MOST_CONFIG_FILES = 8


class ProjectRepositories:
    """The GitHub repositories this project's checkout names as its remotes, as owner/name, read from its git config
    and the files it includes, also when the checkout is a worktree or a submodule whose .git is a file, so only a pull
    request of the project's own repository is pinned."""

    def __init__(self, home: JournalHome) -> None:
        self.git = home.project_folder / ".git"

    def names(self) -> set[str]:
        return {f"{owner}/{name}".lower() for text in self.config_texts().values() for owner, name in REMOTE_URL.findall(text)}

    def config_texts(self) -> dict[Path, str]:
        """The text of the checkout's config and of every file it includes, each read once."""
        config = self.config()
        texts: dict[Path, str] = {}
        pending = [config] if config is not None else []
        while pending and len(texts) < MOST_CONFIG_FILES:
            current = pending.pop(0)
            if current in texts or not current.is_file():
                continue
            texts[current] = FileAccess.shared().read(current)
            pending.extend(ProjectRepositories.included(current, texts[current]))
        return texts

    @staticmethod
    def included(config: Path, text: str) -> list[Path]:
        paths: list[Path] = []
        section = ""
        for line in text.splitlines():
            if heading := SECTION.match(line):
                section = heading.group(1).split()[0].lower()
                continue
            if section in INCLUDE_SECTIONS and (path := INCLUDE_PATH.match(line)):
                paths.append((config.parent / Path(path.group(1).strip('"')).expanduser()).resolve())
        return paths

    def config(self) -> Path | None:
        if self.git.is_dir():
            return self.git / "config"
        if not self.git.is_file():
            return None
        pointed = Path(FileAccess.shared().read(self.git).removeprefix("gitdir:").strip())
        pointed = pointed if pointed.is_absolute() else (self.git.parent / pointed).resolve()
        common = pointed / "commondir"
        folder = (pointed / FileAccess.shared().read(common).strip()).resolve() if common.is_file() else pointed
        return folder / "config" if (folder / "config").is_file() else None
