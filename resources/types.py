from resources.base import AGENT, DOCUMENT, PROJECT, USER, WIDE, Resource
from resources.shapes import TEXT, Options, Ranked, Reasoned, Shape, Traced


class Message(Shape, Resource):
    type = "message"
    icon = "mail"
    names = {"complete": "processed"}
    title_ = "Message"
    abstract_ = "What the user left for the agent, or the agent for the user"
    help_ = "A message is read once by the other side and processed part by part; what each part became is written on it."
    view = WIDE


class Todo(Ranked, Resource):
    type = "todo"
    handed = "TO-DOS waiting — delayed work, not an instruction to start any of it"
    counted = True
    icon = "circle"
    names = {"complete": "done", "create": "add"}
    labels = {"outcome": "How"}
    title_ = "To-do"
    abstract_ = "One thing to do later, with a brief that says why and where to start"
    help_ = "A to-do waits on the list until it is started as work and closed; auto mode works the list in order."


class Work(Traced, Resource):
    type = "work"
    handed = "STILL OPEN, from this or an earlier session"
    icon = "play"
    notify = (USER,)
    names = {"complete": "end", "create": "start"}
    title_ = "Work"
    abstract_ = "What the agent is doing right now, declared before its first write"
    help_ = "Work is opened by the agent, updated as it moves and ended when done; the agent that opened it has seen it."
    nav = False


class Plan(Shape, Resource):
    type = "plan"
    handed = "PLANS running"
    attention = True
    icon = "flag"
    names = {"complete": "acknowledge", "place": "todos", "resume": "continue"}
    title_ = "Plan"
    abstract_ = "Ordered phases of to-dos with a goal, approved by the user before it runs"
    help_ = "A plan is drafted by the agent, approved and continued by the user, and worked phase by phase."
    view = DOCUMENT


class Doc(Shape, Resource):
    type = "doc"
    handed = "DOCS catalogued — read one before you re-investigate what it settles"
    lent = False
    attention = True
    icon = "file"
    names = {"complete": "final"}
    scope = PROJECT
    title_ = "Document"
    abstract_ = "What stays true about the project, catalogued for every session"
    help_ = "A doc is written once, cited by pins and rules, and read before anything it settles is re-investigated."
    view = DOCUMENT


class Report(Shape, Resource):
    type = "report"
    attention = True
    icon = "report"
    names = {"complete": "archive"}
    title_ = "Report"
    abstract_ = "What was checked and what was found, written for the user, read once"
    help_ = "A report answers something the user asked to have checked; it ages out or becomes a doc."
    view = DOCUMENT


class Pin(Reasoned, Resource):
    type = "pin"
    handed = "PINS on this environment"
    lent = False
    attention = True
    icon = "pin"
    names = {"complete": "strike"}
    title_ = "Pin"
    abstract_ = "A fact a later session would get wrong without"
    help_ = "A pin is handed to every session on its environment; it is struck when it stops being true."


class Rule(Reasoned, Resource):
    type = "rule"
    handed = "RULES, in force on every environment"
    lent = False
    attention = True
    icon = "list"
    names = {"complete": "strike"}
    scope = PROJECT
    title_ = "Rule"
    abstract_ = "A ruling that binds every environment of the project"
    help_ = "A rule is decided by the user, cited where it applies, and struck only by them."


class Reminder(Shape, Resource):
    type = "reminder"
    handed = "REMINDERS, said again at every stop"
    lent = False
    attention = True
    icon = "clock"
    names = {"complete": "retire"}
    title_ = "Reminder"
    abstract_ = "An instruction said again until it is retired"
    help_ = "A reminder repeats at every start and every so often mid-work, because knowing is not doing."


class Question(Options, Resource):
    type = "question"
    attention = True
    nav = False
    icon = "help"
    names = {"complete": "answer", "create": "ask"}
    labels = {"outcome": "Answer", "abstract": "Context"}
    title_ = "Question"
    abstract_ = "Something the agent asks the user, with choices to pick"
    help_ = "A question waits for the user; its answer reaches the agent as an event."


