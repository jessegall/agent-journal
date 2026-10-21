from journal.models.phone import Phone
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.support.scope import Scope


class PhoneWaits:
    """What waits for the user in the phone's environment, by reference: the questions the agent asked and nobody answered, and the plans ready for the user's approval."""

    def __init__(self, questions: Questions, plans: Plans, scope: Scope) -> None:
        self.questions, self.plans, self.scope = questions, plans, scope

    def refs(self, phone: Phone) -> list[str]:
        with self.scope.of(phone.environment_id):
            return [*(f"questions:{q.id}" for q in self.questions.open()), *(f"plans:{p.id}" for p in self.plans.matching(state=PlanState.READY))]
