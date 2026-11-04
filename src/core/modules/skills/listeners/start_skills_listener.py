from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.record_hook_call.record_hook_call_handler import DRIVERS_MODULE
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills



class StartSkillsListener(SkillListener):
    """Requires startup skills for the prompt recipients declared by the suite."""

    name = "skills.start"
    event = "hook_call.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, catalogue: SkillCatalogue, start: StartSkills, suites: SuiteChoice) -> None:
        super().__init__(bus, actors, queries, catalogue, suites)
        self.start = start

    def handle(self, event: LoggedEvent) -> None:
        call = self.call(event)
        if not call.is_session_start or self.queries.query(Agent).find(call.agent_id).role not in self.suites.agent_policy(call.environment_id).prompt_roles:
            return
        if call.metadata.module_part(DRIVERS_MODULE).get("resumed"):
            return
        for skill in self.skills(call):
            self.run(event, RequireSkill(call.agent_id, skill))

    def skills(self, call: HookCall) -> list[str]:
        if self.compacted(call):
            return self.start.after_compaction(call.environment_id)
        return self.start.session_start(call.environment_id)

    def compacted(self, call: HookCall) -> bool:
        recent = self.queries.query(HookCall).filter(agent_id=call.agent_id).newest().page(1, 2).rows
        return len(recent) == 2 and recent[1].is_compaction
