import re

from controllers.types import Agents, Comments
from events.agents import CommandRan
from events.comments import CommentCreated
from engine.journal_calls import parsed, tokens
from framework.parts import AgentContext, Context, Handler, ToolInterceptor
from declaring.holds import Runs
from controllers.sharing.visitors import AGREEMENT, UNAGREED, hold, read_now
from resources.base import SYSTEM
from declaring.reach import Reach

PLAIN = re.compile(r"[\w .:@/+-]+")
AGREE_OPTIONS = {"--env", "--agent", "--root"}
USER_ACTOR = re.compile(r"(?:^|[\s?&])(?:--as(?:=|\s+)|JOURNAL_ACTOR\s*=|actor\s*=)\s*['\"]?user\b", re.I)
ASSIGNED = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=")
ASSIGNMENT = re.compile(r"JOURNAL_ACTOR=user", re.I)
SET_ACTOR = re.compile(r"actor=user", re.I)


def tells_the_journal(command: str) -> bool:
    """Whether the command tells the journal anything - as a journal call, behind any leading environment assignments, or as a request to its API - since only then is a claim of the user's name one the journal would act on, rather than a word in a file the agent is writing."""
    words = list(tokens(command))
    while words and ASSIGNED.match(words[0]):
        words.pop(0)
    return (bool(words) and words[0] == "journal") or "/api/" in command


def claims_the_user(command: str) -> bool:
    """Whether the command makes the journal take the user as its actor: by an option, an assignment or a query string, never by prose a quoted word of it holds, since a brief is one word to the shell and names an option only as text."""
    if "/api/" in command:
        return bool(USER_ACTOR.search(command))
    words = tokens(command)
    return any(claims(word, following) for word, following in zip(words, [*words[1:], ""]))


def claims(word: str, following: str) -> bool:
    option, _, given = word.partition("=")
    return bool(ASSIGNMENT.fullmatch(word)) or (option == "--as" and (given or following).lower() == "user") or (option == "--set" and bool(SET_ACTOR.fullmatch(given or following)))


class RefuseClaimedUser(ToolInterceptor):
    reach = Reach.BOTH
    runs = Runs.SYNC

    def intercept(self, context: AgentContext, call) -> str:
        if any(tells_the_journal(command) and claims_the_user(command) for command in call.commands):
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
    runs = Runs.SYNC
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
            context.speaking_to(agent).agent.nudge(line, name=comment.data["visitor"], about=comment.refs[0].replace(":", " "), n=comment.n)
