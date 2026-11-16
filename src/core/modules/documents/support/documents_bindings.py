from core.modules.agents.support.agent_report_reads import AgentReportReads
from core.modules.documents.support.row_agent_report_reads import RowAgentReportReads
from core.modules.documents.support.row_task_comment_reads import RowTaskCommentReads
from core.modules.documents.support.stored_row_links import StoredRowLinks
from core.modules.documents.support.work_context_reader import WorkContextReader
from core.modules.tasks.support.task_comment_reads import TaskCommentReads
from core.modules.tasks.support.task_context_reader import TaskContextReader
from engine.cli.row_links import RowLinks

DOCUMENTS_BINDINGS = {AgentReportReads: RowAgentReportReads, RowLinks: StoredRowLinks, TaskContextReader: WorkContextReader, TaskCommentReads: RowTaskCommentReads}
