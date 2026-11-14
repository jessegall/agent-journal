import threading
from collections.abc import Callable, Mapping
from functools import cache

from engine.journal.journal_home import JournalHome

KEPT_TRANSCRIPT_COUNT = 200


class KeptSkillRecords:
    """The skills a program put back into its context, as its transcript records them, kept for each transcript
    until its session is replaced or compacted: the program writes that record only then, so the
    transcript is read once for each session and compaction instead of on every tool use."""

    def __init__(self) -> None:
        self.kept: dict[tuple[str, str], Mapping[str, str]] = {}
        self.lock = threading.Lock()

    # one record for each journal a process serves, shared by every hook
    @staticmethod
    @cache
    def shared(home: JournalHome) -> "KeptSkillRecords":
        return KeptSkillRecords()

    def digests(self, transcript_path: str, session_mark: str, read: Callable[[], Mapping[str, str]]) -> Mapping[str, str]:
        key = (transcript_path, session_mark)
        with self.lock:
            if key in self.kept:
                return self.kept[key]
        digests = read()
        with self.lock:
            if len(self.kept) >= KEPT_TRANSCRIPT_COUNT:
                self.kept.clear()
            self.kept[key] = digests
        return digests
