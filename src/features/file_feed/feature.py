from controllers.types import Agents
from dataclasses import replace

from events.file_feed import EditToDiff
from events.files import FileEdited
from expects import Answered, Dispatches, Given, Ran, Refused, Remembered, Unchanged, answering, nothing
from framework.base import Feature
from features.file_feed.details import FileFeedDetails
from features.file_feed.handlers import KeepEdits, WarmTheDiff
from features.file_feed.listeners import SpotEditToDiff
from framework.journal import Journal
from resources.types import AgentRow

AGENT_ROW = AgentRow(n=1, title="claude-1")
EDITED = FileEdited(agent=1, path="src/app.py", kind="edited", before="a\n", after="a\nb\n", added=1, removed=0)
from features.file_feed.commands import ShowChanges, ShowEditedFile, ShowEditedImage, ShowEdits, ShowOlderEdits
from features.file_feed.routes import get_changes, get_edited_file, get_edited_image, get_edits, get_older_edits


class FileFeed(Feature):
    details = FileFeedDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_changes, get_edits, get_older_edits, get_edited_file, get_edited_image)
        journal.commands.add("agent", ShowChanges(), expects=[
            Given((Agents,), rows=[AGENT_ROW]) >> Answered({"changes": []}),
        ])
        journal.commands.add("agent", ShowEdits(), expects=[
            Given((Agents, 1), rows=[AGENT_ROW]) >> Answered({"cursor": 0.0, "edits": (), "older": False}),
        ])
        journal.commands.add("agent", ShowOlderEdits(), expects=[
            Given((Agents, 1, 5.0), rows=[AGENT_ROW]) >> Answered({"edits": (), "older": False}),
        ])
        journal.commands.add("agent", ShowEditedFile(), expects=[
            Given((Agents, 1, "missing"), rows=[AGENT_ROW]) >> Refused("no edit missing"),
        ])
        journal.commands.add("agent", ShowEditedImage(), expects=[
            Given((Agents, 1, "missing"), rows=[AGENT_ROW]) >> Refused("no picture missing"),
        ])
        journal.events.handle(FileEdited, KeepEdits(), expects=[
            Given(EDITED, rows=[AGENT_ROW]) >> Remembered("notes"),
            Given(replace(EDITED, path="shot.png"), rows=[AGENT_ROW]) >> Remembered("notes"),
        ])
        journal.events.listen(FileEdited, SpotEditToDiff(), expects=[
            Given(EDITED, rows=[AGENT_ROW]) >> Dispatches(EditToDiff(before="a\n", after="a\nb\n")),
            Given(replace(EDITED, path="shot.png"), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(EditToDiff, WarmTheDiff(), expects=[
            Given(EditToDiff(before="a\n", after="a\nb\n"), rows=[AGENT_ROW], git=answering({("blobs", ("a\n", "a\nb\n")): {"a\n": "a\n", "a\nb\n": "a\nb\n"}})) >> Unchanged(),
            Given(EditToDiff(before="warm-a\n", after="warm-b\n"), rows=[AGENT_ROW], git=answering({("blobs", ("warm-a\n", "warm-b\n")): {"warm-a\n": "warm-a\n", "warm-b\n": "warm-b\n"}}))
                >> Ran(("blobs", ("warm-a\n", "warm-b\n"))),
        ])
