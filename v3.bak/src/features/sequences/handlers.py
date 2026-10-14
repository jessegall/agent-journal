from events import Fact
from events.sequences_run import (DispatchDue, RunEnded, SequenceStarts, StepCountRestarted, StepEdited, StepFollowed, StepHeld, StepStalled, StepTakenUp, StepToSay,
                                  TalkKeptOut)
from features.sequences.details import DISPATCH, IN_CHAT, STEP, STEP_HELD, STEP_STALLED
from features.sequences.listeners import ENGINE_NAME
from receiving import Handler
from resources.sequences import Sequence
from serving import Chat, Marks, Rows, Sessions


class RunTheSequence(Handler[SequenceStarts]):
    def handle(self, event: SequenceStarts, sequences: Rows[Sequence]) -> list[Fact]:
        sequences.run(event.sequence, about=event.about)
        return []


class DropTheRun(Handler[RunEnded]):
    def handle(self, event: RunEnded, sequences: Rows[Sequence]) -> list[Fact]:
        sequence = sequences.peek(event.sequence)
        sequences.update(sequence.n, runs=sequences.without(sequence, event.key))
        return []


class HoldTheAgentToTheStep(Handler[StepHeld]):
    def handle(self, event: StepHeld, chat: Chat) -> list[Fact]:
        chat.hold(STEP_HELD, STEP, n=event.sequence, title=event.title, step=event.step, about=event.about)
        return []


class TellTheStep(Handler[StepToSay]):
    def handle(self, event: StepToSay, chat: Chat) -> list[Fact]:
        chat.say(STEP, **event.values)
        return []


class LetTheAgentGo(Handler[StepTakenUp]):
    def handle(self, event: StepTakenUp, chat: Chat) -> list[Fact]:
        chat.release(STEP)
        return []


class TellTheDispatch(Handler[DispatchDue]):
    def handle(self, event: DispatchDue, chat: Chat, sessions: Sessions) -> list[Fact]:
        sessions.grant(event.session, event.env)
        chat.say(DISPATCH, kind=event.kind, n=event.sequence, title=event.title, about=event.about, board=event.board, model=event.model, why=event.why,
                 request=event.request)
        return []


class CountTheEdit(Handler[StepEdited]):
    def handle(self, event: StepEdited, marks: Marks) -> list[Fact]:
        marks.write(ENGINE_NAME, edits=event.edits)
        return []


class HoldTheStalledStep(Handler[StepStalled]):
    def handle(self, event: StepStalled, chat: Chat) -> list[Fact]:
        chat.hold(STEP_STALLED, n=event.sequence, title=event.title, step=event.step, edits=event.edits, about=event.about)
        return []


class CountTheEditsAfresh(Handler[StepCountRestarted]):
    def handle(self, event: StepCountRestarted, marks: Marks, chat: Chat) -> list[Fact]:
        marks.write(ENGINE_NAME, edits=0)
        chat.release()
        return []


class NameTheChatRule(Handler[TalkKeptOut]):
    def handle(self, event: TalkKeptOut, chat: Chat) -> list[Fact]:
        chat.nudge(IN_CHAT, title=event.title, place=event.place)
        return []


class FollowTheStep(Handler[StepFollowed]):
    def handle(self, event: StepFollowed, sequences: Rows[Sequence]) -> list[Fact]:
        sequences.follow(event.sequence, about=event.about)
        return []
