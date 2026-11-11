from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.driver.program_lockdown import ProgramLockdown
from engine.errors.refusal import Refusal
from engine.provider.launch_command import LaunchCommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.program_transport import ProgramTransport
from core.modules.environments.models.environment import Environment
from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from core.modules.agents.models.enums.agent_session_state import AgentSessionState
from core.modules.agents.models.enums.launch_answer import LaunchAnswer
from core.modules.agents.support.agent_label import AgentLabel

FAILED_ANSWER = b"failed\n"
RUNNING_ANSWER = b"running\n"
LAUNCH_VARIABLE = "JOURNAL_LAUNCH"
ROLE_VARIABLE = "JOURNAL_ROLE"


class AgentLauncher:
    """Start an agent through the launcher and record its process. A program at a usage limit is not started:
    it answers locked down before anything is asked of the launcher."""

    def __init__(self, transport: ProgramTransport, bus: Bus, policy: DispatchPolicy, lockdown: ProgramLockdown) -> None:
        self.transport, self.bus, self.policy, self.lockdown = transport, bus, policy, lockdown

    def hand(self, agent: Agent, environment: Environment, command: LaunchCommand) -> LaunchAnswer:
        if agent.retired_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} is retired, for good", "start a new agent")
        if self.lockdown.lockdown(agent.program).is_active:
            return LaunchAnswer.LOCKED_DOWN
        with self.policy.lock(agent.session) as available:
            if not available:
                return LaunchAnswer.LOCKED
            state = self.policy.prepare(agent)
            if state is not AgentSessionState.READY:
                return LaunchAnswer.FAILED if state is AgentSessionState.BLOCKED else LaunchAnswer.RUNNING
            return self.start(agent, environment, command)

    def start(self, agent: Agent, environment: Environment, command: LaunchCommand) -> LaunchAnswer:
        answer = self.transport.start({"agent_id": agent.id, "session": agent.session, "environment": environment.name, "folder": str(command.folder),
                                 "command": list(command.arguments), "variables": {**command.variables, LAUNCH_VARIABLE: agent.session, ROLE_VARIABLE: agent.role}})
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
