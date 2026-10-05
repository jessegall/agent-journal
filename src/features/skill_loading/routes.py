from dataclasses import dataclass
from engine.fields import Loaded
from features.routing import Reply, Request, handles
from features.skill_loading.catalogue import SKILL, always, catalogue, set_keywords, skills
from features.skill_loading.required import load_now


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
    return Reply(200, skills(req.record(), req.query_as(SkillsQuery).agent))


@handles("GET", "/api/{env}/skills/{name}")
def get_skill(req: Request) -> Reply:
    root = req.record().root.parent
    hit = next((s for s in catalogue(root) if s[SKILL.name] == req.params["name"]), None)
    if not hit:
        return Reply(404, {"error": f"no skill {req.params['name']}"})
    return Reply(200, {**hit, "text": (root / hit[SKILL.path]).read_text(errors="replace")})


@handles("POST", "/api/{env}/skills/{name}/load")
def post_skill_load(req: Request) -> Reply:
    return Reply(200, {"notice": load_now(req.record(), req.params["name"])})


@handles("POST", "/api/{env}/skills/{name}/always")
def post_skill_always(req: Request) -> Reply:
    record = req.record()
    return Reply(200, {"skills": always(record, req.params["name"], bool(req.body.get("on")))})


@handles("POST", "/api/{env}/skills/{name}/keywords")
def post_skill_keywords(req: Request) -> Reply:
    words = req.body_as(Keywords).words
    return Reply(200, {"keywords": set_keywords(req.record(), req.params["name"], [w.strip() for w in words if w.strip()])})
