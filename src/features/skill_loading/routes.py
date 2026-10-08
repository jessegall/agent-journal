from dataclasses import dataclass
from controllers.invoke import invoked
from controllers.types import Agents
from resources.fields import Loaded
from features.routing import Reply, Request, handles
from features.skill_loading.catalogue import always


@dataclass(frozen=True)
class SkillsQuery(Loaded):
    agent: int = 0


@dataclass(frozen=True)
class Keywords(Loaded):
    keywords: object = None

    @property
    def words(self) -> list:
        if isinstance(self.keywords, list):
            return self.keywords
        return str(self.keywords).split(",") if self.keywords else []


@handles("GET", "/api/{env}/skills")
def get_skills(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "skills", named={"agent": req.query_as(SkillsQuery).agent}))


@handles("GET", "/api/{env}/skills/{name}")
def get_skill(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "skill", named={"skill": req.params["name"]}))


@handles("POST", "/api/{env}/skills/{name}/load")
def post_skill_load(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "load_skill", named={"skill": req.params["name"]}))


@handles("POST", "/api/{env}/skills/{name}/always")
def post_skill_always(req: Request) -> Reply:
    record = req.record()
    return Reply(200, {"skills": always(record, req.params["name"], bool(req.body.get("on")))})


@handles("POST", "/api/{env}/skills/{name}/keywords")
def post_skill_keywords(req: Request) -> Reply:
    return Reply(200, invoked(req.as_user(Agents), "keywords", named={"skill": req.params["name"], "keywords": req.body_as(Keywords).words}))
