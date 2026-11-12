from dataclasses import dataclass

MAIN_ROLE = "main"
MAIN_NAME = "Main agent"


@dataclass(frozen=True)
class AgentName:
    """The one name of an agent: its role and its number, such as Worker 848, and Main agent for the main agent; a
    given name and a row id are never part of it. A sentence writes it in lower case (label), a card or a view in
    capitals (title), and a view of the database builds it with sql, from the same two parts."""

    role: str
    number: int

    @property
    def title(self) -> str:
        return MAIN_NAME if self.role == MAIN_ROLE else f"{self.role.capitalize()} {self.number}"

    @property
    def label(self) -> str:
        return self.title.lower()

    @staticmethod
    def sql(alias: str) -> str:
        return (f"CASE WHEN {alias}.role = '{MAIN_ROLE}' THEN '{MAIN_NAME}'"
                f" ELSE upper(substr({alias}.role, 1, 1)) || substr({alias}.role, 2) || ' ' || {alias}.number END")
