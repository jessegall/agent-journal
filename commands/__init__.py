from __future__ import annotations

from command import Registry
from commands import auto, comments, docs, notifications, reports, suggestions, environments, inbox, pins, questions, reminders, status, style, system, todos, tools, transcript, work
from commands.options import SHARED

REGISTRY = Registry(shared=SHARED)
for module in (auto, comments, reports, notifications, suggestions, questions, inbox, reminders, pins, work, todos, docs, tools, style, environments, transcript, system, status):
    for spellings in module.NOUNS:
        REGISTRY.noun(*spellings)
    REGISTRY.add(*module.COMMANDS)

from commands.resource import search_command  # noqa: E402

REGISTRY.add(*(search_command(verb, controller, label, noun) for verb, controller, label, noun in (
    ("todos", todos.CONTROLLER, "to-dos", "to-do"), ("messages", inbox.CONTROLLER, "messages", "message"),
    ("questions", questions.CONTROLLER, "questions", "question"), ("reports", reports.CONTROLLER, "reports", "report"),
    ("suggestions", suggestions.CONTROLLER, "suggestions", "suggestion"),
    ("reminders", reminders.CONTROLLER, "reminders", "reminder"), ("pins", pins.PINS, "pins", "pin"),
    ("rules", pins.RULES, "rules", "rule"), ("work", work.CONTROLLER, "work", "work"),
    ("comments", comments.CONTROLLER, "comments", "comment"))))
