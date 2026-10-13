import re

from resources.sharing import AGREEMENT, UNAGREED
from engine.journal_calls import parsed, tokens
from events.answers import Allowed, Answer, Refused
from events.asking import ToolCallAsked
from framework.loaded import FEATURES
from receiving import Answerer
from resources.types import AgentRow
from serving import ReadRows

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


class RefuseClaimedUser(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked) -> Answer:
        if event.command and tells_the_journal(event.command) and claims_the_user(event.command):
            return Refused("An agent cannot claim to be the user. Ask the user to make this change in the viewer.")
        return Allowed()


def only_agree(command: str) -> bool:
    call = parsed(command)
    return (call is not None and set(call.options) <= AGREE_OPTIONS and all(PLAIN.fullmatch(value) for value in call.options.values())
            and call.matches("share", "agree") and len(call.arguments) == 2 and call.arguments[0].isdigit() and call.arguments[1] == AGREEMENT)


class RefuseUntilAgreed(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, agents: ReadRows[AgentRow]) -> Answer:
        held = agents.peek_session(event.session).data.get(UNAGREED, [])
        if not held or only_agree(event.command):
            return Allowed()
        return Refused(FEATURES["sharing"].line_text("agree", comments=", ".join(map(str, held)), words=AGREEMENT))
