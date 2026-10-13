import shlex

from events import Fact
from events.agents import AgentTurnWritten, CommandRan, ToolCallAnswered
from events.answers import Allowed, Answer, Kept, Rewritten
from events.asking import AgentMessageSending
from events.command_tags import HeldLinesHanded, MessageTagged, TagHintDue
from features.command_tags.reading import CARRIED, OPTIONS, kept_out_of_the_chat, named, reader, removed, runs, visible_words, tag_for
from framework.held_lines import held
from receiving import Answerer, Listener
from serving import ReadElsewhere, ReadRows, Settings
from resources.types import AgentRow


class KeepTaggedTurnsOutOfTheChat(Answerer[AgentMessageSending]):
    def answer(self, event: AgentMessageSending, settings: Settings) -> Answer:
        if kept_out_of_the_chat(event.text):
            return Kept()
        words = visible_words(event.text, settings)
        return Rewritten(text=words) if words != event.text else Allowed()


class TagsInText(Listener[AgentTurnWritten]):
    def listen(self, event: AgentTurnWritten, settings: Settings) -> list[Fact]:
        commands, text = runs(settings), removed(event.text, reader(settings)).strip()
        words = visible_words(event.text, settings)
        withheld = kept_out_of_the_chat(event.text) and bool(words)
        return [MessageTagged(agent=event.agent, turn=event.turn, tag=name, about=n or argument, words=words, withheld=withheld,
                              command=shlex.join([*argv(commands[name], n, argument, text), *options(name, extras)]))
                .once(f"{event.turn}|{name}|{n}|{argument}|{extras}")
                for name, n, argument, extras in CARRIED.findall(event.text) if name in commands]


class SpotTagCommand(Listener[CommandRan]):
    def listen(self, event: CommandRan) -> list[Fact]:
        tag = tag_for(event.command)
        return [TagHintDue(agent=event.agent, tag=tag.name, hint=tag.hint).due("hint")] if tag and "--file" not in event.command else []


def argv(template: str, n: str, name: str, text: str) -> list[str]:
    return [{"{text}": text, "{n}": n, "{name}": name}.get(word, word) for word in template.split()]


def options(name: str, extras: str) -> list[str]:
    return [word for key, value in named(extras).items()
            for word in ((f"--{key}", value) if key in OPTIONS.get(name, ()) else ("--set", f"{key}={value}"))]


class SpotHeldLinesHanded(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, agents: ReadRows[AgentRow], elsewhere: ReadElsewhere) -> list[Fact]:
        handed = not event.why and held(elsewhere.here().record, agents.peek(event.agent).title)
        return [HeldLinesHanded(agent=event.agent)] if handed else []
