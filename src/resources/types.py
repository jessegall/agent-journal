from typing import ClassVar

from resources.base import AGENT, COMPLETED, DOCUMENT, LAZY, OPENED, PROJECT, SYSTEM, USER, Resource, ResourceDetails
from resources.shapes import FLAG, TEXT, Field, Options, Ranked, Reasoned, Shape, Traced, names


class Message(Shape, Resource):
    deduplicates = True
    filters = ()
    created_in_viewer = False
    indexed = ("idempotency",)
    answer_command = "reply"
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "message"
    event_labels = {"created": "Message", "completed": "Message processed", "updated.read": "Message read", "updated.process": "Message part filed",
                    "updated.edit": "Message edited", "updated.file": "Message file filed"}
    icon = "mail"
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="idempotency"),
        Field(name="delivered"),
    ]
    stamped_when_notified = True
    cleared_by = OPENED
    command_names = {"complete": "processed"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Message",
        abstract="What the user left for the agent, or the agent for the user",
        help="A message is read once by the other side and processed part by part; what each part became is written on it.",
    )


class Todo(Ranked, Resource):
    listed_open = True
    type = "todo"
    event_labels = {"created": "To-do created", "completed": "To-do done", "updated.read": "To-do read", "updated.assign": "To-do assigned",
                    "updated.report": "To-do reported", "updated.block": "To-do blocked", "updated.unblock": "To-do unblocked",
                    "updated.after": "To-do waits on another", "updated.priority": "To-do priority set", "updated.start": "To-do started"}
    data_fields: ClassVar[list[Field]] = [
        Field(name="status"),
        Field(name="work"),
        Field(name="assigned"),
        Field(name="blocked"),
        Field(name="reported"),
        Field(name="after"),
        Field(name="struck"),
    ]
    start_heading = "TO-DOS waiting — delayed work, not an instruction to start any of it"
    start_as_count = True
    icon = "circle"
    command_names = {"complete": "done"}
    labels = {"outcome": "How"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="To-do",
        abstract="One thing to do later, with a brief that says why and where to start",
        help="A to-do waits on the list until it is started as work and closed; auto mode works the list in order.",
    )


class Work(Traced, Resource):
    type = "work"
    event_labels = {"created": "Work started", "sectioned": "Work logged", "completed": "Work ended"}
    status_labels = {"create": "starting", "complete": "ending"}
    data_fields: ClassVar[list[Field]] = [
        Field(name="todo"),
        Field(name="status"),
        Field(name="parked"),
        Field(default="", name="awaiting"),
        Field(default=0, name="awaiting_since"),
    ]
    start_heading = "STILL OPEN, from this or an earlier session"
    icon = "play"
    notified = (USER,)
    command_names = {"complete": "end", "create": "start"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Work",
        abstract="What the agent is doing right now, declared before its first write",
        help="Work is opened by the agent, updated as it moves and ended when done; the agent that opened it has seen it.",
    )
    in_sidebar = False


class Doc(Shape, Resource):
    loading = LAZY
    own_folder = True
    type = "doc"
    event_labels = {"created": "Doc written", "completed": "Doc settled"}
    status_labels = {"complete": "settling"}
    data_fields: ClassVar[list[Field]] = [
        Field(name="status"),
    ]
    start_heading = "docs in the project; none is listed here, so look one up when a question needs it: journal doc search <term>, journal doc all"
    start_as_count = True
    subagent_writable = False
    needs_attention = True
    icon = "file"
    command_names = {"complete": "final"}
    scope = PROJECT
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Document",
        abstract="What stays true about the project, catalogued for every session",
        help="A doc is written once, cited by facts and rules, and read before anything it settles is re-investigated.",
    )
    view = DOCUMENT
    indexed = ("hidden",)


