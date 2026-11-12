from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.among import Among
from engine.query.conditions.any_of import AnyOf


@dataclass(frozen=True)
class AgentRoleProfileCondition:
    roles: list[str]
    profiles: list[str]

    def statement(self) -> Statement:
        conditions = [*([Among("role", self.roles)] if self.roles else []), *([Among("coalesce(nullif(profile, ''), job_profile)", self.profiles)] if self.profiles else [])]
        return AnyOf(conditions).statement()
