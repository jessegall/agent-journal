from journal.db.migrations.finish_cancelled_tasks import FinishCancelledTasks
from journal.db.migrations.give_building_a_plan_its_end import GiveBuildingAPlanItsEnd
from journal.db.migrations.index_the_dispatches import IndexTheDispatches
from journal.db.migrations.index_the_frequent_reads import IndexTheFrequentReads
from journal.db.migrations.index_the_hot_reads import IndexTheHotReads
from journal.db.migrations.index_the_links import IndexTheLinks
from journal.db.migrations.link_worker_reports import LinkWorkerReports
from journal.db.migrations.mark_old_reports_taken_up import MarkOldReportsTakenUp
from journal.db.migrations.name_card_rows_by_table import NameCardRowsByTable
from journal.db.migrations.write_questions_into_the_chat import WriteQuestionsIntoTheChat
from journal.db.migrations.unwrap_owed_pauses import UnwrapOwedPauses
from journal.db.migrations.unwrap_running_sequences import UnwrapRunningSequences
from journal.db.migrations.move_owed_skills_onto_the_agent import MoveOwedSkillsOntoTheAgent
from journal.db.migrations.fill_agents_empty_data import FillAgentsEmptyData
from journal.db.migrations.seed_the_stack import SeedTheStack
from journal.db.migrations.chart_drop import ChartDrop
from journal.db.migrations.time_keys import TimeKeys

MIGRATIONS = (UnwrapOwedPauses(), FinishCancelledTasks(), UnwrapRunningSequences(), GiveBuildingAPlanItsEnd(), LinkWorkerReports(), MoveOwedSkillsOntoTheAgent(), WriteQuestionsIntoTheChat(), IndexTheHotReads(), IndexTheLinks(), IndexTheDispatches(), MarkOldReportsTakenUp(), IndexTheFrequentReads(), NameCardRowsByTable(), FillAgentsEmptyData(), SeedTheStack(), ChartDrop(), TimeKeys())
