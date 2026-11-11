from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.queries import Queries
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.support.document_nudges import DOCUMENT_STOP_REFUSAL


class OpenDocumentStopRule(DriverRule):
    """An agent with an open document may not stop until it closes it, however often it asks."""

    name = "documents.open-document-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    exempt = True
    priority = -5
    single_action_refusal = "An agent with an open document may not stop until it closes it, however often it asks"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        opened = self.queries.query(OpenDocument).filter(author_id=hook.agent_id).first()
        if opened is None:
            return RuleAnswer.allowed("the agent has no open document")
        return RuleAnswer.refused(DOCUMENT_STOP_REFUSAL.nudge(doc=opened.doc_id))
