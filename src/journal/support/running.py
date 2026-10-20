import re
from datetime import datetime, timezone

from journal.engine.state_machine import StateMachine
from journal.engine.nudge import Nudge
from journal.support.chain import Chain
from journal.support.requiring import Requiring
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.sequence import Sequence
from journal.support.ref import Ref
from journal.support.sequence_run import SequenceRun
from journal.support.refused import Refused
from journal.repositories.agents import Agents
from journal.repositories.rows import Rows
from journal.repositories.workers import Workers

NAMED = re.compile(r"`([^`<]+)")
"""A command a step names: the words in backticks, up to the first <placeholder>."""


class Running:
    """The sequences an agent works through, kept on its row as a stack: one started inside another is the one in hand, and when it ends the other comes back. Every start goes through here."""

    def __init__(self, machine: StateMachine, agents: Agents, requiring: Requiring, workers: Workers, rows: Rows) -> None:
        self.machine, self.agents, self.requiring, self.workers, self.rows = machine, agents, requiring, workers, rows

    def runs(self, agent: Agent) -> list[SequenceRun]:
        return [SequenceRun.of(raw) for raw in agent.sequence_runs or ()]

    def in_hand(self, session: str, environment_id: int) -> SequenceRun | None:
        runs = self.runs(self.machine.agent(session, environment_id))
        return runs[-1] if runs else None

    def start(self, sequence: Sequence, session: str, environment_id: int, about: str = "") -> str:
        """The sequence started at its first step, its steps kept as they are now, and the sequences skill owed when it is not read; one already running is not started again. The first step is the line to tell, after the skill's, empty when nothing started."""
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        if any(run.sequence_id == sequence.id for run in runs) or not sequence.steps:
            return ""
        run = SequenceRun(sequence.id, sequence.title, tuple(sequence.steps), about=about, started_at=self.now(), said_at=self.now(), finishes_in=tuple(sequence.finishes_in))
        self.rewritten(agent, lambda now: [*now, run])
        owed = self.requiring.require(agent, self.requiring.owed(agent, self.requiring.named("sequences")))
        return "\n".join([*owed, self.said(run)])

    def next(self, session: str, environment_id: int) -> str:
        """The step in hand done: the next one, or the run's end, and then the step of the run it was started inside, if any."""
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        run = runs[-1]
        self.refuse_an_unfinished_end(run)
        if not run.last:
            return self.said(self.changed(session, environment_id, lambda now: now.moved_on().said(self.now())))
        return self.ended(agent, runs, Sequences.SEQUENCE_ENDED.create(n=run.sequence_id).rendered())

    def ended(self, agent: Agent, runs: list[SequenceRun], ended: str) -> str:
        """The run in hand taken off, the line that says so, and the step of the run it was started inside, if any."""
        if len(runs) == 1:
            self.kept(agent, [])
            return ended
        outer = self.rewritten(agent, lambda now: [*now[:-2], now[-2].said(self.now())])[-1]
        return f"{ended}\n{self.said(outer)}"

    def skip(self, session: str, environment_id: int) -> str:
        """The user's word: the step in hand passed over, whether or not it was taken up or its row is ready; the last ends the run."""
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        run = runs[-1]
        skipped = Sequences.THE_USER_SKIPPED_A_STEP.create(n=run.sequence_id, step=run.step + 1).rendered()
        if run.last:
            return self.ended(agent, runs, f"{skipped}\n{Sequences.SEQUENCE_ENDED.create(n=run.sequence_id).rendered()}")
        moved = self.changed(session, environment_id, lambda now: now.moved_on().said(self.now()))
        return f"{skipped}\n{self.said(moved)}"

    def end(self, session: str, environment_id: int) -> str:
        """The user's word: the run in hand ended where it stands."""
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        return self.ended(agent, runs, Sequences.THE_USER_ENDED_THE_SEQUENCE.create(n=runs[-1].sequence_id).rendered())

    def refuse_an_unfinished_end(self, run: SequenceRun) -> None:
        """The last step may not be done while the row the run is about stands short of the states the sequence names; a row gone no longer holds it."""
        state = self.rows.state_of(Ref.parse(run.about)) if run.last and run.about and run.finishes_in else ""
        if state and state not in run.finishes_in:
            raise Refused(f"sequence {run.sequence_id} ends when {run.about} is {' or '.join(run.finishes_in)}; it is {state}. finish it first, or `journal sequence abandon --why \"<why>\"`")

    def abandon(self, session: str, environment_id: int) -> tuple[SequenceRun, str]:
        """The run in hand given up: it, and the line that says so with the step it returns to."""
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        return runs[-1], self.ended(agent, runs, Sequences.SEQUENCE_ABANDONED.create(n=runs[-1].sequence_id).rendered())

    def end_where(self, environment_id: int, gone, why: str) -> list[tuple[Agent, str]]:
        """Every run here that can no longer finish, as gone says, taken off its agent: each agent with the line that tells it why."""
        from journal.features.sequences.feature import Sequences
        told = []
        for agent in [a for a in self.agents.across_environments(environment_id=environment_id) if a.sequence_runs]:
            runs = self.runs(agent)
            kept = [run for run in runs if not gone(run)]
            if len(kept) < len(runs):
                self.kept(agent, kept)
                told.append((agent, "\n".join(Sequences.SEQUENCE_CANNOT_FINISH.create(n=run.sequence_id, why=why).rendered() for run in runs if gone(run))))
        return told

    def environments_running(self, sequence_id: int) -> set[int]:
        """The environments where an agent runs the sequence."""
        return {a.environment_id for a in self.agents.everywhere() if any(run.sequence_id == sequence_id for run in self.runs(a))}

    def follow(self, session: str, environment_id: int) -> SequenceRun:
        """The step in hand taken up now, and a parked run resumed with it."""
        return self.changed(session, environment_id, lambda run: run.taken_up(self.now()).said(self.now()).parked(""))

    def park(self, session: str, environment_id: int, why: str) -> SequenceRun:
        return self.changed(session, environment_id, lambda run: run.parked(why))

    def said_now(self, session: str, environment_id: int) -> SequenceRun:
        return self.changed(session, environment_id, lambda run: run.said(self.now()))

    def changed(self, session: str, environment_id: int, change) -> SequenceRun:
        """The run in hand changed as it stands when the write lock is held."""
        return self.rewritten(self.machine.agent(session, environment_id), lambda now: [*now[:-1], change(now[-1])])[-1]

    def rewritten(self, agent: Agent, change) -> list[SequenceRun]:
        """The agent's runs changed as they stand when the write lock is held, so a step moved on in between is never written back over."""
        fresh = self.agents.touched(agent, Actor.system(), lambda now: {"sequence_runs": tuple(run.as_dict() for run in change(self.runs(now)))})
        return self.runs(fresh)

    def carry(self, session: str, environment_id: int) -> None:
        agent = self.machine.agent(session, environment_id)
        ended = [a for a in self.agents.in_() if a.session != session and a.state == "ended" and a.sequence_runs]
        if agent.sequence_runs or not ended:
            return
        self.kept(agent, self.runs(ended[-1]))
        self.kept(ended[-1], [])

    def kept(self, agent: Agent, runs: list[SequenceRun]) -> None:
        self.agents.touch(agent, Actor.system(), sequence_runs=tuple(run.as_dict() for run in runs))

    @staticmethod
    def names(run: SequenceRun, line: str) -> bool:
        """Whether a part of the shell line runs a command the step in hand names."""
        named = [words.strip() for words in NAMED.findall(run.text) if words.strip()]
        return any(part.text.strip().startswith(words) for part in Chain.parts(line) for words in named)

    def typed_to(self, session: str, environment_id: int) -> bool:
        """Whether a line for this session may be typed to it: a worker's cannot, it is told at its next stop."""
        return not any(session in (w.session, w.resume) for w in self.workers.across_environments(environment_id=environment_id))

    @classmethod
    def reminder(cls, run: SequenceRun) -> Nudge:
        """The step in hand, or for a parked run, that it is parked and why."""
        from journal.features.sequences.feature import Sequences
        return Sequences.SEQUENCE_PARKED.create(n=run.sequence_id, step=run.step + 1, why=run.parked_why) if run.parked_why else cls.step(run)

    @staticmethod
    def step(run: SequenceRun) -> Nudge:
        from journal.features.sequences.feature import Sequences
        return Sequences.STEP_TO_FOLLOW.create(n=run.sequence_id, step=run.step + 1, text=run.text)

    def said(self, run: SequenceRun) -> str:
        return self.step(run).rendered()

    @staticmethod
    def now() -> str:
        return datetime.now(timezone.utc).isoformat()
