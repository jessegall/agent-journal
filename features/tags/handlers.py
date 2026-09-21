import io

from controllers.types import Messages
from engine.events import AgentMessageCreated
from features.parts import Context, Handler
from features.tags.reading import CARRIED, reader, replies, runs, stripped
from resources.base import AGENT, titled


class RunTagCommands(Handler):
    def handle(self, context: Context, event: AgentMessageCreated) -> None:
        if context.agent and CARRIED.search(event.text) and context.once("tagged", event.text):
            self.run(context, event.text)

    def run(self, context: Context, said: str) -> None:
        from commands.cli import run
        commands, text = runs(context.settings), CARRIED.sub("", reader(context.settings).sub("", said)).strip()
        for name, n, argument in CARRIED.findall(said):
            if name not in commands:
                continue
            out, err = io.StringIO(), io.StringIO()
            code = run(["--root", str(context.record.root), "--env", context.record.env, "--session", context.agent.session, "--as", AGENT,
                        *self.argv(commands[name], n, argument, text)], out=out, err=err)
            if code:
                context.agent.whisper("refused", tag=name, on=n or argument, said=(err.getvalue() or out.getvalue()).strip())

    def argv(self, template: str, n: str, name: str, text: str) -> list[str]:
        return [{"{text}": text, "{n}": n, "{name}": name}.get(word, word) for word in template.split()]


class CopyToChat(Handler):
    def handle(self, context: Context, event: AgentMessageCreated) -> None:
        text = stripped(event.text, context.settings).strip()
        if context.agent and text and not replies(event.text) and context.once("shown", event.text):
            Messages(context.record, actor=AGENT).create(titled(text), brief=text)
