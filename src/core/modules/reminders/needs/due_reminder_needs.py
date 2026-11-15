from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.enums.agent_role import AgentRole
from engine.module.block_conditions import BlockConditions
from engine.time.clock import Clock
from core.modules.reminders.models.reminder import Reminder
from core.modules.reminders.nudges.reminder_block_nudge import ReminderBlockNudge
from core.modules.reminders.support.due_reminders import DUE_REMINDER_KEY, DueReminders


class DueReminderNeeds(NeedSource):
    """The hold a due reminder with a block opens on the main agent's tools until its condition ends it."""

    state_type = Blocked
    rank = "reminders.due"
    agent_types = [AgentRole.MAIN.value]
    replaced_rules = tuple([DUE_REMINDER_KEY])

    def __init__(self, reminders: DueReminders, conditions: BlockConditions, clock: Clock) -> None:
        self.reminders, self.conditions, self.clock = reminders, conditions, clock

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        if question.event is None:
            return {}
        plans = {agent.agent_id: [self.plan(reminder) for reminder in self.reminders.due(agent.agent_id, self.clock.timestamp()) if reminder.block_condition]
                 for agent in agents if agent.agent_type == AgentRole.MAIN.value}
        return {agent_id: found for agent_id, found in plans.items() if found}

    def plan(self, reminder: Reminder) -> BlockPlan:
        return BlockPlan(ReminderBlockNudge.declared().nudge(reminder=reminder.id), self.conditions.built(reminder.block_condition, reminder.block_subject),
                         DUE_REMINDER_KEY, self.rank, scope_tools=True, scope_stop=False)
