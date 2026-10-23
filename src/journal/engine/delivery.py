from journal.engine.support.machine_reply import MachineReply
from journal.engine.support.typist import CLEAR, DISABLE, ENABLE, PAUSE, RESUME
from journal.events.agent.agent_event import AgentEvent
from journal.supervisor_link import SupervisorLink
from journal.support.decision import Decision


class Delivery:
    """The terminal's side of the state machine's replies, the engine's one way to the supervisor for them: the moves the states asked of the terminal, the lines typed into it and the remarks queued for it, whether the agent works, rests or had its stop refused, the silence between hooks, and the lines still queued folded into a hook's answer."""

    def __init__(self, supervisor: SupervisorLink) -> None:
        self.supervisor = supervisor

    def silence(self, event: AgentEvent) -> None:
        self.supervisor.silence(event.environment_id, event.gap_seconds())

    def applied(self, reply: MachineReply, following: float) -> None:
        environment_id = reply.agent.environment_id
        moves = {PAUSE: self.supervisor.pause, RESUME: self.supervisor.resume, DISABLE: self.supervisor.disable, ENABLE: self.supervisor.enable, CLEAR: self.supervisor.clear}
        for move in reply.moves:
            moves[move](environment_id)
        for remark in reply.remarks:
            self.supervisor.remark(environment_id, remark)
        for line in reply.keystrokes:
            self.supervisor.type(environment_id, line, following=following)

    def lines(self, environment_id: int, lines: str, following: float) -> None:
        for line in lines.split("\n"):
            self.supervisor.type(environment_id, line, following=following)

    def hook_decision(self, event: AgentEvent, answered: Decision) -> Decision:
        if answered.context and not event.has_hook_lines():
            self.lines(event.environment_id, answered.context, event.typing_delay)
        decision = answered.without(event.journal_text()) if event.journal_text() else answered
        stop_refusal = event.is_turn_end and not decision.allowed
        if event.is_turn_end and not stop_refusal:
            self.supervisor.resting(event.environment_id)
        if not event.is_work and not stop_refusal:
            return decision
        if stop_refusal:
            self.supervisor.stop_refused(event.environment_id)
        else:
            self.supervisor.working(event.environment_id)
        pending = self.supervisor.pending_lines(event.environment_id)
        if not pending:
            return decision
        return Decision.allowed_with(pending).merged(decision) if decision.allowed else Decision.refuse("\n".join((decision.reason, pending)))
