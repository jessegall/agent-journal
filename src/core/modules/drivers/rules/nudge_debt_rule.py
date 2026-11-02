from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.commands.settle_debt.settle_debt import SettleDebt
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.nudge_debt import NudgeDebt
from core.modules.drivers.support.driver_nudges import DEBT_COUNTDOWN, DEBT_HOLD

TOOL_USES_GIVEN = 5
COUNTDOWN_FROM = 3


class NudgeDebtRule(DriverRule):
    """A line that named a command is owed: its command settles it, the tool uses count down, and past the fifth only
    reads and journal commands run, so the paying command and the skip always go through."""

    name = "drivers.nudge-debts"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        debts = tuple(self.queries.query(NudgeDebt).filter(agent_id=hook.agent_id).matching(IsNull("settled_at")).oldest().all_rows())
        if not debts:
            return RuleAnswer.allowed()
        command = str(hook.event.tool_input().get("command", ""))
        paid = [debt for debt in debts if debt.pays in command]
        owed = [debt for debt in debts if debt not in paid]
        tool = hook.event.tool
        allowed = tool is not None and (tool.is_journal_line or tool.is_reading)
        for debt in owed:
            if self.tool_uses(debt) >= TOOL_USES_GIVEN and not allowed:
                return RuleAnswer.refused(DEBT_HOLD.nudge(subject=debt.subject, debt=debt.id))
        lines = [DEBT_COUNTDOWN.nudge(subject=debt.subject, left=TOOL_USES_GIVEN - uses) for debt in owed if COUNTDOWN_FROM <= (uses := self.tool_uses(debt) + 1) <= TOOL_USES_GIVEN]
        return RuleAnswer.with_nudges(*lines).running(*(SettleDebt(debt.id) for debt in paid))

    def tool_uses(self, debt: NudgeDebt) -> int:
        return self.queries.query(HookCall).filter(agent_id=debt.agent_id, hook=HookEventName.PRE_TOOL_USE).matching(Greater("id", debt.opened_call_id)).count()
