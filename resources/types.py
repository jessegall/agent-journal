from resources.base import AGENT, COMPLETED, DOCUMENT, LAZY, OPENED, PROJECT, SYSTEM, USER, Resource
from resources.shapes import FLAG, TEXT, Field, Options, Ranked, Reasoned, Shape, Traced, names


class Message(Shape, Resource):
    deduplicates = True
    indexed = ("idempotency",)
    answered = "reply"
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "message"
    shown = {"created": "Message", "completed": "Message processed"}
    icon = "mail"
    idempotency = Field(TEXT)
    delivered = Field()
    told = True
    clears = OPENED
    names = {"complete": "processed"}
    title_ = "Message"
    abstract_ = "What the user left for the agent, or the agent for the user"
    help_ = "A message is read once by the other side and processed part by part; what each part became is written on it."


class Todo(Ranked, Resource):
    type = "todo"
    shown = {"created": "To-do created", "completed": "To-do done"}
    status = Field()
    work = Field()
    assigned = Field()
    blocked = Field()
    reported = Field()
    after = Field()
    struck = Field()
    handed = "TO-DOS waiting — delayed work, not an instruction to start any of it"
    counted = True
    icon = "circle"
    names = {"complete": "done"}
    labels = {"outcome": "How"}
    title_ = "To-do"
    abstract_ = "One thing to do later, with a brief that says why and where to start"
    help_ = "A to-do waits on the list until it is started as work and closed; auto mode works the list in order."


class Work(Traced, Resource):
    type = "work"
    shown = {"created": "Work started", "sectioned": "Work logged", "completed": "Work ended"}
    says = {"create": "starting", "complete": "ending"}
    todo = Field()
    status = Field()
    parked = Field()
    handed = "STILL OPEN, from this or an earlier session"
    icon = "play"
    notify = (USER,)
    names = {"complete": "end", "create": "start"}
    title_ = "Work"
    abstract_ = "What the agent is doing right now, declared before its first write"
    help_ = "Work is opened by the agent, updated as it moves and ended when done; the agent that opened it has seen it."
    nav = False


class Doc(Shape, Resource):
    loading = LAZY
    type = "doc"
    shown = {"created": "Doc written", "completed": "Doc settled"}
    says = {"complete": "settling"}
    status = Field()
    handed = "DOCS catalogued — read one before you re-investigate what it settles"
    lent = False
    attention = True
    icon = "file"
    names = {"complete": "final"}
    scope = PROJECT
    title_ = "Document"
    abstract_ = "What stays true about the project, catalogued for every session"
    help_ = "A doc is written once, cited by facts and rules, and read before anything it settles is re-investigated."
    view = DOCUMENT


class Report(Shape, Resource):
    loading = LAZY
    type = "report"
    shown = {"created": "Report written", "completed": "Report archived"}
    says = {"complete": "archiving"}
    attention = True
    icon = "report"
    names = {"complete": "archive"}
    closed_first = True
    title_ = "Report"
    abstract_ = "What was checked and what was found, written for the user, read once"
    help_ = "A report answers something the user asked to have checked; it ages out or becomes a doc."
    view = DOCUMENT


class Fact(Reasoned, Resource):
    type = "fact"
    shown = {"created": "Fact noted", "completed": "Fact struck"}
    says = {"complete": "striking"}
    handed = "FACTS about this environment"
    lent = False
    attention = True
    finished_is_news = True
    icon = "pin"
    names = {"complete": "strike"}
    title_ = "Fact"
    abstract_ = "Something true about this environment that a later session would get wrong without"
    help_ = "A fact is handed to every session on its environment; it is struck when it stops being true."


class Rule(Reasoned, Resource):
    type = "rule"
    shown = {"created": "Rule made", "completed": "Rule struck"}
    says = {"complete": "striking"}
    injected = Field(FLAG)
    handed = "RULES, in force on every environment"
    lent = False
    attention = True
    finished_is_news = True
    icon = "list"
    names = {"complete": "strike"}
    scope = PROJECT
    title_ = "Rule"
    abstract_ = "A ruling that binds every environment of the project"
    help_ = "A rule is decided by the user, cited where it applies, and struck only by them."


