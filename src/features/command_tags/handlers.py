import io

from engine.events.engine import AgentMessageSending, CommandRan
from features.parts import AgentContext, Context, Handler
from features.command_tags.reading import CARRIED, OPTIONS, named, reader, removed, replies, runs, tag_spelling, tag_for, visible, waits
from resources.base import AGENT
from features.command_line import command_line


class RunTagCommands(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        message = event.text
        if CARRIED.search(message) and context.once("tagged", event.turn):
            self.run(context, message)
        if replies(message) or waits(message):
            event.stop()
        else:
            event.change(visible(message, reader(context.settings)).strip())

    def run(self, context: Context, message: str) -> None:
        commands, text = runs(context.settings), removed(message, reader(context.settings)).strip()
        for name, n, argument, extras in CARRIED.findall(message):
            if name not in commands:
                continue
            out, err = io.StringIO(), io.StringIO()
            code = command_line().run(["--root", str(context.record.root), "--env", context.record.env, "--session", context.agent.session, "--as", AGENT,
                        *self.argv(commands[name], n, argument, text), *self.settings(name, extras)], out=out, err=err)
            if code:
                context.agent.whisper("refused", tag=name, on=n or argument, error=tag_spelling((err.getvalue() or out.getvalue()).strip()))

    def settings(self, name: str, extras: str) -> list[str]:
        return [word for key, value in named(extras).items()
                for word in ((f"--{key}", value) if key in OPTIONS.get(name, ()) else ("--set", f"{key}={value}"))]

    def argv(self, template: str, n: str, name: str, text: str) -> list[str]:
        return [{"{text}": text, "{n}": n, "{name}": name}.get(word, word) for word in template.split()]


class TeachTheTag(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        tag = tag_for(event.command)
        if tag and "--file" not in event.command and context.due("hint"):
            context.agent.whisper("hint", tag=tag.name, hint=tag.hint)
