import time
from dataclasses import dataclass
from typing import ClassVar

from controllers.types import Questions
from engine.events.engine import AgentMessageSending, ClockTicked
from engine.events.resources import AnyEvent, QuestionAnswered, ResourceEvent
from engine.journal_calls import JournalCall, calls
from engine.transcript import IDLE
from features.journal import waiting
from features.nudges import Sent
from features.parts import AgentContext, Context, Handler, ToolInterceptor
from features.work_tracking.details import WorkDetails
from features.sequences.details import IN_CHAT, STEP, STEP_HELD, WAITING
from features.sequences.dispatch import board_of, dispatched_by_line, working_agent
from features.sequences.resource import RunKey
from features.triggers.controller import Triggers
from features.triggers.resource import FIRED, START
from controllers.types import CONTROLLERS
from resources.base import SECTION, SYSTEM
from resources.types import TYPES
from engine.reach import Reach
from features.trigger import MINUTE

FREE_NOUNS = ("search", "carry", "status", "user", "conversation")
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
    sequences = context.journal.sequences
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
        sequences = context.journal.sequences
        key = RunKey(context.record.env, f"{event.type}:{event.n}").text
        for row in sequences.open_rows():
            sequence = sequences.load(row["n"])
            if key in sequence.runs:
                sequences.update(sequence.n, runs=sequences.without(sequence, key))


def unfinished_steps(context, agent) -> list[Sent]:
    found = context.journal.sequences.in_hand() if agent.status == IDLE else None
    if not found or found[0].lasting:
        return []
    sequence, key, _ = found
    run = sequence.run(key)
    left = context.journal.sequences.left(sequence, key)
    return [Sent(f"{sequence.n}|{key}|{run.step}", {"n": sequence.n, "title": sequence.title, "step": run.step,
                                                     "count": len(context.journal.sequences.steps_of(sequence)), "about": about_flag(key), "left": "; ".join(left)})]


def step_values(context: Context, sequence, key: str, run: dict) -> dict:
    steps = context.journal.sequences.steps_of(sequence)
    part = steps[run["step"] - 1]
    return {"n": sequence.n, "title": sequence.title, "step": run["step"], "count": len(steps), "name": part[SECTION.title],
            "body": filled(context, sequence.n, key, part[SECTION.body]), "about": about_flag(key), "then": then_next(sequence.n, key, part[SECTION.body])}


class HandStepToAgent(Handler):
    def handle(self, context: Context, event: SequenceMoved) -> None:
        agent = working_agent(context)
        sequence = context.journal.sequences.load(event.n) if agent and event.action != "deleted" else None
        if sequence and sequence.dispatch:
            for key, run in sequence.runs.items():
                if RunKey.of(key).here(context.record.env) and not run.get("agent"):
                    dispatched_by_line(context, agent, sequence, key, f"retry {int(run['retried'])}" if run.get("retried") else "a new request")
        found = context.journal.sequences.in_hand() if agent else None
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
            STEP, **step_values(context, sequence, key, run), chat_rule=chat_rule(sequence)))


def then_next(n: int, key: str, body: str) -> str:
    return "" if "sequence next" in body else f" When it is done: journal sequence next {n}{about_flag(key)}."


def chat_rule(sequence) -> str:
    return f" Write nothing in the chat while this runs: the user is in {sequence.talks_in}." if sequence.talks_in else ""


class KeepOutOfTheChat(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSending) -> None:
        found = context.journal.sequences.in_hand()
        if not found or not found[0].talks_in or not event.text.strip():
            return
        event.stop()
        sequence, key, run = found
        if context.once(IN_CHAT, f"{sequence.n}|{key}|{run['at']}"):
            context.agent.whisper(IN_CHAT, title=sequence.title, place=sequence.talks_in)


def pace(context: AgentContext, own) -> int:
    if waiting(context.record, context.agent.row):
        return minutes(WorkDetails.values(context.record).ask_awaiting_every)
    return minutes(own)


def unfinished_pace(context: AgentContext) -> int:
    return pace(context, context.feature.cadence(context.record, "unfinished").every)


def minutes(value) -> int:
    return max(1, int(value)) if str(value).strip().isdigit() else 1


def asked_since(context: AgentContext, at: float, about: set) -> bool:
    return any(not row["completed"] and not row["deleted"] and row["updated"] >= at and about & set(row["refs"])
               for row in context.journal.questions.summaries())


class NudgeWaitingStep(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        found = context.journal.sequences.in_hand()
        if not found or found[0].lasting:
            return
        sequence, key, run = found
        handed = run.get("stepped", run["at"])
        waited = int((time.time() - handed) // (pace(context, context.settings.nudge_every) * MINUTE))
        if waited < 1 or asked_since(context, handed, {sequence.ref, RunKey.of(key).about}):
            return
        context.once(WAITING, f"{sequence.n}|{key}|{run['step']}|{handed}|{waited}", lambda: context.agent.say(
            WAITING, **step_values(context, sequence, key, run)))


def free_while_held(found: JournalCall) -> bool:
    return found.matches("sequence", "follow", "next", "abandon") or found.matches("message") or found.noun in FREE_NOUNS or found.verb in FREE_VERBS


def named_in(found: JournalCall, step: str) -> bool:
    return bool(found.verb) and f"journal {found.noun} {found.verb}" in step


class HoldJournalWritesForTheStep(ToolInterceptor):
    reach = Reach.MAIN
    def intercept(self, context: AgentContext, call) -> str:
        found = context.journal.sequences.in_hand()
        if not found or found[2].get("followed") == found[2]["step"]:
            return ""
        sequence, key, run = found
        held = [made for command in call.commands for made in calls(command) if not free_while_held(made)]
        if not held:
            return ""
        step = context.journal.sequences.steps_of(sequence)[run["step"] - 1][SECTION.body]
        if all(named_in(made, step) for made in held):
            context.journal.sequences.follow(sequence.n, about=about_of(key))
            return ""
        return context.feature.spoken(STEP_HELD, n=sequence.n, title=sequence.title, step=run["step"], about=about_flag(key))


class DispatchAgainOnAnswer(Handler):
    def handle(self, context: Context, event: QuestionAnswered) -> None:
        agent = working_agent(context)
        question = Questions(context.record, actor=SYSTEM).load(event.n)
        boards = [ref for ref in question.refs if ref.startswith("board:")]
        if not agent or not boards:
            return
        for row in context.journal.sequences.open_rows():
            sequence = context.journal.sequences.load(row["n"])
            if not sequence.dispatch:
                continue
            for key in sequence.runs:
                run_key = RunKey.of(key)
                if run_key.here(context.record.env) and f"board:{board_of(context, run_key.about)}" in boards:
                    dispatched_by_line(context, agent, sequence, key, f"question {question.n} answered: {question.outcome}")
