from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class KeptReportMessage(MessageTemplate):
    """The agent message helpers.kept-report, told to the parent of a helper whose report could not be saved twice."""

    key = "helpers.kept-report"
    type = AgentMessageType.NOTICE
    text = "helper {agent}'s report on job {job} could not be saved; its text is kept on the job: journal helper-job show {job}, then journal helper report-retry {agent} or report-drop {agent}"
