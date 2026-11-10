import json
import sqlite3
from functools import partial

from core.base.database.actor_table import ActorTable
from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from engine.upgrade.creator_resolver import AGENT, CreatorResolver
from engine.upgrade.move_context import MoveContext
from engine.upgrade.move_map import MoveMap
from engine.upgrade.move_report import MoveReport
from engine.upgrade.state_walk import StateWalk
from engine.upgrade.version_four_move import VersionFourMove
from engine.upgrade.version_four_source import VersionFourSource
from core.modules.documents.upgrade.whole_text_documents import WholeTextDocuments
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.questions.models.question import TEXT_LIMIT_CHARACTERS

TABLE = "questions"


class QuestionsMove(VersionFourMove):
    """Carries version 4's questions, with their answers, to the agents whose sessions wrote them; one a person's
    row signed, which version 3's questions are, goes to the environment's newest main agent."""

    name = "questions"
    reads = [TABLE]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        sessions, documents = ActorTable(target), WholeTextDocuments(rows, TEXT_LIMIT_CHARACTERS, "question")
        for row in source.rows(TABLE):
            actor_type, _, session = (row["creator"] or "").partition(":")
            agent_id = sessions.agent_actor_id(session) if actor_type == AGENT else sessions.newest_main_agent_id(row["environment_id"])
            if agent_id is None:
                report.skip(TABLE, row["id"], "the agent that asked it did not move")
                continue
            report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, documents, row, agent_id, creators.actor_id(row["creator"]), context)))
        if documents.document_ids:
            report.note(documents.note())
        return report

    def insert(self, rows: RowInsert, documents: WholeTextDocuments, row: sqlite3.Row, agent_id: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        question_id = rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "session_agent_id": agent_id, "creator_id": creator_id,
                                   "text": documents.fitting_text(row, creator_id, created),
                                   "options": json.dumps(json.loads(row["options"] or "[]")), "recommended": row["recommended"] or "", "answer": row["answer"] or "",
                                   "created_at": created, "updated_at": row["updated_at"] or created})
        for step in StateWalk(QuestionLifecycle).path(QuestionState.ANSWERED if row["answer"] else QuestionState.OPEN) or []:
            rows.set_state(TABLE, question_id, step.value)
        return question_id
