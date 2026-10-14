from events import Fact
from events.message_todos import TodoLeftUnlinked, TodoNamedInReply
from features.message_todos.details import UNLINKED
from receiving import Handler
from resources.types import Message, Todo
from serving import Chat, Rows


class LinkTodoToItsMessage(Handler[TodoNamedInReply]):
    def handle(self, event: TodoNamedInReply, messages: Rows[Message]) -> list[Fact]:
        messages.link(event.message, f"todo:{event.todo}")
        return []


class AskWhetherATodoCameFromAMessage(Handler[TodoLeftUnlinked]):
    def handle(self, event: TodoLeftUnlinked, chat: Chat) -> list[Fact]:
        chat.say(UNLINKED, todo=event.todo, message=event.message)
        return []
