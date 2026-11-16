from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.agent_role import AgentRole
from engine.module.block_conditions import BlockConditions
from engine.time.clock import Clock
from core.modules.reminders.models.reminder import Reminder
from core.modules.reminders.agent_messages.reminder_block_message import ReminderBlockMessage
from core.modules.reminders.support.due_reminders import DUE_REMINDER_KEY, DueReminders


class DueReminderStates(StateSource):
    """The hold a due reminder with a block opens on the main agent's tools until its condition ends it."""

    state_type = Blocked
    rank = "reminders.due"
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, reminders: DueReminders, conditions: BlockConditions, clock: Clock) -> None:
        self.reminders, self.conditions, self.clock = reminders, conditions, clock

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        if question.event is None:
            return {}
        plans = {agent.agent_id: [self.plan(reminder) for reminder in self.reminders.due(agent.agent_id, self.clock.timestamp(), question.event) if reminder.block_condition]
                 for agent in agents if agent.agent_type == AgentRole.MAIN.value}
        return {agent_id: match for agent_id, match in plans.items() if match}

    def plan(self, reminder: Reminder) -> BlockPlan:
        return BlockPlan(ReminderBlockMessage.declared().agent_message(reminder=reminder.id), self.conditions.built(reminder.block_condition, reminder.block_subject),
                         DUE_REMINDER_KEY, self.rank, scope_tools=True, scope_stop=False)
