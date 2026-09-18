from v2.resources.base import Resource


class Message(Resource):
    type = "message"


class Todo(Resource):
    type = "todo"


class Work(Resource):
    type = "work"


class Plan(Resource):
    type = "plan"


class Doc(Resource):
    type = "doc"


class Report(Resource):
    type = "report"


class Pin(Resource):
    type = "pin"


class Rule(Resource):
    type = "rule"


class Reminder(Resource):
    type = "reminder"


class Question(Resource):
    type = "question"


class Suggestion(Resource):
    type = "suggestion"


class Comment(Resource):
    type = "comment"


TYPES = {c.type: c for c in (Message, Todo, Work, Plan, Doc, Report, Pin, Rule, Reminder, Question, Suggestion, Comment)}
