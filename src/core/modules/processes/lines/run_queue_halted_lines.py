from engine.enums.hook_event_name import HookEventName
from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from core.modules.processes.agent_messages.run_queue_halted_message import RunQueueHaltedMessage
from core.modules.processes.agent_messages.update_waiting_message import UpdateWaitingMessage
from core.modules.processes.support.run_queue_halt import RunQueueHalt


class RunQueueHaltedLines(EventLineSource):
    """While the process queue is halted, the main agent is reminded on hooks and clock ticks, and the agent
    message's interval keeps it to once in five minutes; so is an update that waits, naming the runs it waits
    for. A restart's own hold is not reminded of."""

    key = "processes.run-queue-halted"
    events = list(HookEventName)
    agent_types = [AgentRole.MAIN.value]

    main_role_reason = "only the main agent resumes a halted queue or lets a waiting update go on"

    def __init__(self, halt: RunQueueHalt) -> None:
        self.halt = halt

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if self.halt.command_halted:
            return [RunQueueHaltedMessage.declared().agent_message()]
        if self.halt.is_update_waiting:
            return [UpdateWaitingMessage.declared().agent_message(outputs=", ".join(f"output:{run}" for run in self.halt.running_run_ids()) or "none")]
        return []
