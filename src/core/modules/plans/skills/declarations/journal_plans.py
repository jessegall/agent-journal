from engine.skill.skill_declaration import SkillDeclaration


class JournalPlans(SkillDeclaration):
    """The skill journal-plans: build and follow a plan of ordered tasks."""

    folder = "journal-plans"
    description = "Build and follow a plan of ordered tasks; read it before the first plan command of a session, or when the user asks for a plan or a roadmap"
    keywords = ("plan", "plans", "roadmap", "phases")
    commands = ("plan", "phase")
