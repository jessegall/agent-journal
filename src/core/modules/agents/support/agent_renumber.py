import json
import sqlite3
from pathlib import Path

from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON, ReferenceRewrite
from engine.database.removal_counts import RemovalCounts
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp
from core.modules.agents.support.agent_keep_rule import AgentKeepRule
from core.modules.agents.support.agent_message_prune import AgentMessagePrune
from core.modules.agents.support.agent_removal import AgentRemoval
from core.modules.agents.support.agent_renumber_map import AgentRenumberMap
from core.modules.agents.support.column_rule import ColumnRule
from core.modules.agents.support.fold_copy import FoldCopy
from core.modules.agents.support.main_row import MainRow
from core.modules.agents.support.project_environment import ProjectEnvironment
from core.modules.agents.support.project_main_fold import ProjectMainFold
from core.modules.agents.support.removed_agent_actors import RemovedAgentActors
from core.modules.agents.support.renumber_check import RenumberCheck

AGENT_COUNT = Statement("SELECT count(*) AS n FROM agents", scan_reason=SCHEMA_REASON)
RENUMBERED = Statement("SELECT 1 FROM agent_renumber_summary WHERE id = 1", scan_reason=SCHEMA_REASON)
ENVIRONMENTS = Statement("SELECT id, folder FROM environments ORDER BY id", scan_reason=SCHEMA_REASON)
MAIN_AGENTS = Statement("SELECT id, environment_id, number, role, ended_at FROM agents WHERE role = 'main' ORDER BY id", scan_reason=SCHEMA_REASON)
SUMMARY_INSERT = "INSERT INTO agent_renumber_summary (id, copy, counts, renumbered_at) VALUES (1, ?, ?, ?)"


class AgentRenumber:
    """Renumbers the agents in one write with the foreign keys off, after a whole copy of the database: folds
    every main agent into the project environment's, deletes the messages other agents sent, removes the agents
    that go with what is only theirs, moves their actors out of the agents' ids, gives the agents that stay the
    ids 1 to n with their actors, checks it all and stores the summary; any refusal rolls it all back. A journal
    with no agents, or one renumbered before, is left as it is."""

    def __init__(self, database: Database, home: JournalHome) -> None:
        self.database, self.home = database, home

    def is_needed(self) -> bool:
        return int(self.database.rows(AGENT_COUNT)[0]["n"]) > 0 and not self.database.rows(RENUMBERED)

    def project_environment_id(self) -> int:
        project = self.home.project_folder.resolve()
        environment_ids = [int(row["id"]) for row in self.database.rows(ENVIRONMENTS) if Path(str(row["folder"])).resolve() == project]
        chosen = ProjectEnvironment.first(environment_ids, [MainRow.parsed(row) for row in self.database.rows(MAIN_AGENTS)])
        if chosen is None:
            raise Refusal(f"no environment works in the project folder {project}", "start a main session in the project folder, then start again")
        return chosen

    def run(self, timestamp: Timestamp) -> dict[str, object]:
        ColumnRule.sets(SchemaColumns(self.database).columns())
        environment_id = self.project_environment_id()
        copy = FoldCopy.renumber_copy(self.database, self.home, timestamp)
        rewrite = ReferenceRewrite(self.database)
        try:
            with rewrite.without_foreign_keys():
                with self.database.transaction():
                    summary = self.renumbered(environment_id, timestamp)
                    summary["copy"] = str(copy)
                    self.database.update(Statement(SUMMARY_INSERT, [str(copy), json.dumps(summary), timestamp.text]))
        except (Refusal, sqlite3.Error) as error:
            raise Refusal(f"the renumber of agents rolled back, so nothing changed: {error}; the copy from before it is {copy}",
                          "the next start tries again") from error
        return summary

    def renumbered(self, environment_id: int, timestamp: Timestamp) -> dict[str, object]:
        folds = ProjectMainFold(self.database).folded(environment_id, timestamp.text)
        main_id = int(self.database.rows(MAIN_AGENTS)[0]["id"])
        plan = AgentKeepRule(self.database).plan()
        check = RenumberCheck(self.database)
        counts_before, samples = check.tables_counted(), check.samples()
        removal = RemovalCounts()
        removal.add(AgentMessagePrune(self.database).removed(main_id))
        removal.add(AgentRemoval(self.database).removed(plan.goes))
        RemovedAgentActors(self.database).moved()
        AgentRenumberMap(self.database).renumbered(main_id)
        check.checked(counts_before, removal.deleted, samples)
        return {"stayed": len(plan.stays), "removed": len(plan.goes), "folded": folds.tables_prior.get("agents", 0) - folds.tables_after.get("agents", 0),
                "deleted": removal.deleted, "nulled": removal.nulled, "rows_before": sum(counts_before.values()),
                "rows_after": sum(counts_before.values()) - sum(removal.deleted.values())}
