import sqlite3
from functools import partial
from pathlib import Path

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.driver.command_category import CommandCategory
from core.base.upgrade.agent_sessions import AgentSessions
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.state_walk import StateWalk
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.processes.models.enums.output_state import OutputState
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.lifecycles.output_lifecycle import OutputLifecycle
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle

TABLE = "command_outputs"
SHELL = "sh"


class ProcessesMove(VersionFourMove):
    """Carries version 4's command outputs as processes with the output each kept, under the number they had, run
    by the agent whose session ran them and ended as they ended; an output whose folder is gone is pruned. The
    readers' reports and suggestions of version 4 are dropped and counted."""

    name = "processes"
    reads = [TABLE]
    drops = ["reader_reports", "reader_suggestions"]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        sessions = AgentSessions(source, map)
        for row in source.rows(TABLE):
            agent_id = sessions.agent_id(row["session"]) if row["session"] else None
            if agent_id is None or map.new_id("environments", row["environment_id"]) is None:
                report.skip(TABLE, row["id"], "the agent that ran it or its environment did not move")
                continue
            insert = partial(self.insert, rows, row, agent_id, creators.actor_id(row["creator"]), map.new_id("environments", row["environment_id"]), context)
            report.count("processes", map.transfer(TABLE, row["id"], "processes", insert))
        for table in self.drops:
            report.drop(table, source.count(table))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, agent_id: int, creator_id: int, environment_id: int | None, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        ended = row["updated_at"] or created
        process_id = rows.insert("processes", {"id": row["id"], "environment_id": environment_id, "agent_id": agent_id, "creator_id": creator_id, "line": row["command"] or "",
                                               "folder": row["ran_in"] or "", "shell": SHELL, "category": CommandCategory.UNKNOWN.value, "limit_seconds": 0,
                                               "exit_code": row["status"] if row["ended"] else None, "created_at": created, "updated_at": ended,
                                               "moved_at": created if row["moved"] else None, "ended_at": ended if row["ended"] else None})
        for step in StateWalk(ProcessLifecycle).path(self.state(row)) or []:
            rows.set_state("processes", process_id, step.value)
        output_id = rows.insert("outputs", {"process_id": process_id, "creator_id": creator_id, "folder": row["folder"] or "", "created_at": created, "updated_at": ended,
                                            "read_at": ended if row["is_read"] else None})
        kept = bool(row["folder"]) and Path(row["folder"]).is_dir()
        for step in StateWalk(OutputLifecycle).path(OutputState.KEPT if kept else OutputState.PRUNED) or []:
            rows.set_state("outputs", output_id, step.value)
        return process_id

    def state(self, row: sqlite3.Row) -> ProcessState:
        if not row["ended"]:
            return ProcessState.ORPHANED
        if row["is_interrupted"]:
            return ProcessState.STOPPED
        return ProcessState.FINISHED if row["status"] == 0 else ProcessState.FAILED
