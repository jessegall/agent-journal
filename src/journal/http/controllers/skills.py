from journal.features.registry import Registry
from journal.support.skill_files import SkillFiles
from journal.http.support.request import Request
from journal.support.response import Response
from journal.repositories.agents import Agents
from journal.support.scope import Scope
from journal.supervisor_link import SupervisorLink


class SkillController:
    """The journal's skills, with whether the agent asked about has read each; one opened whole, and one the live agent is told to read now."""

    def __init__(self, registry: Registry, agents: Agents, skill_files: SkillFiles, supervisor: SupervisorLink, scope: Scope) -> None:
        self.registry, self.agents, self.skill_files, self.supervisor, self.scope = registry, agents, skill_files, supervisor, scope

    def index(self, request: Request) -> Response:
        agent = next((item for item in self.agents.all_agents() if str(item.id) == request.query.get("agent", "")), None)
        loaded = set(agent.skills_loaded.keys()) if agent else set()
        return Response.json([{"name": skill.name, "description": skill.description, "loaded": skill.name in loaded} for skill in self.registry.skills()])

    def show(self, request: Request) -> Response:
        skill = self.registry.skill(request.params["name"])
        return Response.json({"name": skill.name, "description": skill.description, "text": skill.body}) if skill else Response.absent("no such skill")

    def load(self, request: Request) -> Response:
        skill = self.registry.skill(request.params["name"])
        if skill is None:
            return Response.absent("no such skill")
        self.supervisor.type(self.scope.id, f"read the {skill.name} skill now: {self.skill_files.path(skill)}")
        return Response.json({"queued": True})