class Report(Shape, Resource):
    loading = LAZY
    type = "report"
    event_labels = {"created": "Report written", "completed": "Report archived"}
    status_labels = {"complete": "archiving"}
    needs_attention = True
    icon = "report"
    command_names = {"complete": "archive"}
    closed_first = True
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Report",
        abstract="What was checked and what was found, written for the user, read once",
        help="A report answers something the user asked to have checked; it ages out or becomes a doc.",
    )
    view = DOCUMENT


class Fact(Reasoned, Resource):
    type = "fact"
    event_labels = {"created": "Fact noted", "completed": "Fact struck"}
    status_labels = {"complete": "striking"}
    start_heading = "FACTS about this environment"
    subagent_writable = False
    needs_attention = True
    lists_completed_unread = True
    icon = "pin"
    command_names = {"complete": "strike"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Fact",
        abstract="Something true about this environment that a later session would get wrong without",
        help="A fact is handed to every session on its environment; it is struck when it stops being true.",
    )


class Rule(Reasoned, Resource):
    type = "rule"
    event_labels = {"created": "Rule made", "completed": "Rule struck"}
    status_labels = {"complete": "striking"}
    data_fields: ClassVar[list[Field]] = [
        Field(FLAG, name="injected"),
    ]
    start_heading = "RULES, in force on every environment"
    subagent_writable = False
    needs_attention = True
    lists_completed_unread = True
    icon = "list"
    command_names = {"complete": "strike"}
    scope = PROJECT
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Rule",
        abstract="A ruling that binds every environment of the project",
        help="A rule is decided by the user, cited where it applies, and struck only by them.",
    )


class Reminder(Shape, Resource):
    type = "reminder"
    event_labels = {"created": "Reminder set", "completed": "Reminder retired"}
    status_labels = {"complete": "retiring"}
    start_heading = "REMINDERS, said again at every stop"
    data_fields: ClassVar[list[Field]] = [
        Field(name="whom"),
    ]
    needs_attention = True
    icon = "clock"
    command_names = {"complete": "retire"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Reminder",
        abstract="An instruction said again until it is retired",
        help="A reminder repeats at every start and every so often mid-work, because knowing is not doing. One written with --set whom=<session> is said to that agent alone, which is how an agent reminds itself or leaves one for another.",
    )


class Question(Options, Resource):
    listed_open = True
    type = "question"
    event_labels = {"created": "Question asked", "completed": "Question answered"}
    status_labels = {"create": "asking", "complete": "answering"}
    needs_attention = True
    cleared_by = COMPLETED
    in_sidebar = False
    icon = "help"
    command_names = {"complete": "answer", "create": "ask"}
    labels = {"outcome": "Answer", "abstract": "Context"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Question",
        abstract="Something the agent asks the user, with choices to pick",
        help="A question waits for the user; its answer reaches the agent as an event.",
    )


class Suggestion(Options, Resource):
    listed_open = True
    type = "suggestion"
    event_labels = {"created": "Suggestion made", "completed": "Suggestion decided"}
    status_labels = {"create": "suggesting", "complete": "deciding", "delete": "withdrawing"}
    data_fields: ClassVar[list[Field]] = [
        Field(name="decision"),
    ]
    start_heading = "SUGGESTIONS waiting on the user"
    needs_attention = True
    cleared_by = COMPLETED
    icon = "up"
    command_names = {"complete": "decide", "create": "suggest", "delete": "withdraw"}
    labels = {"outcome": "Decision", "brief": "Why"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Suggestion",
        abstract="A change the agent proposes unasked; the user accepts, adjusts or declines it, and nothing waits",
        help="Accepting or adjusting files a to-do from it; a decline is a ruling the agent does not propose again.",
    )


class Comment(Shape, Resource):
    deduplicates = True
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "comment"
    event_labels = {"created": "Comment", "completed": "Comment done"}
    nested = True
    icon = "bubble"
    command_names = {"complete": "done"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Comment",
        abstract="What the user or the agent said about another resource",
        help="A comment is a resource of its own, linked to what it is about.",
    )
    in_sidebar = False


