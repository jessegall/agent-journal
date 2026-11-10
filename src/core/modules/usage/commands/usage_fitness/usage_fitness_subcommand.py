from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.time.clock import Clock
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.usage.support.agent_fitness import AgentFitness
from core.modules.usage.support.fitness_measures import FitnessMeasures


class UsageFitnessSubcommand(ReadSubcommand[AgentFitness]):
    """`journal usage fitness --agent <id>`: an agent's fitness score, its measures and its load."""

    cli_name = "usage"
    name = "fitness"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, measures: FitnessMeasures, clock: Clock) -> None:
        self.queries, self.measures, self.clock = queries, measures, clock

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int, required=True)

    def read(self, arguments: Namespace, caller: Caller) -> AgentFitness:
        return self.measures.fitness(self.queries.query(Agent).find(arguments.agent), self.clock.timestamp())

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentFitness):
            head = f"fitness {value.score} of 100" if value.is_measured else "fitness not measured yet"
            output.write("\n".join([f"{head}, load {value.workload}", *(f"{measure.label}: {measure.value}" for measure in value.measures)]), value.json())
