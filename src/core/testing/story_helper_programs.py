from pathlib import Path

from core.modules.helpers.support.helper_programs import HelperPrograms


class StoryHelperPrograms(HelperPrograms):
    """Passes every program, since a story's folders do not exist and its programs are not installed."""

    def __init__(self) -> None:
        return None

    def installed(self, program: str) -> None:
        return None

    def checked(self, program: str, folder: Path) -> None:
        return None
