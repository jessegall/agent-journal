from core.modules.drivers.nudges.agent_line_available_nudge import AgentLineAvailableNudge
from engine.driver.count_down import CountDown
from core.modules.drivers.support.access_nudges import ACCESS_NUDGES
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from engine.driver.rule_outcome import RULE_FAILED
from core.modules.drivers.nudges.repeated_stop_nudge import RepeatedStopNudge
from core.modules.drivers.nudges.opening_line_nudge import OpeningLineNudge
from core.modules.drivers.nudges.managed_hook_line_nudge import ManagedHookLineNudge
from core.modules.drivers.nudges.managed_hook_refusal_nudge import ManagedHookRefusalNudge
from core.modules.drivers.nudges.hooks_unchecked_nudge import HooksUncheckedNudge
from core.modules.drivers.nudges.hook_timeouts_nudge import HookTimeoutsNudge
from core.modules.drivers.nudges.permission_requested_nudge import PermissionRequestedNudge
from core.modules.drivers.nudges.safeguards_stopped_nudge import SafeguardsStoppedNudge
from core.modules.drivers.nudges.agent_compacted_nudge import AgentCompactedNudge
from core.modules.drivers.nudges.cache_keepalive_nudge import CacheKeepaliveNudge
from core.modules.drivers.nudges.agent_interrupted_nudge import AgentInterruptedNudge
from core.modules.drivers.nudges.continued_session_nudge import ContinuedSessionNudge
from core.modules.drivers.nudges.takeover_nudge import TakeoverNudge
from core.modules.drivers.nudges.paused_refusal_nudge import PausedRefusalNudge
from core.modules.drivers.nudges.missing_model_nudge import MissingModelNudge
from core.modules.drivers.nudges.unbound_dispatch_nudge import UnboundDispatchNudge
from core.modules.drivers.nudges.long_output_nudge import LongOutputNudge
from core.modules.drivers.nudges.agent_resumed_nudge import AgentResumedNudge
from core.modules.drivers.nudges.required_command_refusal_nudge import RequiredCommandRefusalNudge
from core.modules.drivers.nudges.compaction_notice_nudge import CompactionNoticeNudge
from core.modules.drivers.nudges.journal_started_nudge import JournalStartedNudge
from core.modules.drivers.nudges.agent_notice_nudge import AgentNoticeNudge
from core.modules.drivers.nudges.file_loaded_nudge import FileLoadedNudge


REQUIRED_COMMAND_TOOL_USES = 5
REQUIRED_COMMAND_SPAN = ToolUseSpan(REQUIRED_COMMAND_TOOL_USES)
REQUIRED_COMMAND_COUNTDOWN = CountDown("drivers.required_command_countdown", "{subject}", REQUIRED_COMMAND_SPAN)
DRIVER_NUDGES = [HookTimeoutsNudge, PermissionRequestedNudge, AgentInterruptedNudge, SafeguardsStoppedNudge, AgentCompactedNudge, CompactionNoticeNudge, CacheKeepaliveNudge, ContinuedSessionNudge, AgentLineAvailableNudge, JournalStartedNudge, *ACCESS_NUDGES, ManagedHookLineNudge, ManagedHookRefusalNudge, AgentResumedNudge, HooksUncheckedNudge, REQUIRED_COMMAND_COUNTDOWN.declaration, RequiredCommandRefusalNudge, RepeatedStopNudge, OpeningLineNudge, RULE_FAILED, TakeoverNudge, PausedRefusalNudge, MissingModelNudge, UnboundDispatchNudge, LongOutputNudge, FileLoadedNudge, AgentNoticeNudge]
