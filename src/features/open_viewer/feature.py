from controllers.types import Agents, Environments
from expects import Answered, Given, Refused
from features.base import Feature
from features.journal import Journal
from features.open_viewer.commands import (Appoint, Control, Force, Pause, Relaunch, Resume, RunShell, SaveSettings, SendKeys, ShowAttachments, ShowAttachmentsPage, ShowEvents, ShowHooks, ShowLinks,
                                          ShowManifest, ShowOnline, ShowOptions, ShowScreen, ShowSettings, ShowSummary, ShowTranscript, WireHooks)
from features.open_viewer.details import OpenViewerDetails
from features.open_viewer.handlers import ShowViewerTab
from resources.types import AgentRow

OFFLINE = "session '{}' is not online: no agent's terminal reports it as its session"
SESSION = "claude-1"
AGENT_ROW = AgentRow(n=1, title=SESSION)


def offline(command: tuple) -> Given:
    return Given((Agents, SESSION, *command), rows=[AGENT_ROW])


class OpenViewer(Feature):
    details = OpenViewerDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowViewerTab())
        journal.commands.add("environment", ShowManifest())
        journal.commands.add("environment", ShowSummary())
        journal.commands.add("environment", ShowEvents(), expects=[
            Given((Environments,)) >> Answered([]),
        ])
        journal.commands.add("environment", ShowAttachments(), expects=[
            Given((Environments,)) >> Answered([]),
        ])
        journal.commands.add("environment", ShowAttachmentsPage(), expects=[
            Given((Environments,)) >> Answered({"files": [], "more": False, "found": 0, "counts": {"all": 0, "images": 0, "other": 0, "shelves": {}}}),
        ])
        journal.commands.add("feature", ShowSettings())
        journal.commands.add("feature", SaveSettings())
        journal.commands.add("agent", ShowOnline(), expects=[
            Given((Agents,), rows=[AGENT_ROW]) >> Answered([]),
        ])
        journal.commands.add("agent", Appoint(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", ShowOptions())
        journal.commands.add("agent", RunShell(), expects=[offline(("ls",)) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", ShowScreen(), expects=[offline(()) >> Refused(f"no session {SESSION}")])
        journal.commands.add("agent", SendKeys(), expects=[offline(("hello",)) >> Refused(f"no session {SESSION}")])
        journal.commands.add("agent", Relaunch())
        journal.commands.add("agent", Force(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", Pause(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", Resume(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", Control(), expects=[offline(("pause",)) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", ShowHooks(), expects=[
            Given((Agents, "claude")) >> Answered({"path": ".claude/settings.local.json", "hooks": {}, "elsewhere": []}),
        ])
        journal.commands.add("agent", WireHooks())
        journal.commands.add("agent", ShowTranscript(), expects=[
            Given((Agents, 1), rows=[AGENT_ROW]) >> Answered({"total": 0, "first": 0, "turns": []}),
        ])
        journal.commands.add("agent", ShowLinks(), expects=[
            Given((Agents, 1), rows=[AGENT_ROW]) >> Answered({"links": []}),
        ])
