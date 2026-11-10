from pathlib import Path
from uuid import uuid4

from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.journal_home import JournalHome
from core.base.provider.launch import Launch
from core.base.provider.providers import Providers
from core.base.provider.session_start import SessionStart
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.commands.launch_agent.launch_agent import LaunchAgent
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.environments.models.environment import Environment


class LaunchAgentHandler(Handler[LaunchAgent, Agent]):
    """Starts a main agent's row in the caller's environment and hands the launcher its program to start; with
    no launcher nothing is started."""

    command = LaunchAgent

    def __init__(self, bus: Bus, queries: Queries, providers: Providers, home: JournalHome, link: LauncherLink) -> None:
        self.bus, self.queries, self.providers, self.home, self.link = bus, queries, providers, home, link

    def handle(self, command: LaunchAgent, context: Context) -> Agent:
        provider = self.providers.provider(command.program)
        if context.environment_id is None:
            raise Refusal("an agent starts in an environment", "start it from an environment")
        environment = self.queries.query(Environment).find(context.environment_id)
        name = f"launch-{uuid4().hex}"
        launch = Launch(self.home.folder.parent, Path(environment.folder), provider.session_model(), name, SessionStart(str(uuid4())), {"JOURNAL_LAUNCH": name})
        session_command = provider.session_command(launch)
        agent = self.bus.dispatch(StartAgent(name, command.program, AgentRole.MAIN), context)
        handed = self.link.request_launcher({"agent_id": agent.id, "session": name, "environment": environment.name, "folder": environment.folder,
                                 "command": list(session_command.arguments), "variables": dict(session_command.variables)})
        if handed is None:
            raise Refusal("no launcher is running here", "start the agent with journal launch in a terminal")
        return agent
