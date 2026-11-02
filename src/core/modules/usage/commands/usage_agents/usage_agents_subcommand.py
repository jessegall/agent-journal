from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.usage.support.agent_facts import AgentFacts
from core.modules.usage.support.agent_facts_list import AgentFactsList
from core.modules.usage.support.status_files import StatusFiles


class UsageAgentsSubcommand(ReadSubcommand[AgentFactsList]):
    """`journal usage agents [--environment <name>]`: for each agent still running, its model, context, cost
    and the task it works on."""

    cli_name = "usage"
    name = "agents"

    def __init__(self, queries: Queries, files: StatusFiles, environment_names: EnvironmentNames) -> None:
        self.queries, self.files, self.environment_names = queries, files, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> AgentFactsList:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the agents are shown for one environment", "name it with --environment")
        agents = self.queries.query(Agent).filter(environment_id=environment_id).matching(IsNull("ended_at")).oldest().all_rows()
        return AgentFactsList(tuple(self.facts(agent) for agent in agents))

    def facts(self, agent: Agent) -> AgentFacts:
        status = self.files.status(agent.session)
        tasks = self.queries.query(Task).filter(holder_id=agent.id, state=TaskState.STARTED).newest().page(1, 1).rows
        return AgentFacts(agent.id, status.model, status.context_percent, status.cost_dollars, tasks[0].id if tasks else None, tasks[0].title if tasks else "")

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentFactsList):
            output.write(value.line(), {"rows": [facts.json() for facts in value.agents]})
