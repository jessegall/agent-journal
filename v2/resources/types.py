from v2.resources.base import Resource


class Message(Resource):
    type = "message"
    names = {"complete": "processed"}
    title_ = "Message"
    abstract_ = "What the user left for the agent, or the agent for the user"
    help_ = "A message is read once by the other side and processed part by part; what each part became is written on it."


class Todo(Resource):
    type = "todo"
    names = {"complete": "done", "create": "add"}
    title_ = "To-do"
    abstract_ = "One thing to do later, with a brief that says why and where to start"
    help_ = "A to-do waits on the list until it is started as work and closed; auto mode works the list in order."


class Work(Resource):
    type = "work"
    names = {"complete": "end", "create": "start"}
    title_ = "Work"
    abstract_ = "What the agent is doing right now, declared before its first write"
    help_ = "Work is opened by the agent, updated as it moves and ended when done; the agent that opened it has seen it."


class Plan(Resource):
    type = "plan"
    names = {"complete": "acknowledge"}
    title_ = "Plan"
    abstract_ = "Ordered phases of to-dos with a goal, approved by the user before it runs"
    help_ = "A plan is drafted by the agent, approved and continued by the user, and worked phase by phase."


class Doc(Resource):
    type = "doc"
    title_ = "Document"
    abstract_ = "What stays true about the project, catalogued for every session"
    help_ = "A doc is written once, cited by pins and rules, and read before anything it settles is re-investigated."


class Report(Resource):
    type = "report"
    names = {"complete": "archive"}
    title_ = "Report"
    abstract_ = "What was checked and what was found, written for the user, read once"
    help_ = "A report answers something the user asked to have checked; it ages out or becomes a doc."


class Pin(Resource):
    type = "pin"
    names = {"complete": "strike"}
    title_ = "Pin"
    abstract_ = "A fact a later session would get wrong without"
    help_ = "A pin is handed to every session on its environment; it is struck when it stops being true."


class Rule(Resource):
    type = "rule"
    names = {"complete": "strike"}
    title_ = "Rule"
    abstract_ = "A ruling that binds every environment of the project"
    help_ = "A rule is decided by the user, cited where it applies, and struck only by them."


class Reminder(Resource):
    type = "reminder"
    names = {"complete": "retire"}
    title_ = "Reminder"
    abstract_ = "An instruction said again until it is retired"
    help_ = "A reminder repeats at every start and every so often mid-work, because knowing is not doing."


class Question(Resource):
    type = "question"
    names = {"complete": "answer", "create": "ask"}
    title_ = "Question"
    abstract_ = "Something the agent asks the user, with choices to pick"
    help_ = "A question waits for the user; its answer reaches the agent as an event."


class Suggestion(Resource):
    type = "suggestion"
    title_ = "Suggestion"
    abstract_ = "A change the agent proposes and the user decides"
    help_ = "A suggestion is accepted, adjusted or declined by the user; accepted, it becomes a to-do."


class Comment(Resource):
    type = "comment"
    title_ = "Comment"
    abstract_ = "What the user or the agent said about another resource"
    help_ = "A comment is a resource of its own, linked to what it is about."


TYPES = {c.type: c for c in (Message, Todo, Work, Plan, Doc, Report, Pin, Rule, Reminder, Question, Suggestion, Comment)}
PRIORITY = ("message", "question", "suggestion", "comment", "plan", "todo", "report", "doc", "pin", "rule", "reminder", "work")
