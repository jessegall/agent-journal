from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.helpers.commands.change_agent_driver.change_agent_driver import ChangeAgentDriver
from core.modules.helpers.support.agent_admission import AgentAdmission
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.program_change_access import ProgramChangeAccess


class ChangeAgentDriverHandler(Handler[ChangeAgentDriver, Agent]):
    """Gives a stopped agent a new session on the program and model named, when its profile allows the model.
    The session it had is closed in its history as a driver change; its number, memories, tasks, checkout and
    limits stay, and its next job or launch starts the new program."""

    command = ChangeAgentDriver

    def __init__(self, rows: EventRows, bus: Bus, admission: AgentAdmission, access: ProgramChangeAccess, limits: HelperLimits) -> None:
        self.rows, self.bus, self.admission, self.access, self.limits = rows, bus, admission, access, limits

    def prepare(self, command: ChangeAgentDriver, actor: Actor) -> None:
        agent = self.rows.required(Agent, command.agent_id)
        self.access.check_driver_change(actor, agent)
        self.check_agent(agent, command)

    def handle(self, command: ChangeAgentDriver, context: Context) -> Agent:
        agent = self.rows.required(Agent, command.agent_id)
        self.check_agent(agent, command)
        return self.bus.run_with_context(ReplaceAgentSession(agent.id, EndReason.DRIVER_CHANGED, command.program, command.program_model), context)

    def check_agent(self, agent: Agent, command: ChangeAgentDriver) -> None:
        label = AgentLabel.from_agent(agent).text
        if agent.retired_at is not None:
            raise Refusal(f"{label} is retired, for good")
        if agent.ended_at is None:
            raise Refusal(f"{label} is running", f"journal agent stop {agent.number}, then change its driver")
        self.limits.checked_model(command.program, command.program_model)
        self.admission.checked_model(agent.role, agent.profile, command.program, command.program_model)
