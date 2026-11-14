from engine.skill.skill_declaration import SkillDeclaration


class JournalSequences(SkillDeclaration):
    """The skill journal-sequences: follow a sequence of steps one at a time."""

    folder = "journal-sequences"
    description = "Follow a sequence of steps one at a time; read it when a sequence is run or written"
    keywords = ("sequence", "sequences")
    commands = ["sequence"]
