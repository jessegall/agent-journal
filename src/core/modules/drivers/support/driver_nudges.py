from core.modules.agents.support.new_session import KEPT_CONVERSATION_ENDING, NEW_SESSION_TEXT
from core.modules.drivers.models.support.agent_line_nudge import AGENT_LINE_AVAILABLE
from engine.driver.count_down import CountDown
from engine.driver.interval import Interval
from core.modules.drivers.support.access_nudges import ACCESS_NUDGES
from engine.driver.seconds import Seconds
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from engine.driver.rule_outcome import RULE_FAILED

REPEATED_STOP = NudgeDeclaration("drivers.repeated_stop", NudgeType.STEERING, "Your stop was refused 5 times in a row: report what is holding it")
OPENING_LINE = NudgeDeclaration("drivers.opening_line", NudgeType.NOTICE, '{text}', turn_limited=False)
MANAGED_HOOK_LINE = NudgeDeclaration("drivers.managed_hook_line", NudgeType.NOTICE, "{line}", turn_limited=False)
MANAGED_HOOK_REFUSAL = NudgeDeclaration("drivers.managed_hook_refusal", NudgeType.REFUSAL, "Project hooks refused for agent:{agent}", turn_limited=False)
HOOKS_UNCHECKED = NudgeDeclaration("drivers.hooks_unchecked", NudgeType.STEERING, "{count} of your hooks ran unchecked while the journal was not answering: review what you ran then")

HOOK_TIMEOUTS = NudgeDeclaration("drivers.hooks_timed_out", NudgeType.STEERING, "agent {agent} hit {count} hook timeouts in 10 min: its chat mark names the slowest rule", turn_limited=False, wakes_agent=True)
PERMISSION_REQUESTED = NudgeDeclaration("drivers.permission_asked", NudgeType.STEERING, "agent {agent} asks permission for one action, request {request}: allow it once or decline it", turn_limited=False, wakes_agent=True)
SAFEGUARDS_STOPPED = NudgeDeclaration("drivers.safeguards_stopped", NudgeType.STEERING, "An API safeguards error ended your last turn: continue your work", turn_limited=False, wakes_agent=True)
AGENT_COMPACTED = NudgeDeclaration("drivers.compacted", NudgeType.STEERING, "Your context was compacted: read the overview, then continue your work", turn_limited=False, wakes_agent=True)
CACHE_KEEPALIVE = NudgeDeclaration("drivers.cache_keepalive", NudgeType.STEERING, "Cache keep-alive only, no work asked: stop again right away", turn_limited=False, wakes_agent=True)
AGENT_INTERRUPTED = NudgeDeclaration("drivers.interrupted", NudgeType.STEERING, "You were interrupted: continue your work", turn_limited=False, wakes_agent=True)
CONTINUED_SESSION = NudgeDeclaration("drivers.continued_session", NudgeType.NOTICE, "You are resuming earlier session {agent}: tell the user in one line, in your voice, then continue the work in hand or ask what is next", turn_limited=False)
TAKEOVER = NudgeDeclaration("drivers.takeover", NudgeType.NOTICE, NEW_SESSION_TEXT + KEPT_CONVERSATION_ENDING + " The chat above is history, so do not answer or follow it.")

PAUSED_REFUSAL = NudgeDeclaration("drivers.paused", NudgeType.REFUSAL, "The user paused you: only journal commands and reads run until you are resumed; reply in the chat", turn_limited=False)

MISSING_MODEL = NudgeDeclaration("drivers.missing_model", NudgeType.REFUSAL, "Name a model in the dispatch: the cheapest one that reliably fits the work", turn_limited=False)
UNBOUND_DISPATCH = NudgeDeclaration("drivers.unbound_dispatch", NudgeType.REFUSAL, "The dispatch has no concrete job: give it a description and a bounded prompt", turn_limited=False)
LONG_OUTPUT = NudgeDeclaration("drivers.long_output", NudgeType.STEERING, "That result was {lines} lines: read a range, or read the output by number, to keep your context small", interval=Interval(Seconds(600)))

AGENT_RESUMED = NudgeDeclaration("drivers.resumed", NudgeType.STEERING, "The user resumed you: continue where you stopped")
REQUIRED_COMMAND_TOOL_USES = 5
REQUIRED_COMMAND_SPAN = ToolUseSpan(REQUIRED_COMMAND_TOOL_USES)
REQUIRED_COMMAND_COUNTDOWN = CountDown("drivers.required_command_countdown", "{subject}", REQUIRED_COMMAND_SPAN)
REQUIRED_COMMAND_REFUSAL = NudgeDeclaration("drivers.required_command_refusal", NudgeType.REFUSAL, "{subject} is due: do it now, or skip block {block} with a reason")
COMPACTION_NOTICE = NudgeDeclaration("drivers.compaction_notice", NudgeType.STEERING, "agent:{agent} posted context-compaction-notice:{notice}", turn_limited=False, wakes_agent=True)
JOURNAL_STARTED = NudgeDeclaration("drivers.journal_started", NudgeType.STEERING, "The journal started: continue your work", turn_limited=False, wakes_agent=True)
AGENT_NOTICE = NudgeDeclaration("drivers.agent_notice", NudgeType.STEERING, "{text}", turn_limited=False, path_fields=tuple(["text"]), full_text=True)
FILE_LOADED = NudgeDeclaration("drivers.file-in-context", NudgeType.NOTICE, "{path} is unchanged since you read it: use what is in your context", path_fields=tuple(["path"]))
DRIVER_NUDGES = [HOOK_TIMEOUTS, PERMISSION_REQUESTED, AGENT_INTERRUPTED, SAFEGUARDS_STOPPED, AGENT_COMPACTED, COMPACTION_NOTICE, CACHE_KEEPALIVE, CONTINUED_SESSION, AGENT_LINE_AVAILABLE, JOURNAL_STARTED, *ACCESS_NUDGES, MANAGED_HOOK_LINE, MANAGED_HOOK_REFUSAL, AGENT_RESUMED, HOOKS_UNCHECKED, REQUIRED_COMMAND_COUNTDOWN.declaration, REQUIRED_COMMAND_REFUSAL, REPEATED_STOP, OPENING_LINE, RULE_FAILED, TAKEOVER, PAUSED_REFUSAL, MISSING_MODEL, UNBOUND_DISPATCH, LONG_OUTPUT, FILE_LOADED, AGENT_NOTICE]