class Reminder(Shape, Resource):
    type = "reminder"
    shown = {"created": "Reminder set", "completed": "Reminder retired"}
    says = {"complete": "retiring"}
    handed = "REMINDERS, said again at every stop"
    whom = Field()
    attention = True
    icon = "clock"
    names = {"complete": "retire"}
    title_ = "Reminder"
    abstract_ = "An instruction said again until it is retired"
    help_ = "A reminder repeats at every start and every so often mid-work, because knowing is not doing. One written with --set whom=<session> is said to that agent alone, which is how an agent reminds itself or leaves one for another."


class Question(Options, Resource):
    type = "question"
    shown = {"created": "Question asked", "completed": "Question answered"}
    says = {"create": "asking", "complete": "answering"}
    attention = True
    clears = COMPLETED
    nav = False
    icon = "help"
    names = {"complete": "answer", "create": "ask"}
    labels = {"outcome": "Answer", "abstract": "Context"}
    title_ = "Question"
    abstract_ = "Something the agent asks the user, with choices to pick"
    help_ = "A question waits for the user; its answer reaches the agent as an event."


class Suggestion(Options, Resource):
    type = "suggestion"
    shown = {"created": "Suggestion made", "completed": "Suggestion decided"}
    says = {"create": "suggesting", "complete": "deciding", "delete": "withdrawing"}
    decision = Field()
    handed = "SUGGESTIONS waiting on the user"
    attention = True
    clears = COMPLETED
    icon = "up"
    names = {"complete": "decide", "create": "suggest", "delete": "withdraw"}
    labels = {"outcome": "Decision", "brief": "Why"}
    title_ = "Suggestion"
    abstract_ = "A change the agent proposes unasked; the user accepts, adjusts or declines it, and nothing waits"
    help_ = "Accepting or adjusting files a to-do from it; a decline is a ruling the agent does not propose again."


class Comment(Shape, Resource):
    deduplicates = True
    editors = {USER: (USER, SYSTEM), AGENT: (AGENT, SYSTEM)}
    type = "comment"
    shown = {"created": "Comment", "completed": "Comment done"}
    mirror = True
    icon = "bubble"
    names = {"complete": "done"}
    title_ = "Comment"
    abstract_ = "What the user or the agent said about another resource"
    help_ = "A comment is a resource of its own, linked to what it is about."
    nav = False


class AgentRow(Shape, Resource):
    type = "agent"
    status = Field()
    event = Field()
    tool = Field()
    file = Field()
    wrote = Field()
    cwd = Field()
    at = Field(default=0)
    provider = Field(default="")
    uses = Field(default=0)
    transcript = Field(default="")
    inbox = Field(default="")
    model = Field(default="")
    effort = Field(default="")
    pending = Field(default=dict)
    asking = Field(default=dict)
    said = Field(default="")
    started = Field()
    context = Field(default=0)
    usage = Field(default=dict)
    skills = Field(default=list)
    shells = Field(default=0)
    subagents = Field(default=0)
    shell_rows = Field(default=list)
    subagent_rows = Field(default=list)
    parent = Field(default="")
    subagent = Field(FLAG, False)
    compacting = Field(FLAG, False)
    running = Field(default=dict)
    commands = Field(default=list)
    branch = Field()
    branch_url = Field()
    active = Field()
    decided = Field()
    icon = "bot"
    title_ = "Agent"
    abstract_ = "A session of Claude or Codex, and what it is doing right now"
    help_ = "The hooks report activity; the engine distinguishes idle, busy, declared work and compaction."
    nav = False
    notify = ()


class Notification(Shape, Resource):
    type = "notification"
    attention = True
    icon = "bell"
    title_ = "Notification"
    abstract_ = "Something the user should hear about, told to them once"
    help_ = "A notification is for the user: an update that landed, a plugin that installed, a setting the agent changed. The agent's own acts are not notifications; they are read in the activity."
    nav = False
    notify = ()


class Notice(Shape, Resource):
    type = "notice"
    shown = {"created": "Notice", "completed": "Notice closed"}
    icon = "band"
    names = {"complete": "close"}
    title_ = "Notice"
    abstract_ = "One line kept over the chat while it matters"
    help_ = "A notice stays until the user's X or the agent's close; a tone and a link may ride on it."
    nav = False
    notify = (USER,)


class Reaction(Shape, Resource):
    type = "reaction"
    face = Field()
    mirror = True
    icon = "smile"
    title_ = "Reaction"
    abstract_ = "A face on a message"
    help_ = "A reaction is one face by one actor on one message; the same face again takes it off."
    nav = False


