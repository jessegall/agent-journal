from argparse import ArgumentParser

from engine.cli.agent_number import AgentNumber


class AssignSampleSubcommand:
    def arguments(self, parser: ArgumentParser) -> None:
        # @sin architecture_agents_agent_argument_as_int
        parser.add_argument("--agent", type=int)
        # @righteous architecture_agents_agent_argument_as_int
        parser.add_argument("--to-agent", type=AgentNumber)

    def refusal_text(self, worker_id: int, label: str) -> str:
        # @sin architecture_agents_agent_row_id_in_text
        text = f"worker {worker_id} has no worktree"
        # @righteous architecture_agents_agent_row_id_in_text
        return text if not label else f"{label} has no worktree"
