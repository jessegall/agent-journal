from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from suites.coding.models.enums.ask_topic import AskTopic


class WorkerGitBanMessage(MessageTemplate):
    """The nudge coding.worker_runs_no_git."""

    key = "coding.worker_runs_no_git"
    type = AgentMessageType.REFUSAL
    text = 'a worker runs no git: the journal commits and merges your work. ' + AskTopic.TOOL.question_line()
    full_text = True
