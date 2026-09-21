import io

from controllers.types import Messages, Nudges
from engine.events import AgentMessageCreated
from features.parts import Context, Handler
from features.tags.reading import CARRIED, LEADING, SHOWN, names, reader, runs, verbosity, written
from resources.base import AGENT, SYSTEM, titled


class RemindToTag(Handler):
    def handle(self, context: Context, event: AgentMessageCreated) -> None:
        if not context.agent or not event.text.strip() or reader(context.settings).match(event.text):
            return
        if context.once("untagged", event.text) and not self.waiting(context):
            context.agent.say("untagged", tags=" ".join(written(names(context.settings))))

    def waiting(self, context: Context) -> bool:
        title = context.feature.lines["untagged"].title
        return any(n.title == title and n.data.get("session") == context.agent.session and AGENT not in n.seen
                   for n in Nudges(context.record, actor=SYSTEM)._standing())


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
        leading = LEADING.match(event.text) if context.agent else None
        if not leading or CARRIED.match(event.text) or leading.group(1) not in SHOWN[verbosity(context.settings)]:
            return
        text = LEADING.sub("", event.text, count=1).strip()
        if text and context.once("shown", event.text):
            Messages(context.record, actor=AGENT).create(titled(text), brief=text, tag=leading.group(1))
