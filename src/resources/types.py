import time
from dataclasses import asdict, dataclass
from enum import StrEnum
from pathlib import Path
from typing import ClassVar

from resources.fields import Loaded

from resources.base import AGENT, CLOSED, COMMISSIONED, COMPLETED, DOCUMENT, OPEN, OPENED, PROJECT, REQUESTED, RESULTS, REVISED, SIDEBAR, SYSTEM, UNLISTED, UPDATES, USER, WHOM, Pruned, Ref, Refused, Resource, ResourceDetails
from resources.shapes import FLAG, NUMBER, TEXT, Field, Options, Placed, Ranked, Reasoned, Shape, Traced, rows


class Message(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="idempotency"),
        Field(NUMBER, name="trigger"),
        Field(name="delivered"),
        Field(FLAG, False, name="acknowledgement"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Message",
        abstract="What the user left for the agent, or the agent for the user",
        help="A message is read once by the other side and processed part by part; what each part became is written on it.",
    )
    moments = ("created", "completed", REQUESTED, REVISED, COMMISSIONED)
    deduplicates = True
    filters = ()
    created_in_viewer = False
    answer_command = "reply"
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "message"
    event_labels = {"created": "Message", "completed": "Message closed", "updated.read": "Message read", "updated.process": "Message part filed",
                    "updated.edit": "Message edited", "updated.file": "Message file filed"}
    icon = "mail"
    listed_under = RESULTS
    stamped_when_notified = True
    cleared_by = OPENED
    command_names = {"complete": "processed"}


@dataclass(frozen=True)
class MergeWait(Loaded):
    how: str = ""
    worktree: str = ""

    def to_json(self) -> dict:
        return asdict(self)


class Todo(Ranked, Placed, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="status"),
        Field(name="work"),
        Field(default="", name="assigned"),
        Field(default="", name="handed"),
        Field(name="blocked"),
        Field(name="reported"),
        Field(name="pending"),
        Field(default=list, name="after"),
        Field(name="struck"),
        Field(FLAG, False, name="hidden"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="To-do",
        abstract="One thing to do later, with a brief that says why and where to start",
        help="A to-do waits on the list until it is started as work and closed; auto mode works the list in order.",
    )
    indexed = ("hidden", "assigned", "status", WHOM)
    hidden_listed = False
    listed_open = True
    type = "todo"
    held, eager = None, True
    event_labels = {"created": "To-do created", "completed": "To-do closed", "updated.read": "To-do read", "updated.assign": "To-do assigned",
                    "updated.report": "To-do reported", "updated.block": "To-do blocked", "updated.unblock": "To-do unblocked",
                    "updated.after": "To-do waits on another", "updated.priority": "To-do priority set", "updated.start": "To-do started"}
    start_heading = "TO-DOS ready to take — delayed work, not an instruction to start any of it"
    start_as_count = True
    icon = "ring"
    listed_under = SIDEBAR
    command_names = {"complete": "done"}
    labels = {"outcome": "How"}

    @property
    def merge_wait(self) -> MergeWait:
        return MergeWait.from_json(self.pending)


