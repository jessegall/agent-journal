from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from collections.abc import Iterable


class TaskNumberList:
    """Task numbers as a message lists them: separated by commas."""

    @staticmethod
    def text(task_ids: Iterable[int]) -> str:
        return ", ".join(str(task_id) for task_id in task_ids)

    # a template's agent message that lists these tasks
    @staticmethod
    def message(template: type[MessageTemplate], task_ids: Iterable[int]) -> AgentMessage:
        return template.declared().agent_message(tasks=TaskNumberList.text(task_ids))
