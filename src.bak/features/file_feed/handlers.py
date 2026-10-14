from dataclasses import asdict

from events import Fact
from events.file_feed import EditToDiff
from events.files import FileEdited
from features.file_feed.diff import warmed
from features.file_feed.feed import KEPT
from receiving import Handler
from serving import ReadGit, Remembered


class KeepEdits(Handler[FileEdited]):
    def handle(self, event: FileEdited, remembered: Remembered) -> list[Fact]:
        with remembered.changing() as held:
            held["notes"] = [*held.get("notes", []), asdict(event)][-KEPT:]
        return []


class WarmTheDiff(Handler[EditToDiff]):
    def handle(self, event: EditToDiff, git: ReadGit) -> list[Fact]:
        warmed(git.blobs, [(event.before, event.after)])
        return []
