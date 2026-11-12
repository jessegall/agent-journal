from engine.driver.driver_rule import DriverRule
from engine.enums.agent_role import AgentRole


# @righteous architecture_processes_main_only_rule_without_reason
class ChatAnswerRule(DriverRule):
    name = "samples.chat-answer"
    roles = [AgentRole.MAIN]
    main_only_because = "the main agent chat"
