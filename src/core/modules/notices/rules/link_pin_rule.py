import re

from core.base.agent_role import AgentRole
from core.base.clock import Clock
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.base.type_guards import is_mapping
from core.modules.notices.models.notice import Notice
from core.modules.notices.support.notice_nudges import LINK_PIN_REQUEST, UNPINNED_CLAIM

LINK = re.compile(r"https?://[^\s<>()\[\]\"'`]+")
LOCAL_ADDRESS = re.compile(r"^https?://(?:localhost|127\.0\.0\.1)[:/]")
PIN_CLAIM = re.compile(r"\b(pinned (?:above|at the top|for you)|(?:i've|i have|i) pinned|(?:it's|it is|now) pinned)\b", re.IGNORECASE)
CLAIM_WINDOW_SECONDS = 60
OUTPUT_FIELD = "stdout"


class LinkPinRule(DriverRule):
    """A link in a command's output that no pin has is offered as a pin, and words in a message that a link is
    pinned, with no pin made in the last minute, are pointed out."""

    name = "notices.link-pin"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, clock: Clock) -> None:
        self.queries, self.clock = queries, clock

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        notices = list(self.queries.query(Notice).filter(environment_id=hook.environment_id).all_rows())
        if PIN_CLAIM.search(tool.shell.line) and not any(notice.created_at is not None and notice.created_at.elapsed_seconds(self.clock.timestamp()) <= CLAIM_WINDOW_SECONDS for notice in notices):
            return RuleAnswer.with_nudges(UNPINNED_CLAIM.nudge())
        response = hook.event.raw.get("tool_response")
        output = response.get(OUTPUT_FIELD) if is_mapping(response) else None
        if not isinstance(output, str):
            return RuleAnswer.allowed()
        pinned = {str(notice.link).rstrip("/") for notice in notices}
        loose = [url.rstrip(".,;:") for url in LINK.findall(output) if not LOCAL_ADDRESS.match(url)]
        unpinned = [url for url in dict.fromkeys(loose) if url.rstrip("/") not in pinned]
        return RuleAnswer.with_nudges(LINK_PIN_REQUEST.nudge(url=unpinned[0])) if unpinned else RuleAnswer.allowed()
