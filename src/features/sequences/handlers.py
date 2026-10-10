import time
from dataclasses import asdict, dataclass
from typing import ClassVar

from controllers.types import Questions
from engine.events.engine import AgentMessageSending, ClockTicked
from engine.events.resources import AnyEvent, QuestionAnswered, ResourceEvent
from engine.journal_calls import JournalCall, calls
from engine.transcript import IDLE
from features.journal import waiting
from features.sending import Sent
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler, ToolInterceptor
from engine.gates import Runs, STILL_HELD
from features.work_tracking.details import WorkDetails
from features.sequences.details import IN_CHAT, STEP, STEP_HELD, UNFINISHED
from features.sequences.dispatch import board_of, dispatched_by_line, working_agent
from features.sequences.resource import Run, RunKey
from features.triggers.controller import Triggers
from features.triggers.resource import FIRED, START
from controllers.types import CONTROLLERS
from resources.base import SECTION, SYSTEM
from resources.types import TYPES
from engine.reach import Reach
from features.trigger import MINUTE
from features.sequences.controller import Sequences

FREE_NOUNS = ("search", "carry", "status", "user", "conversation", "upgrade", "heal", "verify", "version", "help", "stop")
FREE_VERBS = ("show", "read", "comments", "all", "progress", "search", "unread", "board", "screen", "paths", "find", "linked_to", "members",
              "tasks", "revisions", "revision", "changes", "files", "--help")


@dataclass(frozen=True)
class SequenceMoved(ResourceEvent):
    on: ClassVar[str] = "sequence"


@dataclass(frozen=True)
class TriggerFired(ResourceEvent):
    on: ClassVar[str] = f"trigger.{FIRED}"
    about: str = ""


def about_of(key: str) -> str | None:
    run_key = RunKey.of(key)
    return None if run_key.by_hand else run_key.about


def about_flag(key: str) -> str:
    about = about_of(key)
    return "" if about is None else f" --about {about}"


def filled(context: Context, n: int, key: str, body: str) -> str:
    about = about_of(key)
    text = body.replace("<this sequence>", str(n))
    if about is None:
        return text
    kind, _, number = about.partition(":")
    board = board_of(context, about)
    text = text.replace("<ref>", about).replace(f"<{kind} n>", number).replace("<ref n>", number).replace("<type>", kind)
    return text.replace("<board n>", str(board)) if board else text


def matches(found, values: dict) -> bool:
    return all(found.data.get(key) == value for key, value in values.items())


