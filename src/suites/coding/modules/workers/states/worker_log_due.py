from engine.driver.states.agent_row_state import AgentRowState


class WorkerLogDue(AgentRowState):
    """A worker's default state: it stands on the worker's own row and gates no rule yet; the role-only
    rules of a worker move into it later."""

    name = "workers.worker-log-due"
