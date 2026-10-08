from controllers.types import Messages
from resources.base import USER

SAY, MESSAGE = "say", "message"
ACTIONS = (SAY, MESSAGE)


def post_as_user(context, title: str, brief: str, **data) -> None:
    context.journal.acting(USER).get(Messages).create(title, brief=brief, **data)


def say(context, agent, line: str, private: bool = True, **values) -> None:
    context.feature.journal.say(context.record, agent, line, private=private, **values)


def perform(context, agent, action: str, line: str, private: bool = True, **values) -> None:
    if action == MESSAGE:
        post_as_user(context, values["title"], values.get("text", ""))
        return
    say(context, agent, line, private, **values)
