from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.provider.launch_command import LaunchCommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import ANSWER_BYTES, LauncherLink
from core.modules.environments.models.environment import Environment
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_session_state import AgentSessionState
from core.modules.agents.support.launch_answer import LaunchAnswer

FAILED_ANSWER = b"failed\n"
RUNNING_ANSWER = b"running\n"
LAUNCH_VARIABLE = "JOURNAL_LAUNCH"


class AgentLauncher:
    """Hands the running launcher an agent's program, folder and agent row to start, and says what it did: an
    agent whose program still runs is not started again, and its line waits for its next hook or for the
    program to end. The agent's session goes along as its launch name, so a program that picks its own
    session, as Codex does, is bound to this row by its first hook. A launcher older than this journal answers
    nothing, which counts as started; no launcher at all counts as failed."""

    def __init__(self, link: LauncherLink, bus: Bus, sessions: AgentLaunchGuard) -> None:
        self.link, self.bus, self.sessions = link, bus, sessions

    def hand(self, agent: Agent, environment: Environment, command: LaunchCommand) -> LaunchAnswer:
        with self.sessions.lock(agent.session) as available:
            if not available:
                return LaunchAnswer.RUNNING
            state = self.sessions.prepare(agent)
            if state is not AgentSessionState.READY:
                return LaunchAnswer.FAILED if state is AgentSessionState.BLOCKED else LaunchAnswer.RUNNING
            return self.start(agent, environment, command)

    def start(self, agent: Agent, environment: Environment, command: LaunchCommand) -> LaunchAnswer:
        answer = self.link.sent({"agent_id": agent.id, "session": agent.session, "environment": environment.name, "folder": str(command.folder),
                                 "command": list(command.arguments), "variables": {**command.variables, LAUNCH_VARIABLE: agent.session}}, ANSWER_BYTES)
        if answer == RUNNING_ANSWER:
            return LaunchAnswer.RUNNING
        if answer in (None, FAILED_ANSWER):
            self.bus.run(RecordAgentLaunchFailure(agent.id), Actor.core(), environment_id=environment.id)
            return LaunchAnswer.FAILED
        return LaunchAnswer.STARTED
