from framework.base import Feature
from framework.journal import Journal
from features.command_tags.details import CommandTagsDetails
from features.command_tags.formatters import StripTags
from features.command_tags.handlers import KeepWhatTheTagRan, NameTheRefusal, RestoreTheWords, RunTagCommand, TeachTheTag
from features.command_tags.listeners import KeepTaggedTurnsOutOfTheChat, SpotTagCommand, TagsInText
from features.command_tags.answering import answered, still_to_answer
from features.command_tags.reading import REPLY, TAGS
from features.command_tags.lines_held import lines_held
from payload import HookEvent
from events.agents import AgentTurnWritten, CommandRan
from events.answers import Allowed, Kept, Rewritten
from events.asking import AgentMessageSending, TextFormatting
from events.command_tags import MessageTagged, TagCommandRan, TagHintDue, TagRefused, TurnKeptBack
from expects import Answered, Dispatches, File, Given, Hooked, Nudged, Printed, Ran, Whispered, Wrote, answering, exited, nothing
from resources.types import AgentRow


RAN = answering({".journal/runtime/sessions/claude-1/held-lines.txt": "the reply tag on 12 ran\n"})
AGENT = AgentRow(n=1, title="claude-1")
HINT = next(tag.hint for tag in TAGS if tag.name == REPLY)
REPLYING = "message reply 12 'the answer'"


def sending(text: str) -> AgentMessageSending:
    return AgentMessageSending(text=text, turn="t1", session="claude-1")


def written(text: str) -> AgentTurnWritten:
    return AgentTurnWritten(agent=1, turn="t1", text=text)


def tagged(command: str = REPLYING) -> MessageTagged:
    return MessageTagged(agent=1, turn="t1", tag=REPLY, about="12", command=command, words="the answer", withheld=True)


class CommandTags(Feature):
    details = CommandTagsDetails

    def register(self, journal: Journal) -> None:
        journal.events.answer(AgentMessageSending, KeepTaggedTurnsOutOfTheChat(), expects=[
            Given(sending("[!reply:12] the answer")) >> Answered(Kept()),
            Given(sending("[!log:7] the tests pass")) >> Answered(Kept()),
            Given(sending('Filing it.\n[!todo="the footer"]')) >> Answered(Rewritten(text="Filing it.")),
            Given(sending("plain words")) >> Answered(Allowed()),
        ])
        journal.events.listen(AgentTurnWritten, TagsInText(), expects=[
            Given(written("[!reply:12] the answer")) >> Dispatches(tagged().once("t1|reply|12||")),
            Given(written("[!reply:12,13] the answer")) >> Dispatches(
                MessageTagged(agent=1, turn="t1", tag=REPLY, about="12,13", command="message reply 12,13 'the answer'", words="the answer", withheld=True).once("t1|reply|12,13||")),
            Given(written("[!reply:12, todos=(7, 8)] the answer")) >> Dispatches(
                tagged(command=f"{REPLYING} --todos 7,8").once("t1|reply|12||, todos=(7, 8)")),
            Given(written('Filing it.\n[!todo="the footer"]')) >> Dispatches(
                MessageTagged(agent=1, turn="t1", tag="todo", about="the footer", command="todo create 'the footer' --brief 'Filing it.'", words="Filing it.", withheld=False)
                .once("t1|todo||the footer|")),
            Given(written("plain words")) >> Dispatches(nothing),
        ])
        journal.events.handle(MessageTagged, RunTagCommand(), expects=[
            Given(tagged(), commands=answering({REPLYING: exited(0, "replied")}))
                >> Ran(REPLYING) & Dispatches(TagCommandRan(agent=1, turn="t1", tag=REPLY, about="12")),
            Given(tagged(), commands=answering({REPLYING: exited(1, "there is no message 12")}))
                >> Dispatches(TagRefused(agent=1, turn="t1", tag=REPLY, about="12", why="there is no message 12"))
                & Dispatches(TurnKeptBack(agent=1, turn="t1", words="the answer")),
        ])
        journal.events.handle(TagCommandRan, KeepWhatTheTagRan(), expects=[
            Given(TagCommandRan(agent=1, turn="t1", tag=REPLY, about="12"), rows=[AGENT])
                >> Wrote(File(".journal/runtime/sessions/claude-1/held-lines.txt", "the reply tag on 12 ran\n")),
        ])
        journal.events.handle(TagRefused, NameTheRefusal(), expects=[
            Given(TagRefused(agent=1, turn="t1", tag=REPLY, about="99", why="there is no message 99"), rows=[AGENT]) >> Nudged("refused", tag=REPLY, on="99"),
        ])
        journal.events.handle(TurnKeptBack, RestoreTheWords(), expects=[
            Given(TurnKeptBack(agent=1, turn="t1", words="the answer"), rows=[AGENT]) >> Printed("the answer"),
        ])
        journal.events.listen(CommandRan, SpotTagCommand(), expects=[
            Given(CommandRan(agent=1, tool="Bash", command='journal message reply 12 "the answer"')) >> Dispatches(TagHintDue(agent=1, tag=REPLY, hint=HINT).due("hint")),
            Given(CommandRan(agent=1, tool="Bash", command="journal message reply 12 --file notes.md")) >> Dispatches(nothing),
            Given(CommandRan(agent=1, tool="Bash", command="ls")) >> Dispatches(nothing),
        ])
        journal.events.handle(TagHintDue, TeachTheTag(), expects=[
            Given(TagHintDue(agent=1, tag=REPLY, hint=HINT), rows=[AGENT]) >> Nudged("hint", tag=REPLY) & Whispered("the reply tag does this in one step"),
        ])
        journal.events.answer(TextFormatting, StripTags(), expects=[
            Given(TextFormatting(text='[!reply:12] the answer')) >> Answered(Rewritten('the answer')),
            Given(TextFormatting(text='plain words')) >> Answered(Rewritten('plain words')),
        ])
        journal.agent.responder(HookEvent.PRE_TOOL_USE, lines_held, expects=[
            Given("a tag ran while the agent was writing", rows=[AGENT], hook=Hooked(event="PreToolUse"), files=RAN)
                >> Answered("[journal] the reply tag on 12 ran\n"),
            Given("no tag has run", rows=[AGENT], hook=Hooked(event="PreToolUse")) >> Answered(""),
        ])
        journal.agent.append_to_line("message.created", answered, instead=True)
        journal.agent.append_to_line("messages.answer", still_to_answer)
