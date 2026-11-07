from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool import Tool
from core.base.query.queries import Queries
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.support.document_closed import DocumentClosed
from core.modules.documents.support.document_nudges import DOCUMENT_OPEN


class OpenDocumentRule(DriverRule):
    """An author finishes the open document before doing other work."""

    name = "documents.open-document"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    exempt = True
    overlay_proof = True
    priority = 100

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        opened = self.queries.query(OpenDocument).filter(author_id=hook.agent_id).first()
        tool = hook.event.tool
        if opened is None or tool is None:
            return RuleAnswer.allowed()
        if self.allows(tool, opened.doc_id):
            return RuleAnswer.allowed()
        nudge = DOCUMENT_OPEN.nudge(doc=opened.doc_id)
        return RuleAnswer.refused_with_block(hook, nudge, DocumentClosed(opened.doc_id))

    def allows(self, tool: Tool, doc_id: int) -> bool:
        shell = tool.shell
        if shell is None:
            return tool.is_readonly or tool.is_skill_read
        commands = shell.parts_running_journal_command()
        if not commands:
            return tool.is_readonly
        return not shell.has_non_journal_file_writes and all(
            (part not in commands and part.classification.category.reads_files) or (bool(part.arguments) and
            ((part.arguments[0] == "skill" and len(part.arguments) >= 2 and part.arguments[1] in ("show", "list", "requirements", "required")) or (len(part.arguments) >= 3 and part.arguments[0] == "doc"
            and part.arguments[1] in ("show", "inspect", "edit", "close", "revisions", "revision", "comments", "comment")
            and part.arguments[2] == str(doc_id)))) for part in shell.parts)
