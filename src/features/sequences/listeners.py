from controllers.types import CONTROLLERS
from events import Fact
from events.agents import AgentTurnWritten, ClockTicked, ToolCallAnswered, ToolFinished
from events.questions import QuestionCompleted
from events.resources import AnyEvent
from events.sequences import SequenceMoved
from events.sequences_run import (DispatchDue, RunEnded, SequenceStarts, StepCountRestarted, StepEdited, StepFollowed, StepHeld, StepStalled, StepTakenUp, StepToSay,
                                  TalkKeptOut)
from events.triggers import TriggerFired
from features.sequences.dispatch import BOARD_OF_MESSAGE, DISPATCH_MODELS, board_of, request_of, unchosen
from features.sequences.steps import about_flag, about_of, chat_rule, held_writes, matches, step_values
from receiving import Listener
from resources.sequences import Run, RunKey, Sequence
from resources.triggers import START, Trigger
from resources.types import TYPES, AgentRow, Message, Question
from serving import Providers, ReadElsewhere, ReadMarks, ReadRows, ReadSessions, Settings

ENGINE_NAME = "sequences"


def working_agent(sessions: ReadSessions, agents: ReadRows[AgentRow], env: str):
    """The agent the environment's sequences are handed to: the one whose session holds it, else the one the chat is with."""
    holder = sessions.holder(env)
    return (agents.rows.by_title(holder) if holder else None) or agents.primary_to_read()


def starting(sequences: ReadRows[Sequence], elsewhere: ReadElsewhere, moment: str, event, about: str) -> list[Fact]:
    """The sequences whose start rule the moment meets."""
    facts = []
    for row in sequences.open_rows():
        if row.extras.get("starts_on") != moment or (row.extras.get("started_by") and row.extras["started_by"] != event.actor):
            continue
        if row.extras.get("only_when_idle") and sequences.in_hand():
            continue
        unless = sequences.peek(row.n).unless
        if unless and event.type in CONTROLLERS and matches(elsewhere.here().rows_named(event.type).peek(event.n), unless):
            continue
        facts.append(SequenceStarts(sequence=row.n, about=about))
    return facts


class SpotSequenceToStartOnMoment(Listener[AnyEvent]):
    def listen(self, event: AnyEvent, sequences: ReadRows[Sequence], elsewhere: ReadElsewhere) -> list[Fact]:
        if event.type == "sequence" or event.type not in TYPES or event.action not in TYPES[event.type].moments:
            return []
        return starting(sequences, elsewhere, f"{event.type}.{event.action}", event, f"{event.type}:{event.n}")


class SpotSequenceToStartOnTrigger(Listener[TriggerFired]):
    def listen(self, event: TriggerFired, triggers: ReadRows[Trigger], sequences: ReadRows[Sequence], elsewhere: ReadElsewhere) -> list[Fact]:
        if triggers.load(event.n).does != START:
            return []
        return starting(sequences, elsewhere, f"trigger:{event.n}", event, event.about or f"trigger:{event.n}")


class SpotRunOfADeletedRow(Listener[AnyEvent]):
    def listen(self, event: AnyEvent, sequences: ReadRows[Sequence], elsewhere: ReadElsewhere) -> list[Fact]:
        if event.action != "deleted" or event.type == "sequence":
            return []
        key = RunKey(elsewhere.here().record.env, f"{event.type}:{event.n}").text
        return [RunEnded(sequence=row.n, key=key) for row in sequences.open_rows() if key in sequences.peek(row.n).runs]


class SpotSequenceChange(Listener[AnyEvent]):
    def listen(self, event: AnyEvent, agents: ReadRows[AgentRow]) -> list[Fact]:
        return [StepCountRestarted(agent=agent.n) for agent in agents.running()] if event.type == "sequence" else []


def due_to_dispatch(agent, sequence, key: str, why: str, messages: ReadRows[Message], elsewhere: ReadElsewhere, providers: Providers) -> list[Fact]:
    about = RunKey.of(key).about
    record = elsewhere.here().record
    board = board_of(messages, record, about)
    if not board:
        return []
    models = DISPATCH_MODELS.keyed(record)
    model = providers.model_for(agent.provider, models.get(sequence.dispatch, unchosen)(record, agent.provider))
    return [DispatchDue(agent=agent.n, session=agent.title, env=record.env, sequence=sequence.n, title=sequence.title, kind=sequence.dispatch, about=about, board=board,
                        model=model, why=why, request=request_of(messages, about)).once(f"{agent.n}|{sequence.n}|{key}|{sequence.started(key)}|{why}")]


