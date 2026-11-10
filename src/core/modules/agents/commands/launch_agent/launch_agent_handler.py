from pathlib import Path
from uuid import uuid4

from engine.enums.agent_role import AgentRole
from engine.driver.program_lockdown import ProgramLockdown
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.journal.journal_home import JournalHome
from engine.provider.launch import Launch
from engine.provider.providers import Providers
from engine.provider.session_start import SessionStart
from engine.query.queries import Queries
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

    def __init__(self, bus: Bus, queries: Queries, providers: Providers, home: JournalHome, link: LauncherLink, lockdown: ProgramLockdown) -> None:
        self.bus, self.queries, self.providers, self.home, self.link, self.lockdown = bus, queries, providers, home, link, lockdown

    def handle(self, command: LaunchAgent, context: Context) -> Agent:
        provider = self.providers.provider(command.program)
        lockdown = self.lockdown.lockdown(command.program)
        if lockdown.is_active:
            raise lockdown.start_refusal("agent")
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
