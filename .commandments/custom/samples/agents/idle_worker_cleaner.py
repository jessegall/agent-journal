from enum import StrEnum


class Agent:
    number: int = 0

    def retired(self, reason: str) -> "Agent":
        return self


class RetireAgent:
    def __init__(self, agent_id: int, reason: str) -> None:
        self.agent_id, self.reason = agent_id, reason


class EndReason(StrEnum):
    DRIVER_CHANGED = "driver_changed"


class RetireAgentHandler:
    def handle(self, agent: Agent) -> Agent:
        # @righteous architecture_agents_agent_retired_outside_the_retire_command
        return agent.retired("its work is done")

    def reason_refusal(self, agent: Agent) -> str:
        # @righteous architecture_agents_retire_command_in_a_text
        return f'journal agent retire {agent.number} --reason "<why>"'


class RetireAgentSubcommand:
    def command(self, agent_id: int, reason: str) -> RetireAgent:
        # @righteous architecture_agents_retirement_run_by_code
        return RetireAgent(agent_id, reason)


class ChangeAgentDriverHandler:
    def reason(self) -> EndReason:
        # @righteous architecture_agents_driver_changed_outside_the_driver_command
        return EndReason.DRIVER_CHANGED


class AgentRowNumbers:
    def row_id(self, number: int, environment_id: int | None) -> int:
        # @righteous architecture_agents_number_read_without_an_environment
        if environment_id is None:
            raise ValueError("an agent is read in an environment")
        found_id = number + environment_id
        # @righteous architecture_agents_number_returned_as_its_row_id
        return found_id


class WorkerBranchNames:
    def branch(self, first_branch: str, position: int) -> str:
        # @righteous architecture_workers_later_branch_named_by_hand
        return f"{first_branch}-{position}"


class IdleWorkerCleaner:
    def clean(self, agent: Agent) -> Agent:
        # @sin architecture_agents_agent_retired_outside_the_retire_command
        return agent.retired("idle too long")

    def command(self, agent: Agent) -> RetireAgent:
        # @sin architecture_agents_retirement_run_by_code
        return RetireAgent(agent.number, "idle too long")

    def suggestion(self, agent: Agent) -> str:
        # @sin architecture_agents_retire_command_in_a_text
        return f"to make room: journal agent retire {agent.number}"

    def reason(self) -> EndReason:
        # @sin architecture_agents_driver_changed_outside_the_driver_command
        return EndReason.DRIVER_CHANGED

    def branch(self, first_branch: str, worktree_id: int) -> str:
        # @sin architecture_workers_later_branch_named_by_hand
        return first_branch + "-cut-" + str(worktree_id)


class LenientRowNumbers:
    def row_id(self, number: int, environment_id: int | None) -> int:
        # @sin architecture_agents_number_read_without_an_environment
        if environment_id is None:
            # @sin architecture_agents_number_returned_as_its_row_id
            return number
        return number + environment_id
