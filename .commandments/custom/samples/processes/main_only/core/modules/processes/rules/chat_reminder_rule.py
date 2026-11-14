from engine.driver.driver_rule import DriverRule
from engine.enums.agent_role import AgentRole


# @sin architecture_processes_main_only_rule_without_reason
class ChatReminderRule(DriverRule):
    name = "samples.chat-reminder"
    roles = [AgentRole.MAIN]
