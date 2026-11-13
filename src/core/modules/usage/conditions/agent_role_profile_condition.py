from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.among import Among
from engine.query.conditions.disjunction import Disjunction


@dataclass(frozen=True)
class AgentRoleProfileCondition:
    roles: list[str]
    profiles: list[str]

    def statement(self) -> Statement:
        return Disjunction([Among("role", self.roles), Among("coalesce(nullif(profile, ''), job_profile)", self.profiles)]).statement()
