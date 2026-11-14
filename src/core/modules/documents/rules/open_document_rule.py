from engine.driver.agent_hook import AgentHook
from engine.enums.command_category import CommandCategory
from engine.driver.driver_rule import DriverRule
from engine.enums.rule_priority import RulePriority
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.driver.tool import Tool
from engine.query.queries import Queries
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.support.document_nudges import DOCUMENT_OPEN


class OpenDocumentRule(DriverRule):
    """An open document refuses file edits and commands that edit, and lets reads through."""

    name = "documents.open-document"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    exempt = True
    overlay_proof = True
    priority = RulePriority.LAST
    single_action_refusal = "An open document refuses file edits and commands that edit, and lets reads through"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        opened = self.queries.query(OpenDocument).filter(author_id=hook.agent_id).first()
        tool = hook.event.tool
        if opened is None or tool is None or not self.is_edit(tool):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(DOCUMENT_OPEN.nudge(doc=opened.doc_id))

    def is_edit(self, tool: Tool) -> bool:
        shell = tool.shell
        if shell is None:
            return tool.category.writes_files
        return shell.has_non_journal_file_writes or shell.has_category_part(CommandCategory.EDIT)
