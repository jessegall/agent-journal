import json
import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import AGENT, CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.state_walk import StateWalk
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle

TABLE = "questions"


class QuestionsMove(VersionFourMove):
    """Carries version 4's questions with their numbers, text, options, recommended choice and answer, asked by
    the agent whose session wrote them; an answered one is answered and the rest open. A question whose agent
    did not move is skipped and told."""

    name = "questions"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        agents = {row["session"]: row["id"] for row in source.rows("agents")}
        for row in source.rows(TABLE):
            actor_type, _, session = (row["creator"] or "").partition(":")
            agent_id = map.new_id("agents", agents[session]) if actor_type == AGENT and session in agents else None
            if agent_id is None:
                report.skip(TABLE, row["id"], "the agent that asked it did not move")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, agent_id, creators.actor_id(row["creator"]), context)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, agent_id: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        question_id = rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "agent_id": agent_id, "creator_id": creator_id, "text": row["text"],
                                   "options": json.dumps(json.loads(row["options"] or "[]")), "recommended": row["recommended"] or "", "answer": row["answer"] or "",
                                   "created_at": created, "updated_at": row["updated_at"] or created})
        for step in StateWalk(QuestionLifecycle).path(QuestionState.ANSWERED if row["answer"] else QuestionState.OPEN) or []:
            rows.set_state(TABLE, question_id, step.value)
        return question_id
