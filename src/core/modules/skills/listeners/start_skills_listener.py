from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.record_hook_call.record_hook_call_handler import DRIVERS_MODULE
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.skills.support.main_agent_skills import MainAgentSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills
from core.base.change.created import Created



class StartSkillsListener(SkillListener[Created[HookCall]]):
    """Requires startup skills for the prompt recipients declared by the suite."""

    name = "skills.start"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, catalogue: SkillCatalogue, start: StartSkills, suites: SuiteChoice, main_skills: MainAgentSkills) -> None:
        super().__init__(bus, actors, queries, catalogue, suites)
        self.start, self.main_skills = start, main_skills

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        call = self.call(logged)
        if not call.is_session_start or self.queries.query(Agent).find(call.agent_id).role not in self.suites.agent_policy(call.environment_id).prompt_roles:
            return
        if call.metadata.module_part(DRIVERS_MODULE).get("resumed"):
            return
        for skill in self.skills(call):
            self.run(logged, RequireSkill(call.agent_id, skill))

    def skills(self, call: HookCall) -> list[str]:
        start = self.start.after_compaction(call.environment_id) if self.compacted(call) else self.start.session_start(call.environment_id)
        is_main = self.queries.query(Agent).find(call.agent_id).role == AgentRole.MAIN
        return [*start, *self.start.main_agent(call.environment_id)] if is_main and self.main_skills.is_required else start

    def compacted(self, call: HookCall) -> bool:
        recent = self.queries.query(HookCall).filter(agent_id=call.agent_id).newest().page(1, 2).rows
        return len(recent) == 2 and recent[1].is_compaction
