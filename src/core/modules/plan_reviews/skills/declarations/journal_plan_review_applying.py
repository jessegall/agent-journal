from engine.skill.skill_declaration import SkillDeclaration


class JournalPlanReviewApplying(SkillDeclaration):
    """The skill journal-plan-review-applying: work a critique of a plan into the plan, which is a light job."""

    folder = "journal-plan-review-applying"
    description = "Work a critique of a plan into the plan, which is a light job; read it before you work a report of reviews into a plan or end its review"
    keywords = ("review", "critique")
    commands = tuple(["plan reviewed"])
