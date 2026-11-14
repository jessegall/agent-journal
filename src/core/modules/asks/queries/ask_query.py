from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.asks.models.ask import Ask
from core.modules.asks.models.ask_step import AskStep
from core.modules.asks.models.enums.ask_step_state import AskStepState

OPEN_STEP_STATES = (AskStepState.WAITING, AskStepState.DELIVERED)


class AskQuery(Query[Ask]):
    """Reads questions and their steps: an asker's open questions, the steps of one question, and the open steps
    at a level or past their time."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, Ask)

    def open_of(self, asker_id: int) -> list[Ask]:
        return self.filter(asker_id=asker_id).matching(IsNull("closed_at")).oldest().get()

    def steps(self, ask_id: int) -> list[AskStep]:
        return self.step_rows().filter(ask_id=ask_id).oldest().get()

    def open_at_level(self, profile: str) -> list[AskStep]:
        return self.open_steps().filter(profile=profile).oldest().get()

    def waiting_for(self, profile: str) -> list[AskStep]:
        return self.step_rows().filter(profile=profile, state=AskStepState.WAITING).oldest().get()

    def open_steps_due(self, timestamp: Timestamp) -> list[AskStep]:
        return self.open_steps().matching(Less("due_at", timestamp.text)).oldest().get()

    def open_steps(self) -> Query[AskStep]:
        return self.step_rows().matching(Among("state", [state.value for state in OPEN_STEP_STATES]))

    def step_rows(self) -> Query[AskStep]:
        return Query(self.database, self.tables, AskStep)
