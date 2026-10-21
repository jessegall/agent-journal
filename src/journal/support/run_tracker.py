import re
from datetime import datetime, timezone

from journal.engine.state_machine import StateMachine
from journal.engine.nudge import Nudge
from journal.support.command_part import CommandPart
from journal.support.requirements import Requirements
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.models.sequence import Sequence
from journal.support.ref import Ref
from journal.support.sequence_run import SequenceRun
from journal.support.rejection import Rejection
from journal.repositories.agents import Agents
from journal.repositories.rows import Rows
from journal.repositories.workers import Workers

COMMAND_PATTERN = re.compile(r"`([^`<]+)")


class RunTracker:
    """The sequences an agent works through, kept on its row as a stack: one started inside another is the one in hand, and when it ends the other comes back. Every start goes through here."""

    def __init__(self, machine: StateMachine, agents: Agents, requirements: Requirements, workers: Workers, rows: Rows) -> None:
        self.machine, self.agents, self.requiring, self.workers, self.rows = machine, agents, requirements, workers, rows

    def runs(self, agent: Agent) -> list[SequenceRun]:
        return [SequenceRun.build(raw) for raw in agent.sequence_runs or ()]

    def current(self, session: str, environment_id: int) -> SequenceRun | None:
        runs = self.runs(self.machine.agent(session, environment_id))
        return runs[-1] if runs else None

    def start(self, sequence: Sequence, session: str, environment_id: int, topic: str = "") -> str:
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        if any(run.sequence_id == sequence.id for run in runs) or not sequence.steps:
            return ""
        run = SequenceRun(sequence.id, sequence.title, tuple(sequence.steps), about=topic, started_at=self.timestamp(), said_at=self.timestamp(), finishes_in=tuple(sequence.finishes_in))
        self.rewritten(agent, lambda time: [*time, run])
        owed = self.requiring.require(agent, self.requiring.obligations(agent, self.requiring.lookup("sequences")))
        return "\n".join([*owed, self.line(run)])

    def next(self, session: str, environment_id: int) -> str:
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        run = runs[-1]
        self.refuse_open_end(run)
        if not run.last:
            return self.line(self.changed(session, environment_id, lambda time: time.advanced().said(self.timestamp())))
        return self.ended(agent, runs, Sequences.SEQUENCE_ENDED.create(n=run.sequence_id).rendered())

    def ended(self, agent: Agent, runs: list[SequenceRun], ended: str) -> str:
        if len(runs) == 1:
            self.stored(agent, [])
            return ended
        outer = self.rewritten(agent, lambda time: [*time[:-2], time[-2].said(self.timestamp())])[-1]
        return f"{ended}\n{self.line(outer)}"

    def skip(self, session: str, environment_id: int) -> str:
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        run = runs[-1]
        skipped = Sequences.STEP_OMISSION.create(n=run.sequence_id, step=run.step + 1).rendered()
        if run.last:
            return self.ended(agent, runs, f"{skipped}\n{Sequences.SEQUENCE_ENDED.create(n=run.sequence_id).rendered()}")
        moved = self.changed(session, environment_id, lambda time: time.advanced().said(self.timestamp()))
        return f"{skipped}\n{self.line(moved)}"

    def end(self, session: str, environment_id: int) -> str:
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        return self.ended(agent, runs, Sequences.SEQUENCE_CANCELLED.create(n=runs[-1].sequence_id).rendered())

    def refuse_open_end(self, run: SequenceRun) -> None:
        state = self.rows.row_state(Ref.parse(run.about)) if run.last and run.about and run.finishes_in else ""
        if state and state not in run.finishes_in:
            raise Rejection(f"sequence {run.sequence_id} ends when {run.about} is {' or '.join(run.finishes_in)}; it is {state}. finish it first, or `journal sequence abandon --why \"<why>\"`")

    def abandon(self, session: str, environment_id: int) -> tuple[SequenceRun, str]:
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        return runs[-1], self.ended(agent, runs, Sequences.SEQUENCE_ABANDONED.create(n=runs[-1].sequence_id).rendered())

    def finish_matching(self, environment_id: int, missing, reason: str) -> list[tuple[Agent, str]]:
        from journal.features.sequences.feature import Sequences
        notified = []
        for agent in [item for item in self.agents.global_matching(environment_id=environment_id) if item.sequence_runs]:
            runs = self.runs(agent)
            kept = [run for run in runs if not missing(run)]
            if len(kept) < len(runs):
                self.stored(agent, kept)
                notified.append((agent, "\n".join(Sequences.SEQUENCE_CANNOT_FINISH.create(n=run.sequence_id, why=reason).rendered() for run in runs if missing(run))))
        return notified

    def environments_running(self, sequence_id: int) -> set[int]:
        return {item.environment_id for item in self.agents.all_agents() if any(run.sequence_id == sequence_id for run in self.runs(item))}

    def follow(self, session: str, environment_id: int) -> SequenceRun:
        return self.changed(session, environment_id, lambda run: run.taken_up(self.timestamp()).said(self.timestamp()).parked(""))

    def suspend(self, session: str, environment_id: int, reason: str) -> SequenceRun:
        return self.changed(session, environment_id, lambda run: run.parked(reason))

    def announce(self, session: str, environment_id: int) -> SequenceRun:
        return self.changed(session, environment_id, lambda run: run.said(self.timestamp()))

    def changed(self, session: str, environment_id: int, change) -> SequenceRun:
        return self.rewritten(self.machine.agent(session, environment_id), lambda time: [*time[:-1], change(time[-1])])[-1]

    def rewritten(self, agent: Agent, change) -> list[SequenceRun]:
        recent = self.agents.touched(agent, Actor.system(), lambda time: {"sequence_runs": tuple(run.as_dict() for run in change(self.runs(time)))})
        return self.runs(recent)

    def transfer(self, session: str, environment_id: int) -> None:
        agent = self.machine.agent(session, environment_id)
        ended = [item for item in self.agents.scoped() if item.session != session and item.state == "ended" and item.sequence_runs]
        if agent.sequence_runs or not ended:
            return
        self.stored(agent, self.runs(ended[-1]))
        self.stored(ended[-1], [])

    def stored(self, agent: Agent, runs: list[SequenceRun]) -> None:
        self.agents.touch(agent, Actor.system(), sequence_runs=tuple(run.as_dict() for run in runs))

    @staticmethod
    def names(run: SequenceRun, parts: tuple[CommandPart, ...]) -> bool:
        step_commands = [command.strip() for command in COMMAND_PATTERN.findall(run.text) if command.strip()]
        return any(part.text.strip().startswith(command) for part in parts for command in step_commands)

    def typed_agent(self, session: str, environment_id: int) -> bool:
        return not any(session in (w.session, w.resume) for w in self.workers.global_matching(environment_id=environment_id))

    @classmethod
    def reminder(cls, run: SequenceRun) -> Nudge:
        from journal.features.sequences.feature import Sequences
        return Sequences.SEQUENCE_SUSPENDED.create(n=run.sequence_id, step=run.step + 1, why=run.parked_why) if run.parked_why else cls.step(run)

    @staticmethod
    def step(run: SequenceRun) -> Nudge:
        from journal.features.sequences.feature import Sequences
        return Sequences.PENDING_STEP.create(n=run.sequence_id, step=run.step + 1, text=run.text)

    def line(self, run: SequenceRun) -> str:
        return self.step(run).rendered()

    @staticmethod
    def timestamp() -> str:
        return datetime.now(timezone.utc).isoformat()
