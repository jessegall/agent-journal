from dataclasses import replace

from engine.driver.agent_hook import AgentHook
from engine.driver.hook_event import HookEvent
from engine.driver.state_board import StateBoard
from engine.driver.state_boards import StateBoards
from engine.enums.hook_event_name import HookEventName
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.actor_loader import ActorLoader


class AgentBoards:
    """Makes the state board of an agent outside a hook: the board a tool call of the agent at the given time would
    find, so an opener that needs a field no such call has raises and counts as open."""

    def __init__(self, boards: StateBoards, loader: ActorLoader) -> None:
        self.boards, self.loader = boards, loader

    def for_agent(self, agent: Agent, current_time: Timestamp) -> StateBoard:
        tick = HookEvent.tick(agent.program, agent.session, "", 0, str(agent.id), "")
        return self.boards.for_hook(AgentHook.of_actor(replace(tick, event=HookEventName.PRE_TOOL_USE), self.loader.loaded(agent), current_time))
