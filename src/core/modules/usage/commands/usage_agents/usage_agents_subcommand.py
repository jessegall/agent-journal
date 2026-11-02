from argparse import ArgumentParser, Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.usage.support.agent_facts import AgentFacts
from core.modules.usage.support.agent_facts_list import AgentFactsList
from core.modules.usage.support.status_files import StatusFiles

CLOSED_AGENTS_SHOWN = 50
BLOCKED_STATE = "blocked"
WAITING_STATE = "waiting"

class UsageAgentsSubcommand(ReadSubcommand[AgentFactsList]):
    """`journal usage agents [--environment <name>]`: for each agent still running, its model, context, cost
    and the task it works on."""

    cli_name = "usage"
    name = "agents"

    def __init__(self, queries: Queries, files: StatusFiles, environment_names: EnvironmentNames) -> None:
        self.queries, self.files, self.environment_names = queries, files, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--closed", action="store_true", help="also the agents that ended most recently")

    def read(self, arguments: Namespace, caller: Caller) -> AgentFactsList:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the agents are shown for one environment", "name it with --environment")
        agents = self.queries.query(Agent).filter(environment_id=environment_id)
        running = tuple(agents.matching(IsNull("ended_at")).oldest().all_rows())
        ended = tuple(agents.matching(Greater("ended_at", "")).newest().page(1, CLOSED_AGENTS_SHOWN).rows) if arguments.closed else ()
        return AgentFactsList(tuple(self.facts(agent) for agent in (*running, *ended)))

    def facts(self, agent: Agent) -> AgentFacts:
        status = self.files.status(agent.session)
        started = self.queries.query(Task).filter(holder_id=agent.id, state=TaskState.STARTED).newest().page(1, 1).rows
        delegated = tuple(self.queries.query(Task).filter(delegated_to=agent.id).oldest().all_rows())
        agent_tasks = tuple(task for task in self.queries.query(Task).filter(holder_id=agent.id).oldest().all_rows() if task.delegated_to != agent.id) if agent.role is AgentRole.WORKER else tuple(started)
        tasks = tuple({"id": task.id, "title": task.title, "state": task.state.value} for task in (*agent_tasks, *delegated))
        dispatches = self.queries.query(SubagentDispatch).filter(subagent_id=agent.id).page(1, 1).rows
        dispatch = dispatches[0] if dispatches else None
        return AgentFacts(agent.id, status.model or (dispatch.program_model if dispatch else ""), status.context_percent, status.cost_dollars, started[0].id if started else None, started[0].title if started else "", tasks,
                          self.waiting_state(agent), dispatch.profile if dispatch else "", dispatch.description.split(",", 1)[0] if dispatch else "", dispatch.instruction if dispatch else "")

    def waiting_state(self, agent: Agent) -> str:
        if self.queries.query(AgentBlock).filter(agent_id=agent.id).matching(IsNull("closed_at")).exists():
            return BLOCKED_STATE
        return WAITING_STATE if agent.paused_at is not None else ""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentFactsList):
            output.write(value.line(), {"rows": [facts.json() for facts in value.agents]})
