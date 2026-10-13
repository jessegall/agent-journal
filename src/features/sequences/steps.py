import time
from dataclasses import asdict, dataclass

from controllers.types import Messages, Questions, Sequences
from engine import triggering
from engine.gates import STILL_HELD
from engine.journal_calls import JournalCall, calls
from engine.transcript import IDLE
from features.sequences.dispatch import board_of
from features.work_tracking.details import WorkDetails
from framework.journal import waiting
from framework.parts import AgentContext
from framework.sending import Sent
from declaring.trigger import MINUTE
from features.sequences.details import STEP_HELD, UNFINISHED, SequencesDetails
from resources.base import SECTION, SYSTEM
from resources.sequences import Run, RunKey

FREE_NOUNS = ("search", "carry", "status", "user", "conversation", "upgrade", "heal", "verify", "version", "help", "stop")
FREE_VERBS = ("show", "read", "comments", "all", "progress", "search", "unread", "board", "screen", "paths", "find", "linked_to", "members",
              "tasks", "revisions", "revision", "changes", "files", "--help")


def about_of(key: str) -> str | None:
    run_key = RunKey.of(key)
    return None if run_key.by_hand else run_key.about


def about_flag(key: str) -> str:
    about = about_of(key)
    return "" if about is None else f" --about {about}"


def filled(messages, record, n: int, key: str, body: str) -> str:
    about = about_of(key)
    text = body.replace("<this sequence>", str(n))
    if about is None:
        return text
    kind, _, number = about.partition(":")
    board = board_of(messages, record, about)
    text = text.replace("<ref>", about).replace(f"<{kind} n>", number).replace("<ref n>", number).replace("<type>", kind)
    return text.replace("<board n>", str(board)) if board else text


def matches(found, values: dict) -> bool:
    return all(found.data.get(key) == value for key, value in values.items())


@dataclass(frozen=True)
class StepInHand:
    n: int
    title: str
    step: int
    count: int
    name: str
    body: str
    then: str


def step_values(sequences, messages, record, sequence, key: str, run: Run) -> dict:
    steps = sequences.steps_of(sequence)
    part = steps[run.step - 1]
    return asdict(StepInHand(sequence.n, sequence.title, run.step, len(steps), part[SECTION.title],
                             filled(messages, record, sequence.n, key, part[SECTION.body]), then_next(sequence.n, key, part[SECTION.body])))


def then_next(n: int, key: str, body: str) -> str:
    return "" if "sequence next" in body else f" When it is done: journal sequence next {n}{about_flag(key)}."


def chat_rule(sequence) -> str:
    return f" Write nothing in the chat while this runs: the user is in {sequence.talks_in}." if sequence.talks_in else ""


def step_in_hand(record, session: str) -> bool:
    """Whether a step of a sequence is still handed to the agent and not taken up, which is all that holds its writes for a sequence."""
    found = Sequences(record, actor=SYSTEM).in_hand()
    return bool(found) and found[2].get("followed") != found[2]["step"]


STILL_HELD["sequences.step"] = step_in_hand


def step_stalled(record, session: str) -> bool:
    """Whether a step taken up has stood through more writes than the setting allows, which holds them until the sequence moves on."""
    from framework.loaded import FEATURES
    found = Sequences(record, actor=SYSTEM).in_hand()
    if not found or found[2].get("followed") != found[2]["step"]:
        return False
    feature = FEATURES["sequences"]
    return triggering.last(record, session, feature.name).edits >= int(feature.values(record).get("step_after", 25))


STILL_HELD["sequences.stalled"] = step_stalled


def step_pace(context: AgentContext) -> int:
    if waiting(context.record, context.agent.row):
        return minutes(WorkDetails.values(context.record).ask_awaiting_every)
    return minutes(context.feature.cadence(context.record, UNFINISHED).every)


def minutes(value) -> int:
    return max(1, int(value)) if str(value).strip().isdigit() else 1


def asked_since(context: AgentContext, at: float, about: set) -> bool:
    return any(not row.completed and not row.deleted and row.updated >= at and about & set(row.refs)
               for row in context.journal.get(Questions).rows.summaries())


def standing_steps(context: AgentContext, agent) -> list[Sent]:
    sequences = context.journal.get(Sequences)
    found = sequences.in_hand()
    if not found or found[0].lasting:
        return []
    sequence, key, run = found
    handed = run.get("stepped", run["at"])
    standing = time.time() - handed >= step_pace(context) * MINUTE
    if not (agent.status == IDLE or standing) or asked_since(context, handed, {sequence.ref, RunKey.of(key).about}):
        return []
    return [Sent(f"{sequence.n}|{key}|{run['step']}", step_values(sequences, context.journal.get(Messages), context.record, sequence, key, Run.from_json(run)))]


def free_while_held(found: JournalCall) -> bool:
    return found.matches("sequence", "follow", "next", "abandon") or found.matches("message") or found.noun in FREE_NOUNS or found.verb in FREE_VERBS


def named_in(found: JournalCall, step: str) -> bool:
    return bool(found.verb) and f"journal {found.noun} {found.verb}" in step


STEP_HELD_LINE = {line.name: line for line in SequencesDetails.lines}[STEP_HELD]


def step_held_text(sequence, key: str, run: dict) -> str:
    return " - ".join(STEP_HELD_LINE.filled({"n": sequence.n, "title": sequence.title, "step": run["step"], "about": about_flag(key)}))


def held_writes(sequences, command: str):
    """The step a journal command waits on, with its run and whether the command only does what that step names; none when nothing holds it."""
    found = sequences.in_hand()
    if not found or not command or found[2].get("followed") == found[2]["step"]:
        return None
    sequence, key, run = found
    held = [made for made in calls(command) if not free_while_held(made)]
    if not held:
        return None
    step = sequences.steps_of(sequence)[run["step"] - 1][SECTION.body]
    return sequence, key, run, all(named_in(made, step) for made in held)
