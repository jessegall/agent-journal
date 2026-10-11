from controllers.types import Agents
from expects import Answered, Given, Refused
from features.base import Feature
from features.file_feed.details import FileFeedDetails
from features.file_feed.handlers import KeepEdits
from features.journal import Journal
from resources.types import AgentRow

AGENT_ROW = AgentRow(n=1, title="claude-1")
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
        journal.events.handler(KeepEdits())
