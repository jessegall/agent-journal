import re

from controllers.types import Agents, Comments
from engine.events.engine import CommandRan
from engine.events.resources import CommentCreated
from engine.journal_calls import parsed
from features.parts import AgentContext, Context, Handler, ToolInterceptor
from features.sharing.visitors import AGREEMENT, UNAGREED, hold, read_now
from resources.base import SYSTEM
from engine.reach import Reach

PLAIN = re.compile(r"[\w .:@/+-]+")
AGREE_OPTIONS = {"--env", "--agent", "--root"}
USER_ACTOR = re.compile(r"(?:^|[\s?&])(?:--as(?:=|\s+)|JOURNAL_ACTOR\s*=|actor\s*=)\s*['\"]?user\b", re.I)


class RefuseClaimedUser(ToolInterceptor):
    reach = Reach.BOTH

    def intercept(self, context: AgentContext, call) -> str:
        if any(USER_ACTOR.search(command) for command in call.commands):
            return "An agent cannot claim to be the user. Ask the user to make this change in the viewer."
        return ""


def only_agree(command: str) -> bool:
    call = parsed(command)
    return (call is not None and set(call.options) <= AGREE_OPTIONS and all(PLAIN.fullmatch(value) for value in call.options.values())
            and call.matches("share", "agree") and len(call.arguments) == 2 and call.arguments[0].isdigit() and call.arguments[1] == AGREEMENT)


class HoldOnVisitorComment(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        if only_agree(event.command):
            return
        read = read_now(context.record, event.command, event.output)
        if read:
            hold(Agents(context.record, actor=SYSTEM), context.agent.row, read)


class RefuseUntilAgreed(ToolInterceptor):
    reach = Reach.BOTH
    def intercept(self, context: AgentContext, call) -> str:
        held = context.agent.row.data.get(UNAGREED, [])
        if not held or len(call.commands) == 1 and only_agree(call.commands[0]):
            return ""
        return context.feature.line_text("agree", comments=", ".join(map(str, held)), words=AGREEMENT)


class NameVisitorComment(Handler):
    def handle(self, context: Context, event: CommentCreated) -> None:
        comment = Comments(context.record, actor=SYSTEM).load(event.n)
        if not comment.data.get("visitor"):
            return
        agent = context.journal.get(Agents).primary()
        if agent:
            line = "trusted" if comment.data.get("trusted") else "commented"
            context.speaking_to(agent).agent.whisper(line, name=comment.data["visitor"], about=comment.refs[0].replace(":", " "), n=comment.n)