class StartOnMoment(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.type == "sequence" or event.type not in TYPES or event.action not in TYPES[event.type].moments:
            return
        start(context, f"{event.type}.{event.action}", event, f"{event.type}:{event.n}")


class StartOnTrigger(Handler):
    def handle(self, context: Context, event: TriggerFired) -> None:
        if Triggers(context.record, actor=SYSTEM).load(event.n).does == START:
            start(context, f"trigger:{event.n}", event, event.about or f"trigger:{event.n}")


def start(context: Context, moment: str, event: ResourceEvent, about: str) -> None:
    sequences = context.journal.get(Sequences)
    for row in sequences.open_rows():
        if row.get("starts_on") != moment:
            continue
        if row.get("started_by") and row["started_by"] != event.actor:
            continue
        if row.get("only_when_idle") and sequences.in_hand():
            continue
        unless = sequences.load(row["n"]).unless
        if unless and event.type in CONTROLLERS and matches(CONTROLLERS[event.type](context.record, actor=SYSTEM).load(event.n), unless):
            continue
        sequences.run(row["n"], about=about)


class EndWithItsRow(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if event.action != "deleted" or event.type == "sequence":
            return
        sequences = context.journal.get(Sequences)
        key = RunKey(context.record.env, f"{event.type}:{event.n}").text
        for row in sequences.open_rows():
            sequence = sequences.load(row["n"])
            if key in sequence.runs:
                sequences.update(sequence.n, runs=sequences.without(sequence, key))


@dataclass(frozen=True)
class StepInHand:
    n: int
    title: str
    step: int
    count: int
    name: str
    body: str
    then: str


def step_values(context: Context, sequence, key: str, run: Run) -> dict:
    steps = context.journal.get(Sequences).steps_of(sequence)
    part = steps[run.step - 1]
    return asdict(StepInHand(sequence.n, sequence.title, run.step, len(steps), part[SECTION.title],
                             filled(context, sequence.n, key, part[SECTION.body]), then_next(sequence.n, key, part[SECTION.body])))


class HandStepToAgent(Handler):
    def handle(self, context: Context, event: SequenceMoved) -> None:
        agent = working_agent(context)
        sequence = context.journal.get(Sequences).load(event.n) if agent and event.action != "deleted" else None
        if sequence and sequence.dispatch:
            for key, run in sequence.runs.items():
                if RunKey.of(key).here(context.record.env) and not run.get("agent"):
                    dispatched_by_line(context, agent, sequence, key, f"retry {int(run['retried'])}" if run.get("retried") else "a new request")
        found = context.journal.get(Sequences).in_hand() if agent else None
        if not found:
            if agent:
                context.speaking_to(agent).release(STEP)
            return
        sequence, key, run = found
        speaking = context.speaking_to(agent)
        if run.get("followed") == run["step"]:
            speaking.release(STEP)
            return
        speaking.hold(STEP_HELD, STEP, n=sequence.n, title=sequence.title, step=run["step"], about=about_flag(key))
        speaking.once(STEP, f"{sequence.n}|{key}|{run['step']}|{run.get('stepped', run['at'])}", lambda: speaking.agent.say(
            STEP, **step_values(context, sequence, key, Run.from_json(run)), about=about_flag(key), chat_rule=chat_rule(sequence)))


def then_next(n: int, key: str, body: str) -> str:
    return "" if "sequence next" in body else f" When it is done: journal sequence next {n}{about_flag(key)}."


def chat_rule(sequence) -> str:
    return f" Write nothing in the chat while this runs: the user is in {sequence.talks_in}." if sequence.talks_in else ""


def step_in_hand(record, session: str) -> bool:
    """Whether a step of a sequence is still handed to the agent and not taken up, which is all that holds its writes for a sequence."""
    found = Sequences(record, actor=SYSTEM).in_hand()
    return bool(found) and found[2].get("followed") != found[2]["step"]


STILL_HELD["sequences.step"] = step_in_hand


class ReleaseStaleStep(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        if not context.journal.get(Sequences).in_hand():
            context.release(STEP)


class KeepOutOfTheChat(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        found = context.journal.get(Sequences).in_hand()
        if not found or not found[0].talks_in or not event.text.strip():
            return
        event.stop()
        sequence, key, run = found
        if context.once(IN_CHAT, f"{sequence.n}|{key}|{run['at']}"):
            context.agent.whisper(IN_CHAT, title=sequence.title, place=sequence.talks_in)


def step_pace(context: AgentContext) -> int:
    if waiting(context.record, context.agent.row):
        return minutes(WorkDetails.values(context.record).ask_awaiting_every)
    return minutes(context.feature.cadence(context.record, UNFINISHED).every)


def minutes(value) -> int:
    return max(1, int(value)) if str(value).strip().isdigit() else 1


def asked_since(context: AgentContext, at: float, about: set) -> bool:
    return any(not row["completed"] and not row["deleted"] and row["updated"] >= at and about & set(row["refs"])
               for row in context.journal.get(Questions).rows.summaries())


def standing_steps(context: AgentContext, agent) -> list[Sent]:
    found = context.journal.get(Sequences).in_hand()
    if not found or found[0].lasting:
        return []
    sequence, key, run = found
    handed = run.get("stepped", run["at"])
    standing = time.time() - handed >= step_pace(context) * MINUTE
    if not (agent.status == IDLE or standing) or asked_since(context, handed, {sequence.ref, RunKey.of(key).about}):
        return []
    return [Sent(f"{sequence.n}|{key}|{run['step']}", step_values(context, sequence, key, Run.from_json(run)))]


def free_while_held(found: JournalCall) -> bool:
    return found.matches("sequence", "follow", "next", "abandon") or found.matches("message") or found.noun in FREE_NOUNS or found.verb in FREE_VERBS


def named_in(found: JournalCall, step: str) -> bool:
    return bool(found.verb) and f"journal {found.noun} {found.verb}" in step


class HoldJournalWritesForTheStep(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.SYNC
    def intercept(self, context: AgentContext, call) -> str:
        found = context.journal.get(Sequences).in_hand()
        if not found or found[2].get("followed") == found[2]["step"]:
            return ""
        sequence, key, run = found
        held = [made for command in call.commands for made in calls(command) if not free_while_held(made)]
        if not held:
            return ""
        step = context.journal.get(Sequences).steps_of(sequence)[run["step"] - 1][SECTION.body]
        if all(named_in(made, step) for made in held):
            context.journal.get(Sequences).follow(sequence.n, about=about_of(key))
            return ""
        return context.feature.line_text(STEP_HELD, n=sequence.n, title=sequence.title, step=run["step"], about=about_flag(key))


class DispatchAgainOnAnswer(Handler):
    def handle(self, context: Context, event: QuestionAnswered) -> None:
        agent = working_agent(context)
        question = Questions(context.record, actor=SYSTEM).load(event.n)
        boards = [ref for ref in question.refs if ref.startswith("board:")]
        if not agent or not boards:
            return
        for row in context.journal.get(Sequences).open_rows():
            sequence = context.journal.get(Sequences).load(row["n"])
            if not sequence.dispatch:
                continue
            for key in sequence.runs:
                run_key = RunKey.of(key)
                if run_key.here(context.record.env) and f"board:{board_of(context, run_key.about)}" in boards:
                    dispatched_by_line(context, agent, sequence, key, f"question {question.n} answered: {question.outcome}")
