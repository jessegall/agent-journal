from typing import ClassVar

from resources.base import AGENT, COMPLETED, DOCUMENT, LAZY, OPENED, PROJECT, SYSTEM, USER, Resource
from resources.shapes import FLAG, TEXT, Field, Options, Ranked, Reasoned, Shape, Traced, names


class Message(Shape, Resource):
    deduplicates = True
    indexed = ("idempotency",)
    answer_command = "reply"
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "message"
    event_labels = {"created": "Message", "completed": "Message processed"}
    icon = "mail"
    idempotency: ClassVar[Field] = Field(TEXT)
    delivered: ClassVar[Field] = Field()
    stamped_when_told = True
    cleared_by = OPENED
    command_names = {"complete": "processed"}
    title_ = "Message"
    abstract_ = "What the user left for the agent, or the agent for the user"
    help_ = "A message is read once by the other side and processed part by part; what each part became is written on it."


class Todo(Ranked, Resource):
    type = "todo"
    event_labels = {"created": "To-do created", "completed": "To-do done"}
    status: ClassVar[Field] = Field()
    work: ClassVar[Field] = Field()
    assigned: ClassVar[Field] = Field()
    blocked: ClassVar[Field] = Field()
    reported: ClassVar[Field] = Field()
    after: ClassVar[Field] = Field()
    struck: ClassVar[Field] = Field()
    start_heading = "TO-DOS waiting — delayed work, not an instruction to start any of it"
    start_as_count = True
    icon = "circle"
    command_names = {"complete": "done"}
    labels = {"outcome": "How"}
    title_ = "To-do"
    abstract_ = "One thing to do later, with a brief that says why and where to start"
    help_ = "A to-do waits on the list until it is started as work and closed; auto mode works the list in order."


class Work(Traced, Resource):
    type = "work"
    event_labels = {"created": "Work started", "sectioned": "Work logged", "completed": "Work ended"}
    status_labels = {"create": "starting", "complete": "ending"}
    todo: ClassVar[Field] = Field()
    status: ClassVar[Field] = Field()
    parked: ClassVar[Field] = Field()
    start_heading = "STILL OPEN, from this or an earlier session"
    icon = "play"
    notified = (USER,)
    command_names = {"complete": "end", "create": "start"}
    title_ = "Work"
    abstract_ = "What the agent is doing right now, declared before its first write"
    help_ = "Work is opened by the agent, updated as it moves and ended when done; the agent that opened it has seen it."
    in_sidebar = False


class Doc(Shape, Resource):
    loading = LAZY
    type = "doc"
    event_labels = {"created": "Doc written", "completed": "Doc settled"}
    status_labels = {"complete": "settling"}
    status: ClassVar[Field] = Field()
    start_heading = "DOCS catalogued — read one before you re-investigate what it settles"
    subagent_writable = False
    needs_attention = True
    icon = "file"
    command_names = {"complete": "final"}
    scope = PROJECT
    title_ = "Document"
    abstract_ = "What stays true about the project, catalogued for every session"
    help_ = "A doc is written once, cited by facts and rules, and read before anything it settles is re-investigated."
    view = DOCUMENT


class Report(Shape, Resource):
    loading = LAZY
    type = "report"
    event_labels = {"created": "Report written", "completed": "Report archived"}
    status_labels = {"complete": "archiving"}
    needs_attention = True
    icon = "report"
    command_names = {"complete": "archive"}
    closed_first = True
    title_ = "Report"
    abstract_ = "What was checked and what was found, written for the user, read once"
    help_ = "A report answers something the user asked to have checked; it ages out or becomes a doc."
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
    title_ = "Fact"
    abstract_ = "Something true about this environment that a later session would get wrong without"
    help_ = "A fact is handed to every session on its environment; it is struck when it stops being true."


class Rule(Reasoned, Resource):
    type = "rule"
    event_labels = {"created": "Rule made", "completed": "Rule struck"}
    status_labels = {"complete": "striking"}
    injected: ClassVar[Field] = Field(FLAG)
    start_heading = "RULES, in force on every environment"
    subagent_writable = False
    needs_attention = True
    lists_completed_unread = True
    icon = "list"
    command_names = {"complete": "strike"}
    scope = PROJECT
    title_ = "Rule"
    abstract_ = "A ruling that binds every environment of the project"
    help_ = "A rule is decided by the user, cited where it applies, and struck only by them."


