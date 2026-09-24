from controllers.types import Agents
from engine.events import CommandRan, ResourceCreated
from features.parts import AgentContext, Context, Handler, ToolInterceptor
from features.sharing.visitors import AGREEMENT, UNAGREED, read_now
from resources.base import SYSTEM

AGREE_COMMAND = "share agree"


class HoldOnVisitorComment(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        if AGREE_COMMAND in event.command:
            return
        read = read_now(context.record, event.command, event.output)
        if read:
            row = context.agent.row
            Agents(context.record, actor=SYSTEM).update(row.n, **{UNAGREED: sorted({*row.data.get(UNAGREED, []), *read})})


class RefuseUntilAgreed(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        held = context.agent.row.data.get(UNAGREED, [])
        if not held or any(AGREE_COMMAND in command for command in call.commands):
            return ""
        title, brief = context.feature.line("agree", {"comments": ", ".join(map(str, held)), "words": AGREEMENT})
        return f"{title} - {brief}"


class NameVisitorComment(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "comment":
            return
        comment = context.journal.of("comment").load(event.n)
        if not comment.data.get("visitor"):
            return
        agent = context.journal.agents.primary()
        if agent:
            context.speaking_to(agent).agent.whisper("commented", name=comment.data["visitor"], about=comment.refs[0].replace(":", " "), n=comment.n)
