class LauncherLink:
    def stop(self, agent_id: int) -> bool:
        return True

    def request_stop(self, agent_id: int) -> None:
        return None

    def sent(self, request: dict) -> None:
        return None


class AgentProgram:
    def __init__(self, launcher: LauncherLink) -> None:
        self.launcher = launcher

    def stop(self, agent) -> bool:
        # @righteous architecture_agents_launcher_stop_outside_agent_program
        return self.launcher.stop(agent.terminal_id)

    def request_stop(self, agent) -> None:
        # @righteous architecture_agents_launcher_stop_outside_agent_program
        self.launcher.request_stop(agent.terminal_id)


class SampleHelperEnd:
    def __init__(self, launcher: LauncherLink, program: AgentProgram) -> None:
        self.launcher, self.program = launcher, program

    def end(self, agent) -> None:
        # @sin architecture_agents_launcher_stop_outside_agent_program
        self.launcher.stop(agent.id)
        # @sin architecture_agents_launcher_stop_outside_agent_program
        self.launcher.request_stop(agent.id)
        # @righteous architecture_agents_launcher_stop_outside_agent_program
        self.program.stop(agent)
        # @righteous architecture_agents_launcher_stop_outside_agent_program
        self.launcher.sent({"agent_id": agent.id})
