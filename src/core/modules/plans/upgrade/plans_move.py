import sqlite3
from functools import partial

from core.base.database.database import Database
from core.base.database.row_insert import RowInsert
from core.base.upgrade.creator_resolver import CreatorResolver
from core.base.upgrade.move_context import MoveContext
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.move_report import MoveReport
from core.base.upgrade.state_walk import StateWalk
from core.base.upgrade.version_four_move import VersionFourMove
from core.base.upgrade.version_four_ref import VersionFourRef
from core.base.upgrade.version_four_source import VersionFourSource
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle

TABLE = "plans"
PHASE_LINK = "phase_of"
STATES = {member.value: member for member in PlanState}
RENAMED = {"reviewing": PlanState.READY, "delegated": PlanState.STARTED, "done": PlanState.COMPLETED, "paused": PlanState.APPROVED}
CLOSED = (PlanState.COMPLETED, PlanState.CANCELLED)


class PlansMove(VersionFourMove):
    """Carries version 4's plans with their numbers and states (reviewing is ready, delegated is started,
    done is completed and a paused plan is approved, so it can be started again), their phases (linked
    phase_of, in link order) with title, goal and checkpoint, and the tasks in each phase in the order of
    their links. Plan reviews and reviewers are dropped and counted. A plan in a state version 5 does not
    know is skipped and told."""

    name = "plans"
    reads = ["plans", "phases"]
    drops = ["plan_reviews", "reviewers"]
    id_modules = ["journal.core.actors", "journal.core.environments", "journal.core.tasks"]

    def move(self, source: VersionFourSource, target: Database, map: MoveMap, context: MoveContext) -> MoveReport:
        report, creators, rows = MoveReport(), CreatorResolver(target, map), RowInsert(target)
        for row in source.rows(TABLE):
            state = RENAMED.get(row["state"]) or STATES.get(row["state"])
            if state is None:
                report.skip(TABLE, row["id"], f"state {row['state']} is none of {', '.join(STATES)}")
            else:
                report.count(TABLE, map.transfer(TABLE, row["id"], TABLE, partial(self.insert, rows, row, state, creators.actor_id(row["creator"]), context)))
        self.phases(source, rows, creators, map, report, context)
        self.tasks(source, rows, creators, map, report, context)
        for table in self.drops:
            report.drop(table, len(source.rows(table)))
        return report

    def insert(self, rows: RowInsert, row: sqlite3.Row, state: PlanState, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        plan_id = rows.insert(TABLE, {"id": row["id"], "environment_id": row["environment_id"], "creator_id": creator_id, "title": row["title"], "brief": row["brief"] or "",
                                      "reason": row["block_reason"] or "", "closed_at": (row["updated_at"] or created) if state in CLOSED else None,
                                      "created_at": created, "updated_at": row["updated_at"] or created})
        for step in StateWalk(PlanLifecycle).path(state) or []:
            rows.set_state(TABLE, plan_id, step.value)
        return plan_id

    def phases(self, source: VersionFourSource, rows: RowInsert, creators: CreatorResolver, map: MoveMap, report: MoveReport, context: MoveContext) -> None:
        phases = {row["id"]: row for row in source.rows("phases")}
        positions: dict[int, int] = {}
        for link in [row for row in source.rows("links") if row["link_type"] == PHASE_LINK]:
            phase, plan = VersionFourRef.parsed(link["source"]), VersionFourRef.parsed(link["target"])
            plan_id = map.linked_id(plan, TABLE)
            row = phases.get(phase.number) if phase.table == "phases" and phase.number is not None else None
            if plan_id is None or row is None:
                report.skip("links", link["id"], "its phase or its plan did not move")
                continue
            positions[plan_id] = positions.get(plan_id, 0) + 1
            report.count("phases", map.transfer("phases", row["id"], "phases", partial(self.phase, rows, row, plan_id, positions[plan_id], creators.actor_id(row["creator"]),
                                                                                        context)))

    def phase(self, rows: RowInsert, row: sqlite3.Row, plan_id: int, position: int, creator_id: int, context: MoveContext) -> int:
        created = row["created_at"] or context.timestamp
        return rows.insert("phases", {"id": row["id"], "plan_id": plan_id, "creator_id": creator_id, "position": position, "title": row["title"],
                                      "goal": row["completion_rule"] or "", "checkpoint": 1 if row["checkpoint"] else 0, "created_at": created,
                                      "updated_at": row["updated_at"] or created})

    def tasks(self, source: VersionFourSource, rows: RowInsert, creators: CreatorResolver, map: MoveMap, report: MoveReport, context: MoveContext) -> None:
        positions: dict[int, int] = {}
        phase_links = [row for row in source.rows("links") if row["link_type"] == "in_phase"]
        latest = {link["source"]: link["id"] for link in phase_links}
        report.drop("in_phase links older than the task's last phase", sum(1 for link in phase_links if latest[link["source"]] != link["id"]))
        for link in [row for row in phase_links if latest[row["source"]] == row["id"]]:
            task, phase = VersionFourRef.parsed(link["source"]), VersionFourRef.parsed(link["target"])
            task_id, phase_id = map.linked_id(task, "tasks"), map.linked_id(phase, "phases")
            if task_id is None or phase_id is None:
                report.skip("links", link["id"], "its task or its phase did not move")
                continue
            positions[phase_id] = positions.get(phase_id, 0) + 1
            report.count("links", map.transfer("links", link["id"], "phase_tasks", partial(self.place, rows, link, creators.actor_id(link["creator"]), phase_id, task_id,
                                                                                         positions[phase_id], context)))

    def place(self, rows: RowInsert, link: sqlite3.Row, creator_id: int, phase_id: int, task_id: int, position: int, context: MoveContext) -> int:
        created = link["created_at"] or context.timestamp
        return rows.insert("phase_tasks", {"phase_id": phase_id, "task_id": task_id, "creator_id": creator_id, "position": position, "created_at": created,
                                           "updated_at": link["updated_at"] or created})
