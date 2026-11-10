from engine.database.database import Database
from engine.database.statement import Statement
from engine.file.file_access import FileAccess
from engine.query.queries import Queries
from core.modules.drivers.commands.support.rule_history_writer import RuleHistoryWriter
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome
from core.modules.drivers.models.rule_history import RuleHistory
from core.testing.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadLocked
from tests.stories.engine.driver.support.samples import SAMPLES

RULE = "samples.return-line"


def test_a_hook_whose_rule_history_row_was_changed_by_another_writer_records_its_outcome_without_a_stale_row_error(new_story, monkeypatch):
    story = new_story(SAMPLES, fixture=LeadLocked)
    story.tick("s-1")
    original = RuleHistoryWriter.record

    def record_second_writer(writer, agent_id, answers, context):
        story.container.get(Database).update(Statement("UPDATE rule_histories SET version = version + 1"))
        original(writer, agent_id, answers, context)

    monkeypatch.setattr(RuleHistoryWriter, "record", record_second_writer)
    story.hook("s-1", HookSamples.prompt("go on"))
    row = next(row for row in story.container.get(Queries).query(RuleHistory).all_rows() if row.rule == RULE)
    log = story.home.system_log
    story.expect_rows(row.last_due_outcome is not RuleDueOutcome.SILENCED, not log.exists() or "StaleRowError" not in FileAccess.shared().read(log), detail=str(row))
