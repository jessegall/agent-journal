import re
from dataclasses import replace

from journal.support.cards import Cards
from journal.engine.machine import Machine
from journal.engine.agent_state import AgentState
from journal.engine.states.paused import Paused
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.states.stuck import Stuck
from journal.engine.nudger import Nudger
from journal.features.chart.support.context import Context
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.features.chart.support.checks import Checks
from journal.support.fillers import Fillers
from journal.support.requiring import Requiring
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.repositories.counts import Counts
from journal.repositories.noted_times import NotedTimes
from journal.engine.clock import Clock
from journal.features.registry import Registry
from journal.support.said import Said
from journal.support.running import Running
from journal.support.decision import Decision
from journal.support.refused import Refused
from journal.repositories.sequences import Sequences
from journal.supervisor_link import SupervisorLink


NAMED = re.compile(r"^\[([a-z_]+\.[a-z_]+)\]\s*(.*)$", re.S)
"""A say or type node whose text opens with a nudge's key in brackets, [messages.new], speaks as that nudge: the same key in the record, the same repeat window and the same answered-in-chat flag, with the node's own words."""


class Actions:
    """The catalogue's actions, one method per key: each says, holds, blocks, types or starts through the funnel that owns it, and answers the hook when one waits."""

    def __init__(self, nudger: Nudger, supervisor: SupervisorLink, machine: Machine, running: Running, sequences: Sequences, fillers: Fillers, cards: Cards, registry: Registry, counts: Counts, requiring: Requiring, agents: Agents, checks: Checks, times: NotedTimes, clock: Clock) -> None:
        self.nudger, self.supervisor, self.machine, self.running, self.sequences, self.fillers, self.cards = nudger, supervisor, machine, running, sequences, fillers, cards
        self.registry, self.counts, self.requiring, self.agents, self.checks, self.times, self.clock = registry, counts, requiring, agents, checks, times, clock

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
        """Said to the agent once inside the nudge's window: on the hook's answer when one waits, else typed into its terminal."""
        if not ctx.session:
            return Decision()
        line = self.nudger.say(ctx.agent_in(self.machine), self.spoken(text))
        if not ctx.answers_hook:
            self.typed(line, ctx)
            return Decision()
        if not line:
            return Decision()
        if ctx.answers_hook:
            return Decision.tell(line)
        self.supervisor.type(ctx.environment_id, line)
        return Decision()

    def skills_asked(self, ctx: Context) -> list[Skill]:
        """The skills a prompt names, or at any other event the ones the state asks for."""
        if isinstance(ctx.event, PromptSubmitted):
            return self.requiring.named_in(ctx.event.prompt)
        return self.requiring.for_state(ctx.state)

    def require_skill(self, text: str, ctx: Context) -> Decision:
        """The agent owes a read of a skill: the one named, or the ones the prompt names at a prompt, else the skill of its state; each owed one is a link from the agent and a line that says where its file is. With the skills switched off here, nothing is owed."""
        from journal.features.skills.feature import Skills
        if not ctx.session or self.registry.silenced(Skills.REQUIRED):
            return Decision()
        agent = ctx.agent_in(self.machine)
        skills = self.requiring.named(text.strip()) if text.strip() else self.skills_asked(ctx)
        lines = self.requiring.require(agent, self.requiring.owed(agent, skills))
        if lines and not ctx.answers_hook:
            for line in lines:
                self.typed(line, ctx)
            return Decision()
        return Decision.tell("\n".join(lines)) if lines else Decision()

    def hold(self, text: str, ctx: Context) -> Decision:
        """A tool use refused with the line; with no hook waiting there is nothing to hold, so the line is said. A hold named for a feature switched off here holds nothing."""
        return self.refusing(text, ctx)

    def block_stop(self, text: str, ctx: Context) -> Decision:
        return self.refusing(text, ctx)

    def refusing(self, text: str, ctx: Context) -> Decision:
        said = self.spoken(text)
        if self.registry.silenced(said):
            return Decision()
        return Decision.refuse(said.rendered()) if ctx.answers_hook else self.say(text, ctx)

    def type(self, text: str, ctx: Context) -> Decision:
        """Typed into the terminal; a text naming a nudge goes through the nudger first, so the record and the repeat window are the nudge's, and is for a live agent only."""
        if not ctx.environment_id:
            return Decision()
        if not NAMED.match(text):
            self.typed(text, ctx)
        elif ctx.session:
            said = self.spoken(text)
            if said.rendered() not in ctx.spoken:
                self.typed(self.nudger.say(ctx.agent_in(self.machine), said), ctx)
        return Decision()

    def typed(self, line: str | None, ctx: Context) -> None:
        """Into the environment's terminal, once per event: a walk about a second agent does not repeat it."""
        if line and line not in ctx.spoken:
            ctx.spoken.add(line)
            self.supervisor.type(ctx.environment_id, line)

    def run_workflow(self, text: str, ctx: Context) -> Decision:
        """Nothing to do here: the walk runs the named workflow in place."""
        return Decision()

    def stop_here(self, text: str, ctx: Context) -> Decision:
        """Nothing to do: the walk ends the event at this node."""
        return Decision()

    def count_start(self, text: str, ctx: Context) -> Decision:
        """The workflow's count by that name back at zero in the environment."""
        if ctx.keeps_value(text):
            self.counts.set(ctx.value(text.strip()), 0, Actor.system())
        return Decision()

    def count_begin(self, text: str, ctx: Context) -> Decision:
        """The workflow's count by that name at zero, unless it is already kept here."""
        if ctx.keeps_value(text):
            self.counts.begin(ctx.value(text.strip()), Actor.system())
        return Decision()

    def count_one(self, text: str, ctx: Context) -> Decision:
        if ctx.keeps_value(text):
            self.counts.count_one(ctx.value(text.strip()), Actor.system())
        return Decision()

    def time_forget(self, text: str, ctx: Context) -> Decision:
        """The time kept under the name forgotten, so it reads as never noted."""
        if ctx.keeps_value(text):
            self.times.forget(ctx.value(text.strip()), Actor.system())
        return Decision()

    def time_note(self, text: str, ctx: Context) -> Decision:
        """The engine clock's time kept under the name for the workflow in the environment, the one before it replaced."""
        if ctx.keeps_value(text):
            self.times.note(ctx.value(text.strip()), self.clock.now(), Actor.system())
        return Decision()

    def show_card(self, text: str, ctx: Context) -> Decision:
        """A card in the chat with the line, so the user sees what the journal did."""
        if ctx.environment_id and text not in ctx.spoken:
            ctx.spoken.add(text)
            self.cards.show(ctx.environment_id, ctx.session, text, "bolt")
        return Decision()

    def release(self, text: str, ctx: Context) -> Decision:
        """An agent in any pause goes back to the state the pause keeps in resume, told with the line; an agent not paused is left as it is."""
        if not ctx.session:
            return Decision()
        wait = self.machine.states.wait_in(ctx.state) if ctx.state else None
        if wait is None:
            return Decision()
        self.machine.move(ctx.session, ctx.environment_id, self.without(ctx.state, wait))
        return self.say(text, ctx) if text else Decision()

    def without(self, state: AgentState, wait: Paused):
        """The agent's state with the wait taken out of it: the wait goes back to what it was doing."""
        return wait.back().to

    def wait_outside(self, text: str, ctx: Context) -> Decision:
        """The agent waits for what the text names, the wait laid over what it is doing."""
        return self.pause(ctx, Expecting, what=text.strip())

    def mark_stuck(self, text: str, ctx: Context) -> Decision:
        """The agent is stuck for the reason in the text, the pause laid over what it is doing."""
        return self.pause(ctx, Stuck, why=text.strip())

    def pause(self, ctx: Context, kind, **words) -> Decision:
        if not ctx.session or not ctx.state:
            return Decision()
        if isinstance(ctx.state, Paused):
            raise Refused(f"the agent is {ctx.state.name} already: one wait at a time, and Send the agent back ends it")
        self.machine.move(ctx.session, ctx.environment_id, kind.leaving(ctx.state, **words))
        return Decision()

    def go_idle(self, text: str, ctx: Context) -> Decision:
        """The agent is idle, from a state that owns nothing."""
        if not ctx.session or not ctx.state:
            return Decision()
        target = self.machine.states.named("idle", {})
        self.leaving(ctx.state, target)
        if ctx.state.name != target.name:
            self.machine.move(ctx.session, ctx.environment_id, target)
        return Decision()

    @staticmethod
    def leaving(state: AgentState, target: AgentState) -> None:
        """What a change to idle may leave behind: nothing. A task in hand or a wait with its way back is not dropped by a workflow."""
        if isinstance(state, Paused):
            raise Refused(f"the agent is {state.name} and would lose its way back: Send the agent back returns it, a change to {target.name} would not")
        if state.to_data():
            raise Refused(f"the agent is {state.name} with {', '.join(f'{k} {v}' for k, v in state.to_data().items() if v)}: a move to {target.name} would leave that with nobody on it")

    def start_sequence(self, text: str, ctx: Context) -> Decision:
        if not ctx.session:
            return Decision()
        for sequence in self.sequences.all():
            if sequence.title == text:
                line = self.running.start(sequence, ctx.session, ctx.environment_id)
                if not line:
                    return Decision()
                return Decision.tell(line) if ctx.answers_hook else self.type(line, ctx)
        return Decision()
