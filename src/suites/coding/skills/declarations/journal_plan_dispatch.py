from engine.skill.skill_declaration import SkillDeclaration


class JournalPlanDispatch(SkillDeclaration):
    """The skill journal-plan-dispatch: send a functional designer and then a planner to make the plan."""

    folder = "journal-plan-dispatch"
    description = "Send a functional designer and then a planner to make the plan; read it when the user asks for a plan"
    keywords = ("plan", "roadmap")
    types = ["main"]
