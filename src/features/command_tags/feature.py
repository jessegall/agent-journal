from framework.base import Feature
from framework.journal import Journal
from features.command_tags.details import CommandTagsDetails
from features.command_tags.formatters import StripTags
from features.command_tags.handlers import RunTagCommands, TeachTheTag
from features.command_tags.answering import answered
from events.agents import BusMessageSending, CommandRan
from expects import Changed, Formats, Given, Kept, Nudged, Unchanged, Updated, Wrote
from resources.types import AgentRow, Message, Todo


class CommandTags(Feature):
    details = CommandTagsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RunTagCommands(), expects=[
            Given(BusMessageSending(agent=1, data={"text": "[!reply:12] the answer", "turn": "t1"}),
                  rows=[AgentRow(n=1, title="claude-1"), Message(n=12, title="can you look at this", seen=["user"])], settings={"command_tags.reader": "agent"})
                >> Changed("the answer"),
            Given(BusMessageSending(agent=1, data={"text": "[!reply:99] the answer", "turn": "t1"}),
                  rows=[AgentRow(n=1, title="claude-1")], settings={"command_tags.reader": "agent"})
                >> Changed("the answer") & Nudged("refused", tag="reply", on="99"),
            Given(BusMessageSending(agent=1, data={"text": 'Filing it.\n[!todo="the footer"]', "turn": "t1"}),
                  rows=[AgentRow(n=1, title="claude-1")], settings={"command_tags.reader": "agent"})
                >> Wrote(Todo(title="the footer")),
            Given(BusMessageSending(agent=1, data={"text": "plain words", "turn": "t1"}), rows=[AgentRow(n=1, title="claude-1")]) >> Kept() & Unchanged(),
        ])
        journal.events.handler(TeachTheTag(), expects=[
            Given(CommandRan(agent=1, tool="Bash", command='journal message reply 12 "the answer"'), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("hint", tag="reply"),
            Given(CommandRan(agent=1, tool="Bash", command='journal message reply 12 --file notes.md'), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
            Given(CommandRan(agent=1, tool="Bash", command="ls"), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.client.formatter(StripTags(), expects=[
            Formats('[!reply:12] the answer', to='the answer'),
            Formats('plain words', to='plain words'),
        ])
        journal.agent.append_to_line("message.created", answered, instead=True)
        journal.agent.append_to_line("messages.answer", answered)