class Reminder(Shape, Resource):
    type = "reminder"
    event_labels = {"created": "Reminder set", "completed": "Reminder retired"}
    status_labels = {"complete": "retiring"}
    start_heading = "REMINDERS, said again at every stop"
    whom: ClassVar[Field] = Field()
    needs_attention = True
    icon = "clock"
    command_names = {"complete": "retire"}
    title_ = "Reminder"
    abstract_ = "An instruction said again until it is retired"
    help_ = "A reminder repeats at every start and every so often mid-work, because knowing is not doing. One written with --set whom=<session> is said to that agent alone, which is how an agent reminds itself or leaves one for another."


class Question(Options, Resource):
    type = "question"
    event_labels = {"created": "Question asked", "completed": "Question answered"}
    status_labels = {"create": "asking", "complete": "answering"}
    needs_attention = True
    cleared_by = COMPLETED
    in_sidebar = False
    icon = "help"
    command_names = {"complete": "answer", "create": "ask"}
    labels = {"outcome": "Answer", "abstract": "Context"}
    title_ = "Question"
    abstract_ = "Something the agent asks the user, with choices to pick"
    help_ = "A question waits for the user; its answer reaches the agent as an event."


class Suggestion(Options, Resource):
    type = "suggestion"
    event_labels = {"created": "Suggestion made", "completed": "Suggestion decided"}
    status_labels = {"create": "suggesting", "complete": "deciding", "delete": "withdrawing"}
    decision: ClassVar[Field] = Field()
    start_heading = "SUGGESTIONS waiting on the user"
    needs_attention = True
    cleared_by = COMPLETED
    icon = "up"
    command_names = {"complete": "decide", "create": "suggest", "delete": "withdraw"}
    labels = {"outcome": "Decision", "brief": "Why"}
    title_ = "Suggestion"
    abstract_ = "A change the agent proposes unasked; the user accepts, adjusts or declines it, and nothing waits"
    help_ = "Accepting or adjusting files a to-do from it; a decline is a ruling the agent does not propose again."


class Comment(Shape, Resource):
    deduplicates = True
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "comment"
    event_labels = {"created": "Comment", "completed": "Comment done"}
    nested = True
    icon = "bubble"
    command_names = {"complete": "done"}
    title_ = "Comment"
    abstract_ = "What the user or the agent said about another resource"
    help_ = "A comment is a resource of its own, linked to what it is about."
    in_sidebar = False


class AgentRow(Shape, Resource):
    type = "agent"
    status: ClassVar[Field] = Field()
    event: ClassVar[Field] = Field()
    tool: ClassVar[Field] = Field()
    file: ClassVar[Field] = Field()
    wrote: ClassVar[Field] = Field()
    cwd: ClassVar[Field] = Field()
    at: ClassVar[Field] = Field(default=0)
    provider: ClassVar[Field] = Field(default="")
    uses: ClassVar[Field] = Field(default=0)
    transcript: ClassVar[Field] = Field(default="")
    inbox: ClassVar[Field] = Field(default="")
    model: ClassVar[Field] = Field(default="")
    effort: ClassVar[Field] = Field(default="")
    pending: ClassVar[Field] = Field(default=dict)
    asking: ClassVar[Field] = Field(default=dict)
    said: ClassVar[Field] = Field(default="")
    started: ClassVar[Field] = Field()
    context: ClassVar[Field] = Field(default=0)
    usage: ClassVar[Field] = Field(default=dict)
    skills: ClassVar[Field] = Field(default=list)
    shells: ClassVar[Field] = Field(default=0)
    subagents: ClassVar[Field] = Field(default=0)
    shell_rows: ClassVar[Field] = Field(default=list)
    subagent_rows: ClassVar[Field] = Field(default=list)
    parent: ClassVar[Field] = Field(default="")
    subagent: ClassVar[Field] = Field(FLAG, False)
    compacting: ClassVar[Field] = Field(FLAG, False)
    running: ClassVar[Field] = Field(default=dict)
    commands: ClassVar[Field] = Field(default=list)
    branch: ClassVar[Field] = Field()
    branch_url: ClassVar[Field] = Field()
    active: ClassVar[Field] = Field()
    decided: ClassVar[Field] = Field()
    icon = "bot"
    title_ = "Agent"
    abstract_ = "A session of Claude or Codex, and what it is doing right now"
    help_ = "The hooks report activity; the engine distinguishes idle, busy, declared work and compaction."
    in_sidebar = False
    notified = ()


class Notification(Shape, Resource):
    type = "notification"
    needs_attention = True
    icon = "bell"
    title_ = "Notification"
    abstract_ = "Something the user should hear about, told to them once"
    help_ = "A notification is for the user: an update that landed, a plugin that installed, a setting the agent changed. The agent's own acts are not notifications; they are read in the activity."
    in_sidebar = False
    notified = ()


