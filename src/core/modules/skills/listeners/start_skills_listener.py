from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.skills.support.main_agent_skills import MainAgentSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills
from core.modules.drivers.events.session_started import SessionStarted



class StartSkillsListener(SkillListener[SessionStarted]):
    """Requires startup skills for the prompt recipients declared by the suite."""

    name = "skills.start"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, catalogue: SkillCatalogue, start: StartSkills, suites: SuiteChoice, main_skills: MainAgentSkills, agents: AgentRows) -> None:
        super().__init__(bus, actors, queries, catalogue, suites, agents)
        self.start, self.main_skills = start, main_skills

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if self.agents.find(call.session_agent_id).role not in self.suites.agent_policy().prompt_roles:
            return
        if call.is_resumed:
            return
        for skill in self.skills(call):
            self.run(logged, RequireSkill(call.session_agent_id, skill))

    def skills(self, call: HookCall) -> list[str]:
        start = self.start.after_compaction() if self.compacted(call) else self.start.session_start()
        is_main = self.agents.find(call.session_agent_id).role == AgentRole.MAIN
        return [*start, *self.start.main_agent()] if is_main and self.main_skills.is_required else start

    def compacted(self, call: HookCall) -> bool:
        recent = self.queries.query(HookCall).filter(session_agent_id=call.session_agent_id).newest().limited(2)
        return len(recent) == 2 and recent[1].is_compaction
