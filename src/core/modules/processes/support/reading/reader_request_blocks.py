from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.agent.agent_role_reader import AgentRoleReader
from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from core.modules.drivers.support.minute_tick import MinuteTick
from core.modules.processes.support.reading.reader_help_block import ReaderHelpBlock
from core.modules.processes.support.reading.reader_request_answer import ReaderRequestAnswer
from engine.driver.block_agent import BlockAgent
from engine.driver.interval import Interval
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.processes.commands.send_reader_request_notice.send_reader_request_notice import SendReaderRequestNotice
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.block_conditions.reader_request_completed import ReaderRequestCompleted
from core.modules.processes.support.process_agent_messages import READER_REQUEST_COUNTDOWN, READER_REQUEST_SPAN
from core.modules.processes.agent_messages.reader_request_refusal_message import ReaderRequestRefusalMessage
from core.modules.processes.support.reader_block_keys import ReaderBlockKeys
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.support.reader_request_text import ReaderRequestText
from core.modules.processes.support.reader_save_attempts import ReaderSaveAttempts
from core.modules.processes.support.reader_writers import ReaderWriters

class ReaderRequestBlocks:
    """What a reader request says at an agent's hooks: the agent that must have the reader is told of it, never
    held, and the main agent is asked to help after failed saves or once it expires."""

    def __init__(self, requests: ReaderRequestQuery, request_text: ReaderRequestText, notices: ReaderRequestNotices, writers: ReaderWriters, attempts: ReaderSaveAttempts,
                 bus: Bus, clock: Clock, roles: AgentRoleReader, minute_tick: MinuteTick, request_values: RequestValues) -> None:
        self.requests, self.request_text, self.notices, self.writers, self.attempts = requests, request_text, notices, writers, attempts
        self.bus, self.clock, self.roles, self.minute_tick, self.request_values = bus, clock, roles, minute_tick, request_values

    # what the reader requests say at one hook of the agent, read once a hook; the minute step reads the tick it replaces
    def answer(self, event: HookEvent | None, agent_id: int) -> ReaderRequestAnswer:
        hook_event = event if event is not None else self.minute_tick.event(agent_id)
        return self.request_values.read(f"processes.reader-requests:{agent_id}:{hook_event.event_id}", lambda: hook_event.event_id, lambda: self.found(hook_event, agent_id))

    def found(self, event: HookEvent, agent_id: int) -> ReaderRequestAnswer:
        if not event.accepts_lines:
            return ReaderRequestAnswer()
        if self.roles.role(agent_id) != AgentRole.MAIN:
            return ReaderRequestAnswer(tuple(self.request_text.line(request) for request in self.writers.agent_requests(Actor(agent_id, ActorType.AGENT))))
        current_time = self.clock.timestamp()
        waiting = tuple(request for request in self.requests.open_rows()
                        if (self.attempts.requires_help(request) or request.expires_at <= current_time)
                        if not self.notices.has_recent_notice(agent_id, request.id, current_time))
        block_plans = tuple(self.reader_help_block(request) for request in waiting)
        if event.event is HookEventName.TICK:
            return ReaderRequestAnswer((), block_plans, tuple(SendReaderRequestNotice(agent_id, request.id) for request in waiting))
        return ReaderRequestAnswer(tuple(self.request_text.line(request) for request in waiting), block_plans)

    # the hold that asks the main agent to help with a request whose saves failed or that expired
    @staticmethod
    def reader_help_block(request: ReaderRequest) -> ReaderHelpBlock:
        refusal = ReaderRequestRefusalMessage.declared().agent_message(request=request.id, command=request.command, block="{block}")
        return ReaderHelpBlock(ReaderBlockKeys.keyed(refusal, request.id), ReaderRequestCompleted(request.id), request.command)

    @staticmethod
    def help_block(agent_id: int, block_plan: ReaderHelpBlock) -> BlockAgent:
        return BlockAgent(agent_id, block_plan.agent_message, block_plan.condition, after=Interval(READER_REQUEST_SPAN), countdown=READER_REQUEST_COUNTDOWN.agent_message("{left}", command=block_plan.command))
