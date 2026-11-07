from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.documents.conditions.work_context_seeds import WorkContextSeeds


@dataclass(frozen=True)
class WorkContextMessages:
    """Finds one distance window of a resource's conversation without loading its message bodies."""

    seeds: WorkContextSeeds
    environment_id: int
    start: int = 0
    length: int = 20
    excluded_ids: tuple[int, ...] = ()
    participant_ids: tuple[int, ...] = ()

    def statement(self) -> Statement:
        seeds = self.seeds.statement()
        stop = self.start + self.length
        excluded = "" if not self.excluded_ids else f" AND m.id NOT IN ({', '.join('?' for _ in self.excluded_ids)})"
        participants = "" if not self.participant_ids else f"""WHERE (ancestor = 1 OR id IN (
            SELECT id FROM messages WHERE environment_id = ? AND (
                target_agent_id IS NULL OR target_agent_id IN ({', '.join('?' for _ in self.participant_ids)})
                OR target_agent_id IN (SELECT target_agent_id FROM messages WHERE id IN (SELECT id FROM context_seeds))
            )))"""
        sql = f"""id IN (
            WITH RECURSIVE context_seeds(id) AS ({seeds.sql}),
            context_walk(id, depth, ancestor) AS (
                SELECT id, 0, 1 FROM context_seeds
                UNION SELECT m.id, context_walk.depth + 1, context_walk.ancestor FROM context_walk
                    JOIN messages child ON child.id = context_walk.id
                    JOIN messages m ON m.id = child.parent_id AND m.environment_id = ?
                    WHERE context_walk.depth + 1 < ? {excluded}
                UNION SELECT m.id, context_walk.depth + 1, 0 FROM context_walk
                    CROSS JOIN messages m ON m.parent_id = context_walk.id AND m.environment_id = ?
                    WHERE context_walk.depth + 1 < ? {excluded}
                UNION SELECT m.id, context_walk.depth + 1, context_walk.ancestor FROM context_walk
                    CROSS JOIN links l ON l.source_model = 'message' AND l.source_id = context_walk.id
                        AND l.target_model = 'message' AND l.link_type = 'comments_on'
                    JOIN messages m ON m.id = l.target_id AND m.environment_id = ?
                    WHERE context_walk.depth + 1 < ? {excluded}
                UNION SELECT m.id, context_walk.depth + 1, 0 FROM context_walk
                    CROSS JOIN links l ON l.target_model = 'message' AND l.target_id = context_walk.id
                        AND l.source_model = 'message' AND l.link_type = 'comments_on'
                    JOIN messages m ON m.id = l.source_id AND m.environment_id = ?
                    WHERE context_walk.depth + 1 < ? {excluded}
            )
            SELECT id FROM context_walk {participants} GROUP BY id HAVING min(depth) >= ? AND min(depth) < ?
        )"""
        permission_parameters = () if not self.participant_ids else (self.environment_id, *self.participant_ids)
        steps = tuple(value for _ in range(4) for value in (self.environment_id, stop, *self.excluded_ids))
        return Statement(sql, (*seeds.parameters, *steps, *permission_parameters, self.start, stop))
