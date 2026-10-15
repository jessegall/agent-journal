from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.features.chart.context import Context
from journal.features.sequences.running import Running
from journal.hooks.decision import Decision
from journal.repositories.sequences import Sequences
from journal.supervisor_link import SupervisorLink


class Actions:
    """The catalogue's actions, one method per key: each says, holds, blocks, types or starts through the funnel that owns it, and answers the hook when one waits."""

    def __init__(self, nudger: Nudger, supervisor: SupervisorLink, machine: Machine, running: Running, sequences: Sequences) -> None:
        self.nudger, self.supervisor, self.machine, self.running, self.sequences = nudger, supervisor, machine, running, sequences

    def perform(self, key: str, text: str, ctx: Context) -> Decision:
        return getattr(self, key)(text, ctx)

    def say(self, text: str, ctx: Context) -> Decision:
        from journal.features.chart.feature import ChartFeature
        if not ctx.session:
            return Decision()
        line = self.nudger.say(self.machine.agent(ctx.session, ctx.environment_id), ChartFeature.LINE.about(text=text))
        if not line:
            return Decision()
        if ctx.answers_hook:
            return Decision.tell(line)
        self.supervisor.type(ctx.environment_id, line)
        return Decision()

    def hold(self, text: str, ctx: Context) -> Decision:
        """A tool use refused with the line; with no hook waiting there is nothing to hold, so the line is said."""
        return Decision.refuse(text) if ctx.answers_hook else self.say(text, ctx)

    def block_stop(self, text: str, ctx: Context) -> Decision:
        return Decision.refuse(text) if ctx.answers_hook else self.say(text, ctx)

    def type(self, text: str, ctx: Context) -> Decision:
        if ctx.environment_id:
            self.supervisor.type(ctx.environment_id, text)
        return Decision()

    def start_sequence(self, text: str, ctx: Context) -> Decision:
        if not ctx.session:
            return Decision()
        for sequence in self.sequences.all():
            if sequence.title == text and not self.running.runs_one(ctx.session, ctx.environment_id):
                line = self.running.start(sequence, ctx.session, ctx.environment_id)
                return Decision.tell(line) if ctx.answers_hook else self.type(line, ctx)
        return Decision()
