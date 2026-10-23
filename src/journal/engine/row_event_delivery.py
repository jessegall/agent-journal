from journal.engine.delivery import Delivery
from journal.engine.state_machine import StateMachine
from journal.models.agent_role import AgentRole
from journal.events.listener import Listener
from journal.events.rows.row_event import RowEvent


class RowEventDelivery(Listener[RowEvent]):
    """Every row event, named for its moment, is asked of the top of each live agent's stack in the row's environment, and what each answers is delivered: typed into a main agent's terminal, kept on a worker's row for its next hook; a model's Updated reaches no state."""

    def __init__(self, machine: StateMachine, delivery: Delivery) -> None:
        self.machine, self.delivery = machine, delivery

    def handle(self, event: RowEvent) -> None:
        for reply in self.machine.row_replies(event):
            self.delivered(reply)

    def delivered(self, reply) -> None:
        self.delivery.applied(reply, 0.0)
        if not reply.decision.context:
            return
        if reply.agent.role == AgentRole.WORKER:
            self.machine.queue_lines(reply.agent, reply.decision.context)
            return
        self.delivery.lines(reply.agent.environment_id, reply.decision.context, 0.0)
