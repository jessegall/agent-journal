from features.base import Feature
from features.journal import Journal
from features.message_todos.details import MessageTodosDetails
from features.message_todos.handlers import AskWhetherATodoCameFromAMessage, LinkTodosToTheirMessage
from engine.events.resources import ResourceCreated
from expects import Given, Unchanged, Updated, WHEN
from resources.base import AGENT
from resources.types import Comment, Message, Todo

REPLY = Comment(n=1, title="Filed it", brief="Filed as to-do 7.", refs=["message:12"])
FRESH = Todo(n=7, title="The thing to do", created=WHEN - 60)
STALE = Todo(n=7, title="Filed hours before the reply", created=WHEN - 60 * 60 * 5)
ASKED = Message(n=12, title="can you look at this", created=WHEN - 600)
REPLIED = (REPLY, FRESH, ASKED)


class MessageTodos(Feature):
    details = MessageTodosDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(LinkTodosToTheirMessage(), expects=[
            Given(ResourceCreated(type="comment", n=1, actor=AGENT), rows=REPLIED, settings={"message_todos.minutes": 30})
                >> Updated(Message(n=12), refs=["todo:7"]),
            Given(ResourceCreated(type="comment", n=1, actor=AGENT), rows=(REPLY, STALE, ASKED), settings={"message_todos.minutes": 30})
                >> Unchanged(),
            Given(ResourceCreated(type="todo", n=1, actor=AGENT), rows=REPLIED, settings={"message_todos.minutes": 30})
                >> Unchanged(),
        ])
        journal.events.handler(AskWhetherATodoCameFromAMessage())
