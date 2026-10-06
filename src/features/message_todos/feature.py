from features.base import Feature
from features.journal import Journal
from features.message_todos.details import MessageTodosDetails
from features.message_todos.handlers import LinkTodosToTheirMessage


class MessageTodos(Feature):
    details = MessageTodosDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(LinkTodosToTheirMessage())
