import re
import shlex

from controllers.types import Agents
from engine.events.engine import CommandRan
from engine.events.resources import ResourceCreated
from features.parts import AgentContext, Context, Handler, ToolInterceptor
from features.sharing.visitors import AGREEMENT, UNAGREED, read_now
from resources.base import SYSTEM
from engine.reach import Reach

PLAIN = re.compile(r"[\w .:@/+-]+")
USER_ACTOR = re.compile(r"(?:^|[\s?&])(?:--as(?:=|\s+)|JOURNAL_ACTOR\s*=|actor\s*=)\s*['\"]?user\b", re.I)


class RefuseClaimedUser(ToolInterceptor):
    reach = Reach.BOTH

    def intercept(self, context: AgentContext, call) -> str:
        if any(USER_ACTOR.search(command) for command in call.commands):
            return "An agent cannot claim to be the user. Ask the user to make this change in the viewer."
        return ""


def only_agree(command: str) -> bool:
    try:
        words = shlex.split(command)
    except ValueError:
        return False
    if not words or words[0] != "journal":
        return False
    words = words[1:]
    while words and words[0].startswith("--"):
        option, separator, value = words[0].partition("=")
        taken = 1 if separator else 2
        if not separator:
            value = " ".join(words[1:2])
        if option not in ("--env", "--agent", "--root") or not PLAIN.fullmatch(value):
            return False
        words = words[taken:]
    return len(words) == 4 and words[:2] == ["share", "agree"] and words[2].isdigit() and words[3] == AGREEMENT


class HoldOnVisitorComment(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        if only_agree(event.command):
            return
        read = read_now(context.record, event.command, event.output)
        if read:
            row = context.agent.row
            Agents(context.record, actor=SYSTEM).update(row.n, **{UNAGREED: sorted({*row.data.get(UNAGREED, []), *read})})


class RefuseUntilAgreed(ToolInterceptor):
    reach = Reach.BOTH
    def intercept(self, context: AgentContext, call) -> str:
        held = context.agent.row.data.get(UNAGREED, [])
        if not held or len(call.commands) == 1 and only_agree(call.commands[0]):
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
            line = "trusted" if comment.data.get("trusted") else "commented"
            context.speaking_to(agent).agent.whisper(line, name=comment.data["visitor"], about=comment.refs[0].replace(":", " "), n=comment.n)
