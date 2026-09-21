import io

from engine.events import AgentMessageSending
from features.parts import Context, Handler
from features.command_tags.reading import CARRIED, named, reader, replies, runs, stripped, tag_spelling
from resources.base import AGENT


class RunTagCommands(Handler):
    def handle(self, context: Context, event: AgentMessageSending) -> None:
        message = event.text
        if context.agent and CARRIED.search(message) and context.once("tagged", message):
            self.run(context, message)
        if replies(message):
            event.stop()
        else:
            event.change(stripped(message, context.settings).strip())

    def run(self, context: Context, message: str) -> None:
        from commands.cli import run
        commands, text = runs(context.settings), CARRIED.sub("", reader(context.settings).sub("", message)).strip()
        for name, n, argument, extras in CARRIED.findall(message):
            if name not in commands:
                continue
            out, err = io.StringIO(), io.StringIO()
            code = run(["--root", str(context.record.root), "--env", context.record.env, "--session", context.agent.session, "--as", AGENT,
                        *self.argv(commands[name], n, argument, text), *self.settings(extras)], out=out, err=err)
            if code:
                context.agent.whisper("refused", tag=name, on=n or argument, error=tag_spelling((err.getvalue() or out.getvalue()).strip()))

    def settings(self, extras: str) -> list[str]:
        return [word for key, value in named(extras).items() for word in ("--set", f"{key}={value}")]

    def argv(self, template: str, n: str, name: str, text: str) -> list[str]:
        return [{"{text}": text, "{n}": n, "{name}": name}.get(word, word) for word in template.split()]
