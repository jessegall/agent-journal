import os
import re
import shlex

CD = re.compile(r"^cd(?=\s|$)(.*)$", re.S)
HOME = "~"


class FolderChange:
    """The cds standing on their own in a shell line, outside any subshell, each of which moves the agent's shell for every command after it."""

    @staticmethod
    def targets(texts: list[str]) -> list[str]:
        return [(shlex.split(change.group(1)) or [HOME])[0] for change in (CD.match(text.strip()) for text in texts) if change]

    @staticmethod
    def is_home(target: str, home: str) -> bool:
        return os.path.normpath(os.path.expanduser(target)) == os.path.normpath(home)
