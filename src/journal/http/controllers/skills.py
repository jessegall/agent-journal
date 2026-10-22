from journal.features.registry import Registry
from journal.features.skills.support.skill_files import SkillFiles
from journal.http.support.request import Request
from journal.support.response import Response
from journal.repositories.agents import Agents
from journal.repositories.scope import Scope
from journal.supervisor_link import SupervisorLink
from journal.features.skills.feature import Skills
from journal.repositories.setting_rows import SettingRows

MOMENTS = {"session_start": Skills.START_SKILLS, "after_compaction": Skills.COMPACTION_SKILLS}


class SkillController:
    """The journal's skills, with whether the agent asked about has read each and whether each is owed at a session start and after a compaction; one opened whole, one the live agent is told to read now, and either moment switched for one."""

    def __init__(self, registry: Registry, agents: Agents, skill_files: SkillFiles, supervisor: SupervisorLink, scope: Scope, settings: SettingRows) -> None:
        self.registry, self.agents, self.skill_files, self.supervisor, self.scope, self.settings = registry, agents, skill_files, supervisor, scope, settings

    def index(self, request: Request) -> Response:
        agent = next(iter(self.agents.numbered(request.query.get("agent", ""))), None)
        loaded = set(agent.skills_loaded.keys()) if agent else set()
        starts, compactions = self.settings.texts(Skills.START_SKILLS), self.settings.texts(Skills.COMPACTION_SKILLS)
        return Response.json([{"name": skill.name, "description": skill.description, "loaded": skill.name in loaded, "session_start": skill.name in starts, "after_compaction": skill.name in compactions} for skill in self.registry.skills()])

    def moment(self, request: Request) -> Response:
        skill = self.registry.skill(request.params["name"])
        option = MOMENTS.get(request.body.get("moment", ""))
        if skill is None or option is None:
            return Response.absent("no such skill or moment")
        if request.body.get("on"):
            self.settings.with_line(option, skill.name, request.actor)
        else:
            self.settings.without_line(option, skill.name, request.actor)
        return Response.json({"name": skill.name, request.body["moment"]: bool(request.body.get("on"))})

    def show(self, request: Request) -> Response:
        skill = self.registry.skill(request.params["name"])
        return Response.json({"name": skill.name, "description": skill.description, "text": skill.body}) if skill else Response.absent("no such skill")

    def load(self, request: Request) -> Response:
        skill = self.registry.skill(request.params["name"])
        if skill is None:
            return Response.absent("no such skill")
        self.supervisor.type(self.scope.id, f"read the {skill.name} skill now: {self.skill_files.path(skill)}")
        return Response.json({"queued": True})
