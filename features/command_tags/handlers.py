import io

from engine.events import AgentMessageSending
from features.parts import Context, Handler
from features.command_tags.reading import CARRIED, reader, replies, runs, stripped
from resources.base import AGENT


class RunTagCommands(Handler):
    def handle(self, context: Context, event: AgentMessageSending) -> None:
        said = event.text
        if context.agent and CARRIED.search(said) and context.once("tagged", said):
            self.run(context, said)
        if replies(said):
            event.stop()
        else:
            event.change(stripped(said, context.settings).strip())

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
