from features.parts import Command, Context
from features.skill_loading.catalogue import SKILL, catalogue, set_keywords, skills
from features.skill_loading.required import load_now
from resources.base import Missing


class ShowSkills(Command):
    name = "skills"

    def run(self, context: Context, agents, agent: int = 0):
        return skills(agents.record, agent)


class ShowSkill(Command):
    name = "skill"

    def run(self, context: Context, agents, skill: str):
        root = agents.record.root.parent
        hit = next((s for s in catalogue(root) if s[SKILL.name] == skill), None)
        if not hit:
            raise Missing(f"no skill {skill}")
        return {**hit, "text": (root / hit[SKILL.path]).read_text(errors="replace")}


class LoadSkill(Command):
    name = "load_skill"
    user_only = True

    def run(self, context: Context, agents, skill: str):
        return {"notice": load_now(agents.record, skill)}


class SetKeywords(Command):
    name = "keywords"
    user_only = True

    def run(self, context: Context, agents, skill: str, keywords: list):
        return {"keywords": set_keywords(agents.record, skill, [w.strip() for w in keywords if w.strip()])}