class AgentRow(Shape, Resource):
    type = "agent"
    event_labels = {"reported": "Agent reported", "updated": "Agent updated"}
    data_fields: ClassVar[list[Field]] = [
        Field(name="status"),
        Field(name="event"),
        Field(name="tool"),
        Field(name="file"),
        Field(name="wrote"),
        Field(name="cwd"),
        Field(default=0, name="at"),
        Field(default="", name="provider"),
        Field(default=0, name="uses"),
        Field(default="", name="transcript"),
        Field(default="", name="inbox"),
        Field(default="", name="model"),
        Field(default="", name="effort"),
        Field(default=dict, name="pending"),
        Field(default=dict, name="asking"),
        Field(default="", name="last_message"),
        Field(name="started"),
        Field(default=0, name="context"),
        Field(default=dict, name="usage"),
        Field(default=list, name="skills"),
        Field(default=list, name="skill_loads"),
        Field(default=list, name="compactions"),
        Field(default=list, name="whispers"),
        Field(default=0, name="shells"),
        Field(default=0, name="subagents"),
        Field(default=list, name="shell_rows"),
        Field(default=list, name="subagent_rows"),
        Field(default=0, name="monitors"),
        Field(default=list, name="monitor_rows"),
        Field(default="", name="parent"),
        Field(FLAG, False, name="subagent"),
        Field(FLAG, False, name="compacting"),
        Field(default=dict, name="running"),
        Field(default=list, name="commands"),
        Field(name="branch"),
        Field(name="branch_url"),
        Field(name="active"),
        Field(name="decided"),
    ]
    icon = "bot"
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Agent",
        abstract="A session of Claude or Codex, and what it is doing right now",
        help="The hooks report activity; the engine distinguishes idle, busy, declared work and compaction.",
    )
    in_sidebar = False
    notified = ()


class Notification(Shape, Resource):
    type = "notification"
    kept = 100
    pruned_when = "seen"
    needs_attention = True
    icon = "bell"
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Notification",
        abstract="Something the user should hear about, told to them once",
        help="A notification is for the user: an update that landed, a plugin that installed, a setting the agent changed. The agent's own acts are not notifications; they are read in the activity.",
    )
    in_sidebar = False
    notified = ()


class Notice(Shape, Resource):
    type = "notice"
    kept = 100
    pruned_when = "closed"
    event_labels = {"created": "Notice", "completed": "Notice closed"}
    icon = "band"
    command_names = {"complete": "close"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Notice",
        abstract="One line kept over the chat while it matters",
        help="A notice stays until the user's X or the agent's close; a tone and a link may ride on it.",
    )
    in_sidebar = False
    notified = (USER,)


class Reaction(Shape, Resource):
    type = "reaction"
    data_fields: ClassVar[list[Field]] = [
        Field(name="face"),
    ]
    nested = True
    icon = "smile"
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Reaction",
        abstract="A face on a message",
        help="A reaction is one face by one actor on one message; the same face again takes it off.",
    )
    in_sidebar = False
    typed_as_title = True

    def agent_line(self) -> str:
        on = ", ".join(ref.replace(":", " ") for ref in self.refs)
        return f"the user put {self.title} on {on} - act on it if it asks for something, such as a go-ahead. It needs no reply, and the chat never mentions it"


class Tool(Shape, Resource):
    type = "tool"
    listed_as_cards = True
    subagent_writable = False
    icon = "wrench"
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Tool",
        abstract="A script kept for a job that comes back, catalogued so the next agent runs it instead of writing it again",
        help="A tool names its entry (how to run it), its usage and what it does; run executes it from the project root.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="entry"),
        Field(TEXT, name="usage"),
    ]
    scope = PROJECT


class Connection(Shape, Resource):
    type = "connection"
    subagent_writable = False
    icon = "plug"
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Connection",
        abstract="A service the project can reach, and which variable holds its token",
        help="Never the token itself: the name of the variable that holds it.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="variable"),
    ]
    scope = PROJECT


