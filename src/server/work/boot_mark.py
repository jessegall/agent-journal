from functools import cache

from engine.errors.booted_twice_error import BootedTwiceError
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome


class BootMark:
    """The hidden .booting file a server keeps in the journal's home while it boots: cleared at every start, so a
    crash never leaves one behind, and removed when the boot ends. A second boot of one journal in one process is
    refused."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.has_begun = False

    # one mark for each journal a process serves
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "BootMark":
        return BootMark(home)

    def begin(self) -> None:
        if self.has_begun:
            raise BootedTwiceError(str(self.home.folder))
        self.has_begun = True
        FileAccess.write(self.home.booting_mark, "")

    def end(self) -> None:
        FileAccess.unlink(self.home.booting_mark, missing_ok=True)

    @property
    def is_booting(self) -> bool:
        return FileAccess.exists(self.home.booting_mark)
