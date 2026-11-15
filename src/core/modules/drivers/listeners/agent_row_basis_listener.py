from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.answer_basis_writers import AnswerBasisWriters

# a start, a retirement, a process end written or cleared, a bound session, a halt and the agent's role, profile or access
PERMISSION_FIELDS = ("session", "role", "profile", "access", "pid", "process_started_at", "ended_at", "retired_at", "halted_at", "launch_failed_at")


class AgentRowBasisListener(SaveListener[Changed[Agent]]):
    """An agent row's change that changes what the agent may do moves its answer basis in the same write: a pause
    or resume that of every agent below it too, and a usage limit set or lifted its program's epoch."""

    name = "drivers.agent-row-basis"

    def __init__(self, writers: AnswerBasisWriters) -> None:
        self.writers = writers

    def handle(self, event: Changed[Agent], context: Context) -> None:
        agent, previous = event.row, event.old_row
        if previous is None or any(getattr(agent, field) != getattr(previous, field) for field in PERMISSION_FIELDS):
            self.writers.bump_agent(agent.id, context)
        if previous is not None and agent.paused_at != previous.paused_at:
            self.writers.bump_agent_tree(agent, context)
        if previous is not None and agent.usage_limit_ends_at != previous.usage_limit_ends_at:
            self.writers.bump_program(agent.program, context)
