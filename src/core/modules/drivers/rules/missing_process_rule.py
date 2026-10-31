from core.base.caller.process_table import ProcessTable
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.commands.end_agent import EndAgent
from core.modules.agents.models.agent import Agent


class MissingProcessRule(DriverRule):
    """A tick ends each open agent of the environment whose recorded process is gone; one never seen stays."""

    name = "drivers.end_commands-process"
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, queries: Queries, processes: ProcessTable) -> None:
        self.queries, self.processes = queries, processes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        agents = self.queries.query(Agent).filter(environment_id=hook.environment_id).matching(IsNull("ended_at")).all_rows()
        recorded = [agent for agent in agents if agent.pid is not None and agent.process_started_at is not None]
        if not recorded:
            return RuleAnswer.allowed()
        process_keys = {(row.pid, int(row.started_at.value.timestamp())) for row in self.processes.rows()}
        end_commands = [EndAgent(agent.id) for agent in recorded if agent.process_started_at is not None
                and (agent.pid, int(agent.process_started_at.value.timestamp())) not in process_keys]
        return RuleAnswer.allowed().running(*end_commands) if end_commands else RuleAnswer.allowed()
