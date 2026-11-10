from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.driver.program_lockdown import ProgramLockdown
from engine.errors.refusal import Refusal
from engine.provider.launch_command import LaunchCommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import ANSWER_BYTES, LauncherLink
from core.modules.environments.models.environment import Environment
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_session_state import AgentSessionState
from core.modules.agents.support.launch_answer import LaunchAnswer

FAILED_ANSWER = b"failed\n"
RUNNING_ANSWER = b"running\n"
LAUNCH_VARIABLE = "JOURNAL_LAUNCH"
ROLE_VARIABLE = "JOURNAL_ROLE"


class AgentLauncher:
    """Start an agent through the launcher and record its process. A program at a usage limit is not started:
    it answers locked down before anything is asked of the launcher."""

    def __init__(self, link: LauncherLink, bus: Bus, sessions: AgentLaunchGuard, lockdown: ProgramLockdown) -> None:
        self.link, self.bus, self.sessions, self.lockdown = link, bus, sessions, lockdown

    def hand(self, agent: Agent, environment: Environment, command: LaunchCommand) -> LaunchAnswer:
        if agent.retired_at is not None:
            raise Refusal(f"agent {agent.id} is retired, for good", "start a new agent")
        if self.lockdown.lockdown(agent.program).is_active:
            return LaunchAnswer.LOCKED_DOWN
        with self.sessions.lock(agent.session) as available:
            if not available:
                return LaunchAnswer.LOCKED
            state = self.sessions.prepare(agent)
            if state is not AgentSessionState.READY:
                return LaunchAnswer.FAILED if state is AgentSessionState.BLOCKED else LaunchAnswer.RUNNING
            return self.start(agent, environment, command)

    def start(self, agent: Agent, environment: Environment, command: LaunchCommand) -> LaunchAnswer:
        answer = self.link.request_launcher({"agent_id": agent.id, "session": agent.session, "environment": environment.name, "folder": str(command.folder),
                                 "command": list(command.arguments), "variables": {**command.variables, LAUNCH_VARIABLE: agent.session, ROLE_VARIABLE: agent.role}}, ANSWER_BYTES)
        if answer == RUNNING_ANSWER:
            return LaunchAnswer.RUNNING
        if answer in (None, FAILED_ANSWER):
            self.bus.run(RecordAgentLaunchFailure(agent.id), Actor.core(), environment_id=environment.id)
            return LaunchAnswer.FAILED
        pid = self.parse_pid(answer)
        self.bus.run(RecordAgentProcess(agent.id, pid), Actor.core(), environment_id=environment.id)
        return LaunchAnswer.STARTED

    @staticmethod
    def parse_pid(answer: bytes) -> int | None:
        parts = answer.split()
        return int(parts[1]) if len(parts) == 2 and parts[1].isdigit() else None
