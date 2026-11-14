from engine.skill.skill_declaration import SkillDeclaration


class JournalFlowcharts(SkillDeclaration):
    """The skill journal-flowcharts: draw a flowchart in the chat and know when one fits."""

    folder = "journal-flowcharts"
    description = "Draw a flowchart in the chat and know when one fits; read it when the user asks for a flowchart or a diagram, or a process with branches is easier to see than to read"
    keywords = ("flowchart", "flow chart", "diagram")
