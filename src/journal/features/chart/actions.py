import re

from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.engine.nudger import Nudger
from journal.features.chart.context import Context
from journal.features.chart.fillers import Fillers
from journal.features.registry import Registry
from journal.features.said import Said
from journal.features.sequences.running import Running
from journal.hooks.decision import Decision
from journal.repositories.sequences import Sequences
from journal.supervisor_link import SupervisorLink


NAMED = re.compile(r"^\[([a-z_]+\.[a-z_]+)\]\s*(.*)$", re.S)
"""A say or type node whose text opens with a nudge's key in brackets, [messages.new], speaks as that nudge: the same key in the record, the same repeat window and the same answered-in-chat flag, with the node's own words."""


class Actions:
    """The catalogue's actions, one method per key: each says, holds, blocks, types or starts through the funnel that owns it, and answers the hook when one waits."""

    def __init__(self, nudger: Nudger, supervisor: SupervisorLink, machine: Machine, running: Running, sequences: Sequences, fillers: Fillers, cards: Cards, registry: Registry) -> None:
        self.nudger, self.supervisor, self.machine, self.running, self.sequences, self.fillers, self.cards = nudger, supervisor, machine, running, sequences, fillers, cards
        self.registry = registry

    def spoken(self, text: str) -> Said:
        """The node's words as a said line: through the nudge the text names in brackets, else through the chart's own line."""
        from journal.features.chart.feature import ChartFeature
        named = NAMED.match(text)
        nudge = self.registry.nudge_keyed(named.group(1)) if named else None
        if nudge:
            return Said(feature=nudge.feature, name=nudge.name, title=named.group(2), repeat_after=nudge.repeat_after, answered_in_chat=nudge.answered_in_chat)
        return ChartFeature.LINE.about(text=named.group(2) if named else text)

    def perform(self, key: str, text: str, ctx: Context) -> Decision:
        return getattr(self, key)(self.fillers.fill(text, ctx), ctx)

    def say(self, text: str, ctx: Context) -> Decision:
        if not ctx.session or not ctx.voiced:
            return Decision()
        line = self.nudger.say(self.machine.agent(ctx.session, ctx.environment_id), self.spoken(text))
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
        """Typed into the terminal; a text naming a nudge goes through the nudger first, so the record and the repeat window are the nudge's."""
        if not ctx.environment_id or not ctx.voiced:
            return Decision()
        if NAMED.match(text) and ctx.session:
            line = self.nudger.say(self.machine.agent(ctx.session, ctx.environment_id), self.spoken(text))
            if line:
                self.supervisor.type(ctx.environment_id, line)
            return Decision()
        self.supervisor.type(ctx.environment_id, text)
        return Decision()

    def show_card(self, text: str, ctx: Context) -> Decision:
        """A card in the chat with the line, so the user sees what the journal did."""
        if ctx.environment_id and ctx.voiced:
            self.cards.show(ctx.environment_id, ctx.session, text, "bolt")
        return Decision()

    def release(self, text: str, ctx: Context) -> Decision:
        """An agent paused for something outside goes back to what it was doing, told with the line; an agent not paused is left as it is."""
        if not ctx.session:
            return Decision()
        agent = self.machine.agent(ctx.session, ctx.environment_id)
        state = self.machine.states.named(agent.state, agent.data)
        if not isinstance(state, Paused):
            return Decision()
        self.machine.move(ctx.session, ctx.environment_id, state.back().to)
        return self.say(text, ctx) if text else Decision()

    def start_sequence(self, text: str, ctx: Context) -> Decision:
        if not ctx.session:
            return Decision()
        for sequence in self.sequences.all():
            if sequence.title == text and not self.running.runs_one(ctx.session, ctx.environment_id):
                line = self.running.start(sequence, ctx.session, ctx.environment_id)
                return Decision.tell(line) if ctx.answers_hook else self.type(line, ctx)
        return Decision()