class Notice(Shape, Resource):
    type = "notice"
    event_labels = {"created": "Notice", "completed": "Notice closed"}
    icon = "band"
    command_names = {"complete": "close"}
    title_ = "Notice"
    abstract_ = "One line kept over the chat while it matters"
    help_ = "A notice stays until the user's X or the agent's close; a tone and a link may ride on it."
    in_sidebar = False
    notified = (USER,)


class Reaction(Shape, Resource):
    type = "reaction"
    face: ClassVar[Field] = Field()
    nested = True
    icon = "smile"
    title_ = "Reaction"
    abstract_ = "A face on a message"
    help_ = "A reaction is one face by one actor on one message; the same face again takes it off."
    in_sidebar = False


class Tool(Shape, Resource):
    type = "tool"
    subagent_writable = False
    icon = "wrench"
    title_ = "Tool"
    abstract_ = "A script kept for a job that comes back, catalogued so the next agent runs it instead of writing it again"
    help_ = "A tool names its entry (how to run it), its usage and what it does; run executes it from the project root."
    entry: ClassVar[Field] = Field(TEXT)
    usage: ClassVar[Field] = Field(TEXT)
    scope = PROJECT


class Connection(Shape, Resource):
    type = "connection"
    subagent_writable = False
    icon = "plug"
    title_ = "Connection"
    abstract_ = "A service the project can reach, and which variable holds its token"
    help_ = "Never the token itself: the name of the variable that holds it."
    variable: ClassVar[Field] = Field(TEXT)
    scope = PROJECT


class Plugin(Shape, Resource):
    type = "plugin"
    event_labels = {"created": "Plugin installed", "completed": "Plugin removed"}
    status_labels = {"complete": "removing"}
    subagent_writable = False
    in_sidebar = False
    icon = "plug"
    command_names = {"complete": "remove"}
    title_ = "Plugin"
    abstract_ = "A repository installed into the journal: it hears the bus, answers, and may run services of its own"
    help_ = "Installed from a GitHub URL or a local path, pinned to a commit; its manifest says what it listens to, what it runs and which pages it shows."
    source: ClassVar[Field] = Field(TEXT)
    revision: ClassVar[Field] = Field(TEXT)
    commit: ClassVar[Field] = Field(TEXT)
    version: ClassVar[Field] = Field(TEXT)
    linked: ClassVar[Field] = Field(FLAG)
    enabled: ClassVar[Field] = Field(FLAG)
    manifest: ClassVar[Field] = Field()
    settings: ClassVar[Field] = Field()
    token: ClassVar[Field] = Field()
    scope = PROJECT


class Environment(Shape, Resource):
    type = "environment"
    event_labels = {"created": "Environment prepared", "completed": "Environment removed"}
    status_labels = {"create": "preparing", "complete": "removing"}
    subagent_writable = False
    icon = "branch"
    command_names = {"create": "prepare", "complete": "remove"}
    title_ = "Environment"
    abstract_ = "One line of work with its own record: messages, to-dos, facts, plans, settings"
    help_ = "A session works one environment at a time; switch takes one that is free, claim takes a held one with a reason."
    scope = PROJECT
    in_sidebar = False
    notified = ()


class Ask(Shape, Resource):
    loading = LAZY
    type = "browser"
    op: ClassVar[Field] = Field()
    args: ClassVar[Field] = Field(default=list)
    nested = True
    icon = "open"
    title_ = "Browser ask"
    abstract_ = "What the agent asks of the tab the user is driving — a picture, its text, a click — answered by the extension"
    help_ = "journal browser ask shot|url|text|dom|console|click <selector>|type <selector> <words>|goto <url>|eval <js>|scroll top|bottom|<selector>; the user turns driving on in the chat window's bar."
    in_sidebar = False
    notified = ()


class FeatureRow(Shape, Resource):
    type = "feature"
    icon = "dot"
    in_sidebar = False
    enabled: ClassVar[Field] = Field(FLAG, True)
    missing: ClassVar[Field] = Field(FLAG, False)
    title_ = "Feature"
    abstract_ = "A capability the engine loads, with its switch"
    help_ = "One row per feature the engine finds, carrying whether it is on. A row whose file is gone stays, switched off."
    notified = ()


class Nudge(Shape, Resource):
    loading = LAZY
    type = "nudge"
    notify_actions = ("created",)
    private: ClassVar[Field] = Field()
    session: ClassVar[Field] = Field()
    nested = True
    icon = "arrow"
    title_ = "Nudge"
    abstract_ = "A line a feature has the engine type to the agent"
    help_ = "A nudge is written by a feature and spoken to the agent as it is; the user never hears it."
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
