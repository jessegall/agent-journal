from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.conditions.time_reached import TimeReached
from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice import SendReaderRequestNotice
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.support.process_nudges import READER_BLOCK, READER_REQUEST_COUNTDOWN, READER_REQUEST_REFUSAL, READER_REQUEST_SPAN
from core.modules.processes.support.reader_block_keys import ReaderBlockKeys
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.support.reader_request_text import ReaderRequestText
from core.modules.processes.support.reader_save_attempts import ReaderSaveAttempts
from core.modules.processes.support.reader_writers import ReaderWriters


class ReaderRequestBlocks:
    """The blocks of a reader request: the agent that must have the reader is held until the request is completed
    or expires, and the main agent is asked to help after failed saves."""

    def __init__(self, requests: ReaderRequestQuery, request_text: ReaderRequestText, notices: ReaderRequestNotices, writers: ReaderWriters, attempts: ReaderSaveAttempts,
                 bus: Bus, clock: Clock) -> None:
        self.requests, self.request_text, self.notices, self.writers, self.attempts = requests, request_text, notices, writers, attempts
        self.bus, self.clock = bus, clock

    def request_block(self, process: Process, part: ProcessPart, context: Context) -> None:
        request = self.requests.find(part.reader_request_id)
        if request.completed_at is not None or request.expires_at <= self.clock.timestamp():
            return
        nudge = READER_BLOCK.nudge(output=part.process_id, request=request.id)
        ends = AnyCondition(ReaderRequestCompleted(request.id), TimeReached(request.expires_at.text))
        self.bus.dispatch(BlockUntil(process.session_agent_id, ReaderBlockKeys.keyed(nudge, request.id), ends), context)

    def request_answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        if hook.role != AgentRole.MAIN:
            return RuleAnswer.with_nudges(*(self.request_text.line(request) for request in self.writers.agent_requests(Actor(hook.agent_id, ActorType.AGENT))))
        waiting = tuple(request for request in self.requests.open_rows()
                        if (self.attempts.needs_help(request) or request.expires_at <= hook.timestamp)
                        if not self.notices.has_recent_notice(hook.agent_id, request.id, hook.timestamp))
        blocks = tuple(self.help_block(hook.agent_id, request) for request in waiting)
        if hook.event.event is HookEventName.TICK:
            return RuleAnswer.allowed().running(*blocks, *(SendReaderRequestNotice(hook.agent_id, request.id) for request in waiting))
        return RuleAnswer.with_nudges(*(self.request_text.line(request) for request in waiting)).running(*blocks)

    @staticmethod
    def help_block(agent_id: int, request: ReaderRequest) -> BlockUntil:
        refusal = READER_REQUEST_REFUSAL.nudge(request=request.id, command=request.command, block="{block}")
        countdown = READER_REQUEST_COUNTDOWN.nudge("{left}", command=request.command)
        return BlockUntil(agent_id, ReaderBlockKeys.keyed(refusal, request.id), ReaderRequestCompleted(request.id),
                          after=Interval(READER_REQUEST_SPAN), countdown=countdown)
