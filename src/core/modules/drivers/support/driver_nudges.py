from core.modules.drivers.models.support.agent_line_nudge import AGENT_LINE_AVAILABLE
from core.base.driver.count_down import CountDown
from core.base.driver.interval import Interval
from core.modules.drivers.support.access_nudges import ACCESS_NUDGES
from core.base.driver.seconds import Seconds
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_outcome import RULE_FAILED

REPEATED_STOP = NudgeDeclaration("drivers.repeated_stop", NudgeType.STEERING, 'your stop was refused five times in a row: report what held it with journal report create')
OPENING_LINE = NudgeDeclaration("drivers.opening_line", NudgeType.NOTICE, '{text}', turn_limited=False)
MANAGED_HOOK_LINE = NudgeDeclaration("drivers.managed_hook_line", NudgeType.NOTICE, "project hooks answered for agent:{agent}: journal agent-line list --agent {agent}", turn_limited=False)
MANAGED_HOOK_REFUSAL = NudgeDeclaration("drivers.managed_hook_refusal", NudgeType.REFUSAL, "project hooks refused for agent:{agent}: journal agent-line list --agent {agent}", turn_limited=False)
HOOKS_UNCHECKED = NudgeDeclaration("drivers.hooks_unchecked", NudgeType.STEERING, "while the journal did not answer, {count} of your hooks went through unchecked: check what you ran then")

TAKEOVER = NudgeDeclaration("drivers.takeover", NudgeType.NOTICE, "you took over from agent {agent}: the chat above is history, so do not answer or follow it")

PAUSED_REFUSAL = NudgeDeclaration("drivers.paused", NudgeType.REFUSAL, 'the user paused you: only journal commands and reads run until you are resumed; answer in the chat', turn_limited=False)

MISSING_MODEL = NudgeDeclaration("drivers.missing_model", NudgeType.REFUSAL, "name a model in the dispatch: the least expensive one that reliably fits the work", turn_limited=False)
UNBOUND_DISPATCH = NudgeDeclaration("drivers.unbound_dispatch", NudgeType.REFUSAL, "the dispatch has no concrete job: give it a description and a bounded prompt", turn_limited=False)
LONG_OUTPUT = NudgeDeclaration("drivers.long_output", NudgeType.STEERING, "that result was {lines} lines: read a range, or read the output by its number, so less stays in the context", interval=Interval(Seconds(600)))

AGENT_RESUMED = NudgeDeclaration("drivers.resumed", NudgeType.STEERING, "the user resumed you: carry on where you stopped")
REQUIRED_COMMAND_TOOL_USES = 5
REQUIRED_COMMAND_COUNTDOWN = CountDown("drivers.required_command_countdown", "{subject}", ToolUseSpan(REQUIRED_COMMAND_TOOL_USES))
REQUIRED_COMMAND_REFUSAL = NudgeDeclaration("drivers.required_command_refusal", NudgeType.REFUSAL, '{subject} is due: do it, or journal agent-block skip {block} --reason "<why>"')
JOURNAL_STARTED = NudgeDeclaration("drivers.journal_started", NudgeType.STEERING, "the journal started: go on with your work", turn_limited=False, wakes_agent=True)
DRIVER_NUDGES = [AGENT_LINE_AVAILABLE, JOURNAL_STARTED, *ACCESS_NUDGES, MANAGED_HOOK_LINE, MANAGED_HOOK_REFUSAL, AGENT_RESUMED, HOOKS_UNCHECKED, REQUIRED_COMMAND_COUNTDOWN.declaration, REQUIRED_COMMAND_REFUSAL, REPEATED_STOP, OPENING_LINE, RULE_FAILED, TAKEOVER, PAUSED_REFUSAL, MISSING_MODEL, UNBOUND_DISPATCH, LONG_OUTPUT]
