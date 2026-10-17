import re
from datetime import datetime, timezone

from journal.engine.machine import Machine
from journal.features.said import Said
from journal.features.shell.chain import Chain
from journal.features.skills.requiring import Requiring
from journal.models.actor import Actor
from journal.models.agent import Agent
from journal.models.sequence import Sequence
from journal.models.sequence_run import SequenceRun
from journal.repositories.agents import Agents

NAMED = re.compile(r"`([^`<]+)")
"""A command a step names: the words in backticks, up to the first <placeholder>."""


class Running:
    """The sequences an agent works through, kept on its row as a stack: one started inside another is the one in hand, and when it ends the other comes back. Every start goes through here."""

    def __init__(self, machine: Machine, agents: Agents, requiring: Requiring) -> None:
        self.machine, self.agents, self.requiring = machine, agents, requiring

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
        run = SequenceRun(sequence.id, sequence.title, tuple(sequence.steps), about=about)
        self.kept(agent, [*runs, run])
        owed = self.requiring.require(agent, self.requiring.owed(agent, self.requiring.named("sequences")))
        return "\n".join([*owed, self.said(run)])

    def next(self, session: str, environment_id: int) -> str:
        """The step in hand done: the next one, or the run's end, and then the step of the run it was started inside, if any."""
        from journal.features.sequences.feature import Sequences
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        run = runs[-1]
        if not run.last:
            moved = run.moved_on()
            self.kept(agent, [*runs[:-1], moved])
            return self.said(moved)
        self.kept(agent, runs[:-1])
        ended = Sequences.ENDED.about(n=run.sequence_id).rendered()
        return f"{ended}\n{self.said(runs[-2])}" if len(runs) > 1 else ended

    def follow(self, session: str, environment_id: int) -> SequenceRun:
        """The step in hand taken up now, and a parked run resumed with it."""
        return self.changed(session, environment_id, lambda run: run.taken_up(self.now()).parked(""))

    def park(self, session: str, environment_id: int, why: str) -> SequenceRun:
        return self.changed(session, environment_id, lambda run: run.parked(why))

    def held(self, session: str, environment_id: int) -> SequenceRun:
        return self.changed(session, environment_id, lambda run: run.held(self.now()))

    def changed(self, session: str, environment_id: int, change) -> SequenceRun:
        agent = self.machine.agent(session, environment_id)
        runs = self.runs(agent)
        run = change(runs[-1])
        self.kept(agent, [*runs[:-1], run])
        return run

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

    @staticmethod
    def step(run: SequenceRun) -> Said:
        from journal.features.sequences.feature import Sequences
        return Sequences.STEP.about(n=run.sequence_id, step=run.step + 1, text=run.text)

    def said(self, run: SequenceRun) -> str:
        return self.step(run).rendered()

    @staticmethod
    def now() -> str:
        return datetime.now(timezone.utc).isoformat()
