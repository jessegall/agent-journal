from journal.features.tasks.states.working import Working
from journal.models.agent import Agent
from journal.models.chart import Chart
from journal.repositories.agents import Agents
from journal.repositories.charts import Charts
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.noted_times import NotedTimes
from journal.support.actor import Actor
from journal.support.scope import Scope
from journal.support.states_catalogue import StatesCatalogue
from journal.support.value_name import ValueName

PARTS_VERSION = 28
"""The drawings version the shipped workflows were first drawn from counts and times at."""


class ValuesAtUpgrade:
    """The times the shipped workflows note, seeded once at the upgrade that draws them from parts, from what the checks they replace read then, so a clock running in a session goes on rather than starting over; counts start at zero."""

    def __init__(self, charts: Charts, agents: Agents, times: NotedTimes, outputs: CommandOutputs, states: StatesCatalogue, scope: Scope) -> None:
        self.charts, self.agents, self.times, self.outputs, self.states, self.scope = charts, agents, times, outputs, states, scope

    def seed(self, drawn_before: int, by: Actor) -> None:
        if drawn_before >= PARTS_VERSION:
            return
        for agent in [a for a in self.agents.everywhere() if a.state != "ended"]:
            with self.scope.of(agent.environment_id):
                for chart in self.charts.shipped():
                    self.seeded(chart, agent, by)

    def seeded(self, chart: Chart, agent: Agent, by: Actor) -> None:
        for name in sorted({n.text.strip() for n in self.charts.nodes_of(chart) if n.key == "time_note"}):
            at = self.reading(name, agent)
            if at:
                self.times.note(ValueName(chart.id, name), at, by)

    def reading(self, name: str, agent: Agent) -> float:
        """What the check a time replaces read for the agent, as a moment: its log time, its last change of state, or the start of its oldest command still running; zero when there is none."""
        if name == "last_log":
            state = self.states.named(agent.state, agent.data)
            return state.logged_at if isinstance(state, Working) else 0.0
        if name == "running_since":
            running = self.outputs.in_background(agent.session)
            return min(o.created_at.timestamp() for o in running) if running else 0.0
        return agent.updated_at.timestamp() if agent.updated_at else 0.0
