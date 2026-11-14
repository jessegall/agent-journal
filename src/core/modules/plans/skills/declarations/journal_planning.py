from engine.skill.skill_declaration import SkillDeclaration


class JournalPlanning(SkillDeclaration):
    """The skill journal-planning: build a thorough plan with real steps in each phase, one task per step,
    and a brief that can be carried out alone."""

    folder = "journal-planning"
    description = "Build a thorough plan with real steps in each phase, one task per step, and a brief that can be carried out alone; read it before you make a plan or a phase"
    keywords = ("plan", "phases")
    commands = ("plan make", "phase make")
