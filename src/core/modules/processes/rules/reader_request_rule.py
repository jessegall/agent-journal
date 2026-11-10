from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.driver.hook_event_name import HookEventName
from engine.scope.actor_scope import ActorScope
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.reader_request_text import ReaderRequestText
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice import SendReaderRequestNotice
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.processes.support.reader_writers import ReaderWriters
from core.modules.processes.support.reader_save_attempts import ReaderSaveAttempts


class ReaderRequestRule(DriverRule):
    """Asks an agent for its reader and the main agent for help after failed saves."""

    name = "processes.reader-request"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    history = True
    disabled_scopes = [ActorScope]

    def __init__(self, requests: ReaderRequestQuery, request_text: ReaderRequestText, notices: ReaderRequestNotices,
                 writers: ReaderWriters, attempts: ReaderSaveAttempts) -> None:
        self.requests, self.request_text = requests, request_text
        self.notices = notices
        self.writers, self.attempts = writers, attempts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        if hook.role != AgentRole.MAIN:
            return RuleAnswer.with_nudges(*(self.request_text.line(request) for request in self.writers.agent_requests(Actor(hook.agent_id, ActorType.AGENT))))
        waiting = tuple(request for request in self.requests.open().oldest().all_rows()
                        if (self.attempts.needs_help(request) or request.expires_at <= hook.timestamp)
                        if not self.notices.has_recent_notice(hook.agent_id, request.id, hook.timestamp))
        blocks = tuple(self.request_text.block(hook.agent_id, request) for request in waiting)
        if hook.event.event is HookEventName.TICK:
            return RuleAnswer.allowed().running(*blocks, *(SendReaderRequestNotice(hook.agent_id, request.id) for request in waiting))
        return RuleAnswer.with_nudges(*(self.request_text.line(request) for request in waiting)).running(*blocks)
