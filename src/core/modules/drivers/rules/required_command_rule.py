from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.commands.close_required_command.close_required_command import CloseRequiredCommand
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.required_command import RequiredCommand
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_COUNTDOWN, REQUIRED_COMMAND_REFUSAL

TOOL_USES_GIVEN = 5
COUNTDOWN_START_USES = 3


class RequiredCommandRule(DriverRule):
    """A line that named a command is open_commands: its command settles it, the tool use_count count down, and past the
    fifth only reads and journal commands run, so the paying command and the skip always go through."""

    name = "drivers.nudge-required_commands"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        required_commands = tuple(self.queries.query(RequiredCommand).filter(agent_id=hook.agent_id).matching(IsNull("closed_at")).oldest().all_rows())
        if not required_commands:
            return RuleAnswer.allowed()
        command = str(hook.event.tool_input().get("command", ""))
        ran_commands = [required_command for required_command in required_commands if required_command.required_command in command]
        open_commands = [required_command for required_command in required_commands if required_command not in ran_commands]
        tool = hook.event.tool
        allowed = tool is not None and (tool.is_journal_line or tool.is_reading)
        for required_command in open_commands:
            if self.tool_uses(required_command) >= TOOL_USES_GIVEN and not allowed:
                return RuleAnswer.refused(REQUIRED_COMMAND_REFUSAL.nudge(subject=required_command.subject, required_command=required_command.id))
        countdown_lines = [REQUIRED_COMMAND_COUNTDOWN.nudge(subject=required_command.subject, left=TOOL_USES_GIVEN - use_count) for required_command in open_commands if COUNTDOWN_START_USES <= (use_count := self.tool_uses(required_command) + 1) <= TOOL_USES_GIVEN]
        return RuleAnswer.with_nudges(*countdown_lines).running(*(CloseRequiredCommand(required_command.id) for required_command in ran_commands))

    def tool_uses(self, required_command: RequiredCommand) -> int:
        return self.queries.query(HookCall).filter(agent_id=required_command.agent_id, hook=HookEventName.PRE_TOOL_USE).matching(Greater("id", required_command.opened_call_id)).count()