class Work(Traced, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(default=0, name="todo"),
        Field(name="status"),
        Field(name="parked"),
        Field(default="", name="awaiting"),
        Field(default=0, name="awaiting_since"),
        Field(default="", name="awaiting_on"),
        Field(default=0, name="logged"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Work",
        abstract="What the agent is doing right now, declared before its first write",
        help="Work is opened by the agent, updated as it moves and ended when done; the agent that opened it has seen it.",
    )
    type = "work"
    held, eager = None, True
    indexed = ("todo",)
    event_labels = {"created": "Work started", "sectioned": "Work logged", "completed": "Work closed"}
    status_labels = {"create": "starting", "complete": "ending"}
    start_heading = "STILL OPEN, from this or an earlier session"
    icon = "play"
    notified = (USER,)
    command_names = {"complete": "end", "create": "start"}
    in_sidebar = False

    @property
    def is_self_clearing(self) -> bool:
        return bool(self.awaiting) and not self.awaiting_on


class Doc(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="status"),
        Field(default=0, name="revisions"),
        Field(default=0, name="open_until"),
        Field(default=False, name="written"),
        Field(default=False, name="hidden"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Document",
        abstract="What stays true about the project, catalogued for every session",
        help="A doc is written once, cited by facts and rules, and read before anything it settles is re-investigated.",
    )
    held = 32
    own_folder = True
    type = "doc"
    summary_in_dashboard = True
    event_labels = {"created": "Doc written", "completed": "Doc closed"}
    status_labels = {"complete": "settling"}
    start_heading = "docs in the project; none is listed here, so look one up when a question needs it: journal doc search <term>, journal doc all"
    start_as_count = True
    subagent_writable = False
    needs_attention = True
    icon = "file"
    listed_under = SIDEBAR
    command_names = {"complete": "final"}
    scope = PROJECT
    view = DOCUMENT
    indexed = ("hidden", "proposed_for")
    filters = ()


class Report(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, "", name="kind"),
        Field(NUMBER, 0, name="number"),
        Field(NUMBER, 0, name="since"),
        Field(NUMBER, 0, name="until"),
        Field(rows(section=TEXT, ref=TEXT, title=TEXT, note=TEXT), list, name="items"),
        Field(FLAG, False, name="dismissed"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Report",
        abstract="What was checked and what was found, written for the user, read once",
        help="A report answers something the user asked to have checked; it ages out or becomes a doc.",
    )
    held = 32
    type = "report"
    summary_in_dashboard = True
    event_labels = {"created": "Report written", "completed": "Report closed"}
    status_labels = {"complete": "archiving"}
    needs_attention = True
    icon = "report"
    listed_under = RESULTS
    command_names = {"complete": "archive"}
    closed_first = True
    view = DOCUMENT
    filters = (OPEN, UPDATES, CLOSED)
    indexed = ("kind", "number", "until")
    formatted_data = {"items": ("title", "note")}


class Fact(Reasoned, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Fact",
        abstract="Something true about this environment that a later session would get wrong without",
        help="A fact is handed to every session on its environment; it is struck when it stops being true.",
    )
    type = "fact"
    event_labels = {"created": "Fact noted", "completed": "Fact closed"}
    status_labels = {"complete": "striking"}
    start_heading = "FACTS about this environment"
    subagent_writable = False
    needs_attention = True
    lists_completed_unread = True
    icon = "pin"
    listed_under = RESULTS
    command_names = {"complete": "strike"}


class Rule(Reasoned, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(FLAG, name="injected"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Rule",
        abstract="A ruling that binds every environment of the project",
        help="A rule is decided by the user, cited where it applies, and struck only by them.",
    )
    type = "rule"
    indexed = ("proposed_for",)
    event_labels = {"created": "Rule made", "completed": "Rule closed"}
    status_labels = {"complete": "striking"}
    start_heading = "RULES, in force on every environment"
    subagent_writable = False
    needs_attention = True
    lists_completed_unread = True
    icon = "list"
    command_names = {"complete": "strike"}
    scope = PROJECT


class Reminder(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="whom"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Reminder",
        abstract="An instruction said again until it is retired",
        help="A reminder is repeated to the agent at each start and every so often while it works.",
    )
    type = "reminder"
    event_labels = {"created": "Reminder set", "completed": "Reminder closed"}
    status_labels = {"complete": "retiring"}
    start_heading = "REMINDERS, said again at every stop"
    needs_attention = True
    icon = "clock"
    listed_under = RESULTS
    command_names = {"complete": "retire"}


class Question(Options, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, "", name="reason"),
        Field(FLAG, False, name="hidden"),
        Field(FLAG, False, name="final"),
        Field(FLAG, False, name="dismissed"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Question",
        abstract="Something the agent asks the user, with choices to pick",
        help="A question waits for the user; its answer reaches the agent as an event.",
    )
    listed_open = True
    type = "question"
    event_labels = {"created": "Question asked", "completed": "Question closed"}
    status_labels = {"create": "asking", "complete": "answering"}
    needs_attention = True
    cleared_by = COMPLETED
    in_sidebar = False
    icon = "help"
    command_names = {"complete": "answer", "create": "ask"}
    labels = {"outcome": "Answer", "abstract": "Context"}
    indexed = ("hidden",)
    hidden_listed = False
    listed_beneath = True


class Suggestion(Options, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="decision"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Suggestion",
        abstract="A change the agent proposes unasked; the user accepts, adjusts or declines it, and nothing waits",
        help="Accepting or adjusting files a to-do from it; a decline is a ruling the agent does not propose again.",
    )
    listed_open = True
    type = "suggestion"
    agent_only = True
    created_in_viewer = False
    event_labels = {"created": "Suggestion made", "completed": "Suggestion closed"}
    status_labels = {"create": "suggesting", "complete": "deciding", "delete": "withdrawing"}
    start_heading = "SUGGESTIONS waiting on the user"
    needs_attention = True
    cleared_by = COMPLETED
    icon = "bulb"
    listed_under = SIDEBAR
    command_names = {"complete": "decide", "create": "suggest", "delete": "withdraw"}
    labels = {"outcome": "Decision", "brief": "Why"}


class Comment(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Comment",
        abstract="What the user or the agent said about another resource",
        help="A comment is a resource of its own, linked to what it is about.",
    )
    deduplicates = True
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "comment"
    event_labels = {"created": "Comment", "completed": "Comment closed"}
    nested = True
    icon = "bubble"
    command_names = {"complete": "done", "comment": "reply"}
    in_sidebar = False


STOPPED, IDLE, BUSY, WORKING, COMPACTING = "stopped", "idle", "busy", "working", "compacting"
STATES = (STOPPED, IDLE, BUSY, WORKING, COMPACTING)
FAILED = "failed"
AT_REST = (STOPPED, IDLE)
SUBAGENT = "subagent"
HELPER = "helper"
RUN_KINDS = ("shell_rows", "subagent_rows", "monitor_rows")


class AgentRow(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="status"),
        Field(default="", name="event"),
        Field(default="", name="tool"),
        Field(default="", name="file"),
        Field(name="wrote"),
        Field(FLAG, False, name="turn_wrote"),
        Field(default="", name="cwd", journal_only=True),
        Field(default=0, name="at"),
        Field(default="", name="provider", journal_only=True),
        Field(default=0, name="uses"),
        Field(default="", name="transcript", journal_only=True),
        Field(default="", name="inbox", journal_only=True),
        Field(default="", name="model", journal_only=True),
        Field(default="", name="effort"),
        Field(default=dict, name="pending"),
        Field(default=0, name="paused"),
        Field(default="", name="paused_for"),
        Field(default=dict, name="asking"),
        Field(default="", name="last_message"),
        Field(default="", name="doing"),
        Field(default="", name="prompted"),
        Field(default=0, name="person_at"),
        Field(default=list, name="delivered"),
        Field(default="", name="failure"),
        Field(default=0, name="started"),
        Field(default=0, name="context"),
        Field(default=dict, name="usage"),
        Field(default=list, name="skills"),
        Field(default=list, name="skill_loads"),
        Field(default=list, name="compactions"),
        Field(default=list, name="whispers"),
        Field(default=list, name="cards"),
        Field(default=0, name="shells"),
        Field(default=0, name="subagents"),
        Field(default=list, name="shell_rows"),
        Field(default=list, name="subagent_rows"),
        Field(default=dict, name="announced"),
        Field(default=dict, name="loops"),
        Field(default=0, name="monitors"),
        Field(default=list, name="monitor_rows"),
        Field(default="", name="parent"),
        Field(default=list, name="touched_files"),
        Field(FLAG, False, name="compacting"),
        Field(default=dict, name="running"),
        Field(default=dict, name="step"),
        Field(default=list, name="commands"),
        Field(default=list, name="queued_commands"),
        Field(default=dict, name="subagent_reports"),
        Field(name="branch"),
        Field(name="branch_url"),
        Field(default=0, name="active"),
        Field(name="decided"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Agent",
        abstract="A session of Claude or Codex, and what it is doing right now",
        help="The journal watches what the agent reports and tells whether it is idle, busy, working, or has shortened its conversation.",
    )
    type = "agent"
    held, eager = None, True
    indexed = ("parent", "at")
    takes_comments = False
    formatted_data = {"cards": ("label", "detail"), "subagent_rows": ("task",), "thoughts": ("text",)}
    event_labels = {"reported": "Agent reported", "heard": "Agent heard the journal", "updated": "Agent updated"}
    icon = "bot"
    in_sidebar = False
    notified = ()

    @property
    def quiet_for(self) -> float:
        return time.time() - float(self.at)

    @property
    def idle_for(self) -> float:
        return self.quiet_for if self.status == IDLE else 0.0

    @property
    def subagent(self) -> bool:
        return bool(self.dispatcher or self.parent)

    @property
    def live(self) -> bool:
        return bool(self.status) and self.status != STOPPED

    @property
    def runs(self) -> list[dict]:
        return [entry for kind in RUN_KINDS for entry in self.data.get(kind) or []]

    @property
    def command_running(self) -> bool:
        return bool(self.running and self.running.get("command") and not self.running.get("done"))

    @property
    def command_running_for(self) -> float:
        return time.time() - float(self.running["at"]) if self.command_running else 0.0

    @property
    def background_run(self) -> str:
        return next((entry.get("task") or entry.get("command") or "a background run" for entry in self.runs if entry.get("running")), "")


class Notification(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Notification",
        abstract="Something the user should hear about, told to them once",
        help="A notification is for the user: an update that landed, a plugin that installed, a setting the agent changed. The agent's own acts are not notifications; they are read in the activity.",
    )
    type = "notification"
    takes_comments = False
    event_labels = {"completed": "Notification closed", "updated.read": "Notification read"}
    kept = 100
    pruned_when = Pruned.SEEN
    needs_attention = True
    icon = "bell"
    in_sidebar = False
    notified = ()


class Notice(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Notice",
        abstract="One line pinned to the chat while it matters",
        help="A notice stays until you close it or the agent closes it. It can have a colour and a link.",
    )
    type = "notice"
    takes_comments = False
    kept = 100
    pruned_when = Pruned.CLOSED
    event_labels = {"created": "Notice", "completed": "Notice closed", "updated.read": "Notice read"}
    icon = "band"
    command_names = {"complete": "close"}
    in_sidebar = False
    notified = (USER,)


class Reaction(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="face"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Reaction",
        abstract="A face on a message",
        help="A reaction is one face by one actor on one message; the same face again takes it off.",
    )
    type = "reaction"
    takes_comments = False
    nested = True
    icon = "smile"
    in_sidebar = False
    typed_as_title = True

    def agent_line(self) -> str:
        on = ", ".join(ref.replace(":", " ") for ref in self.refs)
        return (f"the user put {self.title} on {on}. Act on it if it asks for something, such as a go-ahead. It needs no written reply; "
                f"when it answers a message of the user's own, react to that message in turn. The chat never mentions it")


class Tool(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Tool",
        abstract="A script kept for a job that comes back, catalogued so the next agent runs it instead of writing it again",
        help="A tool names its entry (how to run it), its usage and what it does; run executes it from the project root.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="entry", runs_commands=True),
        Field(TEXT, name="usage"),
    ]
    type = "tool"
    indexed = ("proposed_for",)
    listed_as_cards = True
    subagent_writable = False
    icon = "wrench"
    scope = PROJECT




class Plugin(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Plugin",
        abstract="A repository installed into the journal: it hears the bus, answers, and may run services of its own",
        help="Installed from a GitHub URL or a local path, fixed at one exact version; its manifest says what it listens to, what it runs and which pages it shows.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="source", runs_commands=True),
        Field(TEXT, name="revision"),
        Field(TEXT, name="commit"),
        Field(TEXT, name="version"),
        Field(FLAG, name="linked"),
        Field(FLAG, name="enabled"),
        Field(name="manifest", runs_commands=True),
        Field(name="update"),
        Field(name="settings", runs_commands=True),
        Field(name="token"),
        Field(NUMBER, 0.0, name="read_at"),
    ]
    light_in_dashboard = {"manifest": ("name", "version", "title", "description", "dashboards")}
    type = "plugin"
    event_labels = {"created": "Plugin installed", "completed": "Plugin closed"}
    status_labels = {"complete": "removing"}
    subagent_writable = False
    in_sidebar = False
    icon = "plug"
    command_names = {"complete": "remove"}
    scope = PROJECT


class EnvironmentKind(StrEnum):
    """Who works in an environment; only a main one is listed for the user to work in."""
    MAIN = "main"
    HELPER = "helper"
    SUBAGENT = "subagent"
    TICKET = "ticket"

    @classmethod
    def owned_by(cls, owner: str) -> "EnvironmentKind":
        """The kind an environment has from its owner: a helper's, a subagent's (a to-do's), a ticket's, or main when nobody owns it."""
        if not owner:
            return cls.MAIN
        return {"helper": cls.HELPER, "todo": cls.SUBAGENT}.get(owner.split(":")[0], cls.TICKET)


class Environment(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Environment",
        abstract="One line of work with its own record: messages, to-dos, facts, plans, settings",
        help="An agent works in one environment at a time. It can switch to a free one, or claim a taken one by giving a reason.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, "", name="owner", journal_only=True), Field(TEXT, "", name="launched_from", journal_only=True), Field(NUMBER, 0, name="launched"),
        Field(TEXT, "", name="folder", journal_only=True), Field(TEXT, "", name="kind", journal_only=True),
    ]
    indexed = ("owner",)
    listed_open = True
    type = "environment"
    held, eager = None, True
    event_labels = {"created": "Environment prepared", "completed": "Environment closed"}
    status_labels = {"create": "preparing", "complete": "removing"}
    subagent_writable = False
    icon = "branch"
    command_names = {"create": "prepare", "complete": "remove"}
    scope = PROJECT
    in_sidebar = False
    notified = ()

    @property
    def helping(self) -> bool:
        return self.kind == EnvironmentKind.HELPER

    def is_main(self) -> bool:
        return self.kind == EnvironmentKind.MAIN

    def is_ticket(self) -> bool:
        return self.kind == EnvironmentKind.TICKET

    def owned_by(self, kind: str) -> int:
        return int(self.owner.split(":")[1]) if self.owner.startswith(f"{kind}:") else 0

    def checkout(self, project: Path) -> Path:
        own = Path(self.folder) if self.folder else project
        return own if own.is_dir() else project


class Ask(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="op"),
        Field(default=list, name="args"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Browser request",
        abstract="What the agent asks of the tab the user is driving — a picture, its text, a click — answered by the extension",
        help="Asks the browser tab for a screenshot, its text or a click. Turn on control in the chat window's bar.",
    )
    held = 32
    type = "browser"
    takes_comments = False
    kept = 50
    pruned_when = Pruned.CLOSED
    nested = True
    icon = "open"
    in_sidebar = False
    notified = ()


class FeatureRow(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(FLAG, True, name="enabled"),
        Field(FLAG, False, name="missing"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Feature",
        abstract="A built-in part of the journal that can be switched on or off",
        help="One row per feature the engine finds, carrying whether it is on. A row whose file is gone stays, switched off.",
    )
    type = "feature"
    takes_comments = False
    icon = "dot"
    in_sidebar = False
    notified = ()


class Nudge(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(name="private"),
        Field(name="session"),
        Field(default="", name="asks"),
        Field(default=list, name="until"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Agent instruction",
        abstract="A short instruction the journal sends the agent by itself; you never see it in the chat.",
        help="A nudge is written by a feature and spoken to the agent as it is; the user never hears it.",
    )
    held = 32
    type = "nudge"
    takes_comments = False
    kept = 100
    notify_actions = ("created",)
    addressed_to_agent = True
    nested = True
    icon = "arrow"
    in_sidebar = False
    notified = (AGENT,)
    typed_as_title = True



def register(*classes) -> None:
    TYPES.update({c.type: c for c in classes})


TYPES = {c.type: c for c in (Message, Todo, Work, Doc, Report, Fact, Rule, Reminder, Question, Suggestion, Comment, AgentRow, Notification, Notice, Reaction, Tool, Plugin, Environment, Ask, Nudge, FeatureRow)}
LISTED = ("message", "question", "suggestion", "comment", "plan", "todo", "report", "doc", "fact", "rule", "reminder", "notice", "reaction", "tool", "plugin", "environment", "work", "agent", "notification", "browser", "nudge", "feature")


def ref_named(text: str) -> Ref:
    """A row named as type:number, or the way a person writes it: to-do 12, doc 4."""
    if ":" in text:
        return Ref.parse(text)
    name, _, n = text.strip().rpartition(" ")
    kind = next((key for key, kind in TYPES.items() if name.lower() in (key, kind.details.title.lower())), "")
    if not kind or not n.isdigit():
        raise Refused(f"{text!r} names no item: write it like to-do 12 or doc 4")
    return Ref(kind, int(n))


def priority() -> list[str]:
    return [*LISTED, *(name for name in TYPES if name not in LISTED)]
