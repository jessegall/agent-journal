from engine.skill.skill_declaration import SkillDeclaration


class JournalWorkModes(SkillDeclaration):
    """The skill journal-work-modes: work as the main agent of the coding suite from its work controls."""

    folder = "journal-work-modes"
    description = "Work as the main agent of the coding suite from its work controls; read it when auto mode, the presets, read-only helpers or the worker limit come up"
    keywords = ("builder", "orchestrator", "auto mode", "work mode")
    types = ["main"]
