from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.conditions.among import Among


@dataclass(frozen=True)
class AgentRoleProfileCondition:
    roles: list[str]
    profiles: list[str]

    def statement(self) -> Statement:
        statements: list[Statement] = []
        if self.roles:
            statements.append(Among("role", self.roles).statement())
        if self.profiles:
            statements.append(Among("coalesce(nullif(profile, ''), job_profile)", self.profiles).statement())
        return Statement("(" + " OR ".join(item.sql for item in statements) + ")", [value for item in statements for value in item.parameters])
