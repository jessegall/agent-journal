from journal.db.migrations.finish_cancelled_tasks import FinishCancelledTasks
from journal.db.migrations.plan_building_end import PlanBuildingEnd
from journal.db.migrations.dispatch_index import DispatchIndex
from journal.db.migrations.frequent_read_indexes import FrequentReadIndexes
from journal.db.migrations.hot_read_indexes import HotReadIndexes
from journal.db.migrations.link_indexes import LinkIndexes
from journal.db.migrations.link_worker_reports import LinkWorkerReports
from journal.db.migrations.old_report_closure import OldReportClosure
from journal.db.migrations.card_row_table_names import CardRowTableNames
from journal.db.migrations.chat_questions import ChatQuestions
from journal.db.migrations.pause_unwrapping import PauseUnwrapping
from journal.db.migrations.sequence_unwrapping import SequenceUnwrapping
from journal.db.migrations.agent_skill_obligations import AgentSkillObligations
from journal.db.migrations.fill_agents_empty_data import FillAgentsEmptyData
from journal.db.migrations.stack_seed import StackSeed
from journal.db.migrations.chart_drop import ChartDrop
from journal.db.migrations.time_keys import TimeKeys
from journal.db.migrations.trigger_phrases import TriggerPhrases
from journal.db.migrations.event_renames import EventRenames
from journal.db.migrations.column_renames import ColumnRenames
from journal.db.migrations.state_field_renames import StateFieldRenames
from journal.db.migrations.timestamp_renames import TimestampRenames
from journal.db.migrations.dashboard_sections import DashboardSections
from journal.db.migrations.operation_dispatch_index import OperationDispatchIndex

MIGRATIONS = (PauseUnwrapping(), FinishCancelledTasks(), SequenceUnwrapping(), PlanBuildingEnd(), LinkWorkerReports(), AgentSkillObligations(), ChatQuestions(), HotReadIndexes(), LinkIndexes(), DispatchIndex(), OldReportClosure(), FrequentReadIndexes(), CardRowTableNames(), FillAgentsEmptyData(), StackSeed(), ChartDrop(), TimeKeys(), TriggerPhrases(), DashboardSections(), EventRenames(), ColumnRenames(), StateFieldRenames(), TimestampRenames(), OperationDispatchIndex())
