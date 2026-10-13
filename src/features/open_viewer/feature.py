from controllers.types import Agents, Environments, Features
from events.agents import AgentChanged
from expects import Answered, Dispatches, Given, Ran, Refused, answering, nothing
from framework.base import Feature
from framework.journal import Journal
from features.open_viewer.commands import (Appoint, Control, Force, Pause, Relaunch, Resume, RunShell, SaveSettings, SendKeys, ShowAttachments, ShowAttachmentsPage, ShowEvents, ShowHooks, ShowLinks,
                                          ShowManifest, ShowOnline, ShowOptions, ShowScreen, ShowSettings, ShowSummary, ShowTranscript, WireHooks)
from features.open_viewer.details import OpenViewerDetails
from features.open_viewer.handlers import ShowViewerTab
from features.open_viewer.listeners import SpotAgentStart
from events.open_viewer import ViewerTabToOpen
from resources.types import AgentRow

OFFLINE = "session '{}' is not online: no agent's terminal reports it as its session"
SESSION = "claude-1"
AGENT_ROW = AgentRow(n=1, title=SESSION)
STARTED = AgentRow(n=1, title=SESSION, data={"event": "SessionStart"})
URL = "http://127.0.0.1:8420"


def offline(command: tuple) -> Given:
    return Given((Agents, SESSION, *command), rows=[AGENT_ROW])


class Carrying:
    def __init__(self, *keys: str) -> None:
        self.keys = keys

    def __eq__(self, answer: dict) -> bool:
        return all(key in answer for key in self.keys)


class OpenViewer(Feature):
    details = OpenViewerDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentChanged, SpotAgentStart(), expects=[
            Given(AgentChanged(agent=1, action="updated"), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(AgentChanged(agent=1, action="updated"), rows=[STARTED], viewer=answering({("running",): URL}))
                >> Dispatches(ViewerTabToOpen(url=URL).once(f"viewer opened|{SESSION}")),
            Given(AgentChanged(agent=1, action="updated"), rows=[STARTED]) >> Dispatches(nothing),
            Given(AgentChanged(agent=1, action="updated"), rows=[AgentRow(n=1, title=SESSION, data={"event": "SessionStart", "parent": "claude-0"})], viewer=answering({("running",): URL}))
                >> Dispatches(nothing),
        ])
        journal.events.handle(ViewerTabToOpen, ShowViewerTab(), expects=[
            Given(ViewerTabToOpen(url=URL), rows=[AGENT_ROW], viewer=answering({("running",): URL})) >> Ran(("show", URL, "t")),
        ])
        journal.commands.add("environment", ShowManifest(), expects=[
            Given((Environments,)) >> Answered(Carrying("project", "environment", "version", "build", "actions", "actors")),
        ])
        journal.commands.add("environment", ShowSummary(), expects=[
            Given((Environments,)) >> Answered(Carrying("project", "root", "version", "environments", "helpers", "tickets")),
        ])
        journal.commands.add("environment", ShowEvents(), expects=[
            Given((Environments,)) >> Answered([]),
        ])
        journal.commands.add("environment", ShowAttachments(), expects=[
            Given((Environments,)) >> Answered([]),
        ])
        journal.commands.add("environment", ShowAttachmentsPage(), expects=[
            Given((Environments,)) >> Answered({"files": [], "more": False, "found": 0, "counts": {"all": 0, "images": 0, "other": 0, "shelves": {}}}),
        ])
        journal.commands.add("feature", ShowSettings(), expects=[
            Given((Features,)) >> Answered(Carrying("features", "agent_sessions", "gmail")),
        ])
        journal.commands.add("feature", SaveSettings(), expects=[
            Given((Features, {"acknowledgements": False})) >> Answered(Carrying("features", "agent_sessions", "gmail")),
        ])
        journal.commands.add("agent", ShowOnline(), expects=[
            Given((Agents,), rows=[AGENT_ROW]) >> Answered([]),
        ])
        journal.commands.add("agent", Appoint(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", ShowOptions(), expects=[
            Given((Agents, "claude")) >> Answered(Carrying("provider", "groups", "note")),
        ])
        journal.commands.add("agent", RunShell(), expects=[offline(("ls",)) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", ShowScreen(), expects=[offline(()) >> Refused(f"no session {SESSION}")])
        journal.commands.add("agent", SendKeys(), expects=[offline(("hello",)) >> Refused(f"no session {SESSION}")])
        journal.commands.add("agent", Relaunch(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", Force(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", Pause(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", Resume(), expects=[offline(()) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", Control(), expects=[offline(("pause",)) >> Refused(OFFLINE.format(SESSION))])
        journal.commands.add("agent", ShowHooks(), expects=[
            Given((Agents, "claude")) >> Answered({"path": ".claude/settings.local.json", "hooks": {}, "elsewhere": []}),
        ])
        journal.commands.add("agent", WireHooks(), expects=[
            Given((Agents, "bogus", {})) >> Refused("no provider bogus"),
            Given((Agents, "claude", {})) >> Answered(Carrying("hooks")),
        ])
        journal.commands.add("agent", ShowTranscript(), expects=[
            Given((Agents, 1), rows=[AGENT_ROW]) >> Answered({"total": 0, "first": 0, "turns": []}),
        ])
        journal.commands.add("agent", ShowLinks(), expects=[
            Given((Agents, 1), rows=[AGENT_ROW]) >> Answered({"links": []}),
        ])
