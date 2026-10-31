from core.base.actor import Actor, ActorType
from core.base.caller.caller_request import CallerRequest
from core.base.caller.caller_resolver import CallerResolver
from core.base.caller.process_table import ProcessChain
from core.base.cli.subcommand_lookup import UsageError
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.caller import Caller
from core.modules.actors.actor_query import ActorQuery
from core.modules.agents.agent import Agent
from core.modules.environments.environment_query import EnvironmentQuery

SESSION_VARIABLE = "JOURNAL_AGENT_SESSION"
LOGIN_VARIABLE = "USER"


class AgentCallerResolver(CallerResolver):
    """Names who runs a command line and where: the open agent the session variable names, else the open agent
    whose pid and process start time match a process above the caller, in its environment; else the person the
    login name names, in the environment whose folder holds the working folder. A session variable that names
    no open agent is refused, never run as anyone else."""

    def __init__(self, queries: Queries, chain: ProcessChain, environments: EnvironmentQuery, actors: ActorQuery) -> None:
        self.queries, self.chain, self.environments, self.actors = queries, chain, environments, actors

    def caller(self, request: CallerRequest) -> Caller:
        agent = self.session_agent(request) or self.ancestor_agent(request)
        if agent is not None:
            return Caller(Actor(agent.id, ActorType.AGENT), agent.environment_id)
        environment = self.environments.folder_environment(request.folder)
        person = self.actors.person(request.variables.get(LOGIN_VARIABLE, ""))
        return Caller(Actor(person.id, ActorType.USER) if person else Actor.core(), environment.id if environment else None)

    def session_agent(self, request: CallerRequest) -> Agent | None:
        session = request.variables.get(SESSION_VARIABLE)
        if not session:
            return None
        agent = next(iter(self.queries.query(Agent).filter(session=session).matching(IsNull("ended_at")).all_rows()), None)
        if agent is None:
            raise UsageError(f"{SESSION_VARIABLE} is session {session}, which is no open agent: start it with journal agent start")
        return agent

    def ancestor_agent(self, request: CallerRequest) -> Agent | None:
        steps = self.chain.steps(request.pid)
        agents = self.queries.query(Agent).matching(Among("pid", [step.pid for step in steps])).matching(IsNull("ended_at")).all_rows()
        started = {(agent.pid, agent.process_started_at): agent for agent in agents}
        return next((started[step.pid, step.started_at] for step in steps if (step.pid, step.started_at) in started), None)