class Suggestion(Options, Resource):
    type = "suggestion"
    handed = "SUGGESTIONS waiting on the user"
    attention = True
    icon = "up"
    names = {"complete": "decide", "create": "suggest", "delete": "withdraw"}
    labels = {"outcome": "Decision", "brief": "Why"}
    title_ = "Suggestion"
    abstract_ = "A change the agent proposes unasked; the user accepts, adjusts or declines it, and nothing waits"
    help_ = "Accepting or adjusting files a to-do from it; a decline is a ruling the agent does not propose again."


class Comment(Shape, Resource):
    type = "comment"
    mirror = True
    icon = "bubble"
    names = {"complete": "done"}
    title_ = "Comment"
    abstract_ = "What the user or the agent said about another resource"
    help_ = "A comment is a resource of its own, linked to what it is about."
    nav = False


class AgentRow(Shape, Resource):
    type = "agent"
    icon = "bot"
    title_ = "Agent"
    abstract_ = "A session of Claude or Codex, and what it is doing right now"
    help_ = "The hooks write an agent's status here; the engine reads it to know idle from working."
    nav = False
    notify = ()


class Notification(Shape, Resource):
    type = "notification"
    mirror = True
    icon = "bell"
    title_ = "Notification"
    abstract_ = "What the agent did, told to the user once"
    help_ = "A notification is written for the user by a feature for every act of the agent, or by the agent to say a long piece of work landed."
    nav = False
    notify = ()


class Notice(Shape, Resource):
    type = "notice"
    icon = "band"
    names = {"complete": "close"}
    title_ = "Notice"
    abstract_ = "One line kept over the chat while it matters"
    help_ = "A notice stays until the user's X or the agent's close; a tone and a link may ride on it."
    nav = False
    notify = (USER,)


class Reaction(Shape, Resource):
    type = "reaction"
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
    fields = {"entry": TEXT, "usage": TEXT}
    scope = PROJECT
    nav = False


class Style(Reasoned, Resource):
    type = "style"
    lent = False
    icon = "brush"
    names = {"complete": "strike"}
    title_ = "Coding style"
    abstract_ = "One rule of the project's coding style, on one subject, written as a skill"
    help_ = "A style rule names its subject and its decision; the style feature writes the skill for it."
    fields = {"subject": TEXT, "decision": TEXT, "when": TEXT}
    scope = PROJECT
    nav = False


class Connection(Shape, Resource):
    type = "connection"
    lent = False
    icon = "plug"
    title_ = "Connection"
    abstract_ = "A service the project can reach, and which variable holds its token"
    help_ = "Never the token itself: the name of the variable that holds it."
    fields = {"variable": TEXT}
    scope = PROJECT
    nav = False


class Environment(Shape, Resource):
    type = "environment"
    lent = False
    icon = "branch"
    names = {"create": "prepare", "complete": "remove"}
    title_ = "Environment"
    abstract_ = "One line of work with its own record: messages, to-dos, pins, plans, settings"
    help_ = "A session works one environment at a time; switch takes one that is free, claim takes a held one with a reason."
    scope = PROJECT
    nav = False
    notify = ()
    notify = ()


class Nudge(Shape, Resource):
    type = "nudge"
    mirror = True
    icon = "arrow"
    title_ = "Nudge"
    abstract_ = "A line a feature has the engine type to the agent"
    help_ = "A nudge is written by a feature and spoken to the agent as it is; the user never hears it."
    nav = False
    notify = (AGENT,)
    spoken = True


TYPES = {c.type: c for c in (Message, Todo, Work, Plan, Doc, Report, Pin, Rule, Reminder, Question, Suggestion, Comment, AgentRow, Notification, Notice, Reaction, Tool, Style, Connection, Environment, Nudge)}
PRIORITY = ("message", "question", "suggestion", "comment", "plan", "todo", "report", "doc", "pin", "rule", "reminder", "notice", "reaction", "style", "tool", "connection", "environment", "work", "agent", "notification", "nudge")
