from events import Fact
from events.helpers import (AnswerToRelay, HelperAsks, HelperBriefed, HelperContinued, HelperIdle, HelperQuiet, HelperRefused, HelperStopped, HelperTold, HelperTurnFailed,
                            SubagentAsks, SubagentTouched, Telling)
from receiving import Handler
from resources.types import AgentRow, Helper
from serving import Chat, Elsewhere, Rows

FILES_KEPT = 50


def mark_helper_told(event: HelperTold, agents: Rows[AgentRow], helpers: Rows[Helper]) -> None:
    """The chat mark for a helper given more work, so a helper started again after it went idle reads differently from one already working that was told its next job."""
    row = helpers.peek(event.n)
    agents.mark_primary(Telling(event.action).mark(event.n), name=row.name, icon="bot", kind="helpers", helper=event.n, detail=row.latest)


class MarkTheHelperContinued(Handler[HelperContinued]):
    def handle(self, event: HelperContinued, agents: Rows[AgentRow], helpers: Rows[Helper]) -> list[Fact]:
        mark_helper_told(event, agents, helpers)
        return []


class MarkTheHelperBriefed(Handler[HelperBriefed]):
    def handle(self, event: HelperBriefed, agents: Rows[AgentRow], helpers: Rows[Helper]) -> list[Fact]:
        mark_helper_told(event, agents, helpers)
        return []


class TellAFailedTurn(Handler[HelperTurnFailed]):
    def handle(self, event: HelperTurnFailed, helpers: Rows[Helper]) -> list[Fact]:
        helpers.failed(event.failure)
        return []


class NameRefusedHelper(Handler[HelperRefused]):
    def handle(self, event: HelperRefused, chat: Chat) -> list[Fact]:
        chat.say("refused", n=event.n, name=event.name, provider=event.provider, reason=event.reason, rows=[event.ref])
        return []


class NameStoppedHelper(Handler[HelperStopped]):
    def handle(self, event: HelperStopped, chat: Chat) -> list[Fact]:
        chat.say("stopped", n=event.n, name=event.name, cause=event.cause, rows=[event.ref])
        return []


class NameQuietHelper(Handler[HelperQuiet]):
    def handle(self, event: HelperQuiet, chat: Chat) -> list[Fact]:
        chat.say("quiet", n=event.n, name=event.name, minutes=event.minutes)
        return []


class NameIdleHelper(Handler[HelperIdle]):
    def handle(self, event: HelperIdle, chat: Chat) -> list[Fact]:
        chat.say("idle", n=event.n, name=event.name, minutes=event.minutes)
        return []


class RelayAnswerToDispatcher(Handler[AnswerToRelay]):
    def handle(self, event: AnswerToRelay, helpers: Rows[Helper]) -> list[Fact]:
        helpers.relay(event.message)
        return []


class TellAQuestionAskedAway(Handler[HelperAsks]):
    def handle(self, event: HelperAsks, elsewhere: Elsewhere) -> list[Fact]:
        elsewhere.named(event.environment).chat().say("helper asking", who=event.who, question=event.question, text=event.text, options=event.options,
                                                    command=event.command, rows=[event.ref])
        return []


class TellASubagentAsking(Handler[SubagentAsks]):
    def handle(self, event: SubagentAsks, chat: Chat) -> list[Fact]:
        chat.say("subagent asking", who=event.who, question=event.question, text=event.text, options=event.options, command=event.command, rows=[event.ref])
        return []


class KeepSubagentFiles(Handler[SubagentTouched]):
    def handle(self, event: SubagentTouched, agents: Rows[AgentRow]) -> list[Fact]:
        row = agents.peek(event.agent)
        agents.update(row.n, touched_files=[*row.touched_files, *event.files][-FILES_KEPT:])
        return []
