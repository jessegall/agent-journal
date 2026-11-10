from collections.abc import Sequence

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.caller.caller_request import CallerRequest, SESSION_VARIABLE
from engine.caller.caller_resolver import CallerResolver
from engine.caller.process_chain import ProcessChain
from engine.caller.process_row import ProcessRow
from core.base.cli.shell_handoff import RUNNER_VARIABLE
from core.base.cli.usage_error import UsageError
from core.base.provider.providers import Providers
from engine.query.conditions.among import Among
from core.base.command.script_policy import ScriptPolicy
from engine.process.plugin_script_processes import PluginScriptProcesses
from engine.caller.caller import Caller
from core.modules.actors.queries.actor_query import ActorQuery
from core.modules.agents.models.agent import Agent
from core.modules.environments.queries.environment_query import EnvironmentQuery
from core.modules.agents.queries.agent_query import AgentQuery

LOGIN_VARIABLE = "USER"


PLUGIN_VARIABLE = "JOURNAL_PLUGIN"


class AgentCallerResolver(CallerResolver):
    """Resolves explicit sessions, then ancestors matching PID and start time or open program sessions.
    Login and folder resolve callers; unresolved programs use core.
    Runner sessions may name ended agents."""

    def __init__(self, agents: AgentQuery, chain: ProcessChain, environments: EnvironmentQuery, actors: ActorQuery, providers: Providers, scripts: PluginScriptProcesses, policy: ScriptPolicy) -> None:
        self.agents, self.chain, self.environments, self.actors, self.providers, self.scripts, self.policy = agents, chain, environments, actors, providers, scripts, policy

    def caller(self, request: CallerRequest) -> Caller:
        program_sessions = tuple(request.variables[provider.session_variable] for provider in self.providers.all() if provider.session_variable in request.variables)
        session_agent = self.session_agent(request)
        if session_agent is not None:
            return Caller(Actor(session_agent.id, ActorType.AGENT), session_agent.environment_id)
        steps = self.chain.steps(request.pid)
        # A variable proves nothing in a server, where the chain of processes decides. In a direct run the server's list
        # of scripts cannot be reached, and an agent setting it only skips the commit scripts of that plugin there.
        plugin_script = self.scripts.owner(steps) or ("" if self.policy.guards_run else request.variables.get(PLUGIN_VARIABLE, ""))
        agent = self.ancestor_agent(steps) or self.program_agent(program_sessions)
        if agent is not None:
            return Caller(Actor(agent.id, ActorType.AGENT), agent.environment_id, plugin_script)
        environment = self.environments.folder_environment(request.folder)
        person = None if program_sessions else self.actors.person(request.variables.get(LOGIN_VARIABLE, ""))
        return Caller(Actor(person.id, ActorType.USER) if person else Actor.core(), environment.id if environment else None, plugin_script)

    def program_agent(self, sessions: tuple[str, ...]) -> Agent | None:
        return next(iter(self.agents.running().matching(Among("session", sessions)).all_rows()), None) if sessions else None

    def session_agent(self, request: CallerRequest) -> Agent | None:
        session = request.variables.get(SESSION_VARIABLE)
        if not session:
            return None
        session_agents = self.agents.filter(session=session)
        agent = next(iter((session_agents if RUNNER_VARIABLE in request.variables else session_agents.running()).all_rows()), None)
        if agent is None:
            raise UsageError(f"{SESSION_VARIABLE} is session {session}, which is no open agent: start it with journal agent start")
        return agent

    def ancestor_agent(self, steps: Sequence[ProcessRow]) -> Agent | None:
        agents = self.agents.running().matching(Among("pid", [step.pid for step in steps])).all_rows()
        started = {(agent.pid, agent.process_started_at): agent for agent in agents}
        return next((started[step.pid, step.started_at] for step in steps if (step.pid, step.started_at) in started), None)