class Plugin(Shape, Resource):
    type = "plugin"
    event_labels = {"created": "Plugin installed", "completed": "Plugin removed"}
    status_labels = {"complete": "removing"}
    subagent_writable = False
    in_sidebar = False
    icon = "plug"
    command_names = {"complete": "remove"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Plugin",
        abstract="A repository installed into the journal: it hears the bus, answers, and may run services of its own",
        help="Installed from a GitHub URL or a local path, pinned to a commit; its manifest says what it listens to, what it runs and which pages it shows.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="source"),
        Field(TEXT, name="revision"),
        Field(TEXT, name="commit"),
        Field(TEXT, name="version"),
        Field(FLAG, name="linked"),
        Field(FLAG, name="enabled"),
        Field(name="manifest"),
        Field(name="settings"),
        Field(name="token"),
    ]
    scope = PROJECT


class Environment(Shape, Resource):
    type = "environment"
    event_labels = {"created": "Environment prepared", "completed": "Environment removed"}
    status_labels = {"create": "preparing", "complete": "removing"}
    subagent_writable = False
    icon = "branch"
    command_names = {"create": "prepare", "complete": "remove"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Environment",
        abstract="One line of work with its own record: messages, to-dos, facts, plans, settings",
        help="A session works one environment at a time; switch takes one that is free, claim takes a held one with a reason.",
    )
    scope = PROJECT
    in_sidebar = False
    notified = ()


class Ask(Shape, Resource):
    loading = LAZY
    type = "browser"
    kept = 50
    pruned_when = "closed"
    data_fields: ClassVar[list[Field]] = [
        Field(name="op"),
        Field(default=list, name="args"),
    ]
    nested = True
    icon = "open"
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Browser ask",
        abstract="What the agent asks of the tab the user is driving — a picture, its text, a click — answered by the extension",
        help="journal browser ask shot|url|text|dom|console|click <selector>|type <selector> <words>|goto <url>|eval <js>|scroll top|bottom|<selector>; the user turns driving on in the chat window's bar.",
    )
    in_sidebar = False
    notified = ()


class FeatureRow(Shape, Resource):
    type = "feature"
    icon = "dot"
    in_sidebar = False
    data_fields: ClassVar[list[Field]] = [
        Field(FLAG, True, name="enabled"),
        Field(FLAG, False, name="missing"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Feature",
        abstract="A capability the engine loads, with its switch",
        help="One row per feature the engine finds, carrying whether it is on. A row whose file is gone stays, switched off.",
    )
    notified = ()


class Nudge(Shape, Resource):
    loading = LAZY
    type = "nudge"
    kept = 100
    notify_actions = ("created",)
    addressed_to_agent = True
    data_fields: ClassVar[list[Field]] = [
        Field(name="private"),
        Field(name="session"),
    ]
    nested = True
    icon = "arrow"
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Nudge",
        abstract="A line a feature has the engine type to the agent",
        help="A nudge is written by a feature and spoken to the agent as it is; the user never hears it.",
    )
    in_sidebar = False
    notified = (AGENT,)
    typed_as_title = True


RUNNING = names("what", "tool", "at", "done", "changed", "files", "made", "effect", "result", "before")
COMMAND = names("what", "tool", "at", "effect", "subject", "done", "result", "files", "made", "changed")

def register(*classes) -> None:
    TYPES.update({c.type: c for c in classes})


TYPES = {c.type: c for c in (Message, Todo, Work, Doc, Report, Fact, Rule, Reminder, Question, Suggestion, Comment, AgentRow, Notification, Notice, Reaction, Tool, Connection, Plugin, Environment, Ask, Nudge, FeatureRow)}
LISTED = ("message", "question", "suggestion", "comment", "plan", "todo", "report", "doc", "fact", "rule", "reminder", "notice", "reaction", "tool", "connection", "plugin", "environment", "work", "agent", "notification", "browser", "nudge", "feature")


def priority() -> list[str]:
    return [*LISTED, *(name for name in TYPES if name not in LISTED)]
