from events import Fact
from events.command_tags import MessageTagged, TagHintDue, TagRefused, TurnKeptBack
from features.command_tags.reading import tag_spelling
from receiving import Handler
from resources.types import AgentRow
from serving import Chat, Commands, Elsewhere, ReadRows


class RunTagCommand(Handler[MessageTagged]):
    def handle(self, event: MessageTagged, commands: Commands) -> list[Fact]:
        ran = commands.run(event.command)
        if not ran.code:
            return []
        refused = TagRefused(agent=event.agent, turn=event.turn, tag=event.tag, about=event.about, why=tag_spelling(ran.output))
        return [refused, TurnKeptBack(agent=event.agent, turn=event.turn, words=event.words)] if event.withheld else [refused]


class NameTheRefusal(Handler[TagRefused]):
    def handle(self, event: TagRefused, chat: Chat) -> list[Fact]:
        chat.nudge("refused", tag=event.tag, on=event.about, error=event.why)
        return []


class RestoreTheWords(Handler[TurnKeptBack]):
    def handle(self, event: TurnKeptBack, chat: Chat) -> list[Fact]:
        chat.post(event.words, event.turn)
        return []


class TeachTheTag(Handler[TagHintDue]):
    def handle(self, event: TagHintDue, chat: Chat) -> list[Fact]:
        chat.nudge("hint", tag=event.tag, hint=event.hint)
        return []