class Tool(Shape, Resource):
    type = "tool"
    lent = False
    icon = "wrench"
    title_ = "Tool"
    abstract_ = "A script kept for a job that comes back, catalogued so the next agent runs it instead of writing it again"
    help_ = "A tool names its entry (how to run it), its usage and what it does; run executes it from the project root."
    entry = Field(TEXT)
    usage = Field(TEXT)
    scope = PROJECT


class Connection(Shape, Resource):
    type = "connection"
    lent = False
    icon = "plug"
    title_ = "Connection"
    abstract_ = "A service the project can reach, and which variable holds its token"
    help_ = "Never the token itself: the name of the variable that holds it."
    variable = Field(TEXT)
    scope = PROJECT


class Plugin(Shape, Resource):
    type = "plugin"
    shown = {"created": "Plugin installed", "completed": "Plugin removed"}
    says = {"complete": "removing"}
    lent = False
    nav = False
    icon = "plug"
    names = {"complete": "remove"}
    title_ = "Plugin"
    abstract_ = "A repository installed into the journal: it hears the bus, answers, and may run services of its own"
    help_ = "Installed from a GitHub URL or a local path, pinned to a commit; its manifest says what it listens to, what it runs and which pages it shows."
    source = Field(TEXT)
    revision = Field(TEXT)
    commit = Field(TEXT)
    version = Field(TEXT)
    linked = Field(FLAG)
    enabled = Field(FLAG)
    manifest = Field()
    settings = Field()
    token = Field()
    scope = PROJECT


class Environment(Shape, Resource):
    type = "environment"
    shown = {"created": "Environment prepared", "completed": "Environment removed"}
    says = {"create": "preparing", "complete": "removing"}
    lent = False
    icon = "branch"
    names = {"create": "prepare", "complete": "remove"}
    title_ = "Environment"
    abstract_ = "One line of work with its own record: messages, to-dos, facts, plans, settings"
    help_ = "A session works one environment at a time; switch takes one that is free, claim takes a held one with a reason."
    scope = PROJECT
    nav = False
    notify = ()


class Ask(Shape, Resource):
    loading = LAZY
    type = "browser"
    op = Field()
    args = Field(default=list)
    mirror = True
    icon = "open"
    title_ = "Browser ask"
    abstract_ = "What the agent asks of the tab the user is driving — a picture, its text, a click — answered by the extension"
    help_ = "journal browser ask shot|url|text|dom|console|click <selector>|type <selector> <words>|goto <url>|eval <js>|scroll top|bottom|<selector>; the user turns driving on in the chat window's bar."
    nav = False
    notify = ()


class FeatureRow(Shape, Resource):
    type = "feature"
    icon = "dot"
    nav = False
    enabled = Field(FLAG, True)
    missing = Field(FLAG, False)
    title_ = "Feature"
    abstract_ = "A capability the engine loads, with its switch"
    help_ = "One row per feature the engine finds, carrying whether it is on. A row whose file is gone stays, switched off."
    notify = ()


class Nudge(Shape, Resource):
    loading = LAZY
    type = "nudge"
    notify_actions = ("created",)
    private = Field()
    session = Field()
    mirror = True
    icon = "arrow"
    title_ = "Nudge"
    abstract_ = "A line a feature has the engine type to the agent"
    help_ = "A nudge is written by a feature and spoken to the agent as it is; the user never hears it."
    nav = False
    notify = (AGENT,)
    spoken = True


RUNNING = names("what", "tool", "at", "done", "changed", "files", "made", "effect", "result", "before")
COMMAND = names("what", "tool", "at", "effect", "subject", "done", "result", "files", "made", "changed")

def register(*classes) -> None:
    TYPES.update({c.type: c for c in classes})


TYPES = {c.type: c for c in (Message, Todo, Work, Doc, Report, Fact, Rule, Reminder, Question, Suggestion, Comment, AgentRow, Notification, Notice, Reaction, Tool, Connection, Plugin, Environment, Ask, Nudge, FeatureRow)}
LISTED = ("message", "question", "suggestion", "comment", "plan", "todo", "report", "doc", "fact", "rule", "reminder", "notice", "reaction", "tool", "connection", "plugin", "environment", "work", "agent", "notification", "browser", "nudge", "feature")


def priority() -> list[str]:
    return [*LISTED, *(name for name in TYPES if name not in LISTED)]