class SpotStepToHand(Listener[SequenceMoved]):
    def listen(self, event: SequenceMoved, sequences: ReadRows[Sequence], agents: ReadRows[AgentRow], messages: ReadRows[Message], sessions: ReadSessions,
               elsewhere: ReadElsewhere, providers: Providers) -> list[Fact]:
        record = elsewhere.here().record
        agent = working_agent(sessions, agents, record.env)
        if agent is None:
            return []
        facts = []
        sequence = sequences.load(event.n) if event.action != "deleted" else None
        if sequence and sequence.dispatch:
            for key, run in sequence.runs.items():
                if RunKey.of(key).here(record.env) and not run.get("agent"):
                    why = f"retry {int(run['retried'])}" if run.get("retried") else "a new request"
                    facts += due_to_dispatch(agent, sequence, key, why, messages, elsewhere, providers)
        found = sequences.in_hand()
        if not found or found[2].get("followed") == found[2]["step"]:
            return [*facts, StepTakenUp(agent=agent.n)]
        sequence, key, run = found
        values = {**step_values(sequences, messages, record, sequence, key, Run.from_json(run)), "about": about_flag(key), "chat_rule": chat_rule(sequence)}
        return [*facts, StepHeld(agent=agent.n, sequence=sequence.n, title=sequence.title, step=run["step"], about=about_flag(key)),
                StepToSay(agent=agent.n, values=values).once(f"{agent.n}|{sequence.n}|{key}|{run['step']}|{run.get('stepped', run['at'])}")]


class SpotNoStepInHand(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, sequences: ReadRows[Sequence]) -> list[Fact]:
        return [] if sequences.in_hand() else [StepTakenUp(agent=event.agent)]


class SpotStepStandingThroughWrites(Listener[ToolFinished]):
    def listen(self, event: ToolFinished, sequences: ReadRows[Sequence], agents: ReadRows[AgentRow], marks: ReadMarks, settings: Settings) -> list[Fact]:
        found = sequences.in_hand()
        if not found or not agents.peek(event.agent).wrote or found[2].get("followed") != found[2]["step"]:
            return []
        sequence, key, run = found
        edits = marks.last(ENGINE_NAME).edits + 1
        stalled = [StepStalled(agent=event.agent, sequence=sequence.n, title=sequence.title, step=run["step"], edits=edits, about=about_flag(key))] if edits >= settings.step_after else []
        return [StepEdited(agent=event.agent, edits=edits), *stalled]


class SpotTalkInChat(Listener[AgentTurnWritten]):
    def listen(self, event: AgentTurnWritten, sequences: ReadRows[Sequence]) -> list[Fact]:
        found = sequences.in_hand()
        if not found or not found[0].talks_in or not event.text.strip():
            return []
        sequence, key, run = found
        return [TalkKeptOut(agent=event.agent, title=sequence.title, place=sequence.talks_in).once(f"{event.agent}|{sequence.n}|{key}|{run['at']}")]


class SpotStepFollowed(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, sequences: ReadRows[Sequence]) -> list[Fact]:
        held = None if event.why or event.subagent else held_writes(sequences, event.command)
        if held is None or not held[3]:
            return []
        return [StepFollowed(sequence=held[0].n, about=about_of(held[1]))]


class SpotQuestionToDispatchAgain(Listener[QuestionCompleted]):
    def listen(self, event: QuestionCompleted, sequences: ReadRows[Sequence], questions: ReadRows[Question], agents: ReadRows[AgentRow], messages: ReadRows[Message],
               sessions: ReadSessions, elsewhere: ReadElsewhere, providers: Providers) -> list[Fact]:
        record = elsewhere.here().record
        agent = working_agent(sessions, agents, record.env)
        question = questions.load(event.n)
        boards = [ref for ref in question.refs if ref.startswith("board:")]
        if not agent or not boards:
            return []
        facts = []
        for row in sequences.open_rows():
            sequence = sequences.peek(row.n)
            if not sequence.dispatch:
                continue
            for key in sequence.runs:
                run_key = RunKey.of(key)
                if run_key.here(record.env) and f"board:{board_of(messages, record, run_key.about)}" in boards:
                    facts += due_to_dispatch(agent, sequence, key, f"question {question.n} answered: {question.outcome}", messages, elsewhere, providers)
        return facts
