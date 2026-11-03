from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.hook_event_name import HookEventName
from core.base.scope.actor_scope import ActorScope
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_request_text import ReaderRequestText
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice import SendReaderRequestNotice


class ReaderRequestRule(DriverRule):
    """Gives the main agent five tool uses to answer open reader requests."""

    name = "processes.reader-request"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    history = True
    disabled_scopes = [ActorScope]

    def __init__(self, requests: ReaderRequestQuery, request_text: ReaderRequestText, notices: ReaderRequestNotices) -> None:
        self.requests, self.request_text = requests, request_text
        self.notices = notices

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        waiting = tuple(request for request in self.requests.environment(hook.environment_id).open().oldest().all_rows()
                        if not self.notices.has_recent_notice(hook.agent_id, request.id, hook.timestamp))
        blocks = tuple(self.request_text.block(hook.agent_id, request) for request in waiting)
        if hook.event.event is HookEventName.TICK:
            return RuleAnswer.allowed().running(*blocks, *(SendReaderRequestNotice(hook.agent_id, request.id) for request in waiting))
        return RuleAnswer.with_nudges(*(self.request_text.line(request) for request in waiting)).running(*blocks)
