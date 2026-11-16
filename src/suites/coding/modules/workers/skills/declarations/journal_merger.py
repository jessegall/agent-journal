from engine.skill.skill_declaration import SkillDeclaration


class JournalMerger(SkillDeclaration):
    """The skill journal-merger: follow the merger's case book of what to check and do for each known case,
    and the ladder before asking the main agent."""

    folder = "journal-merger"
    description = "Follow the merger's case book of what to check and do for each known case, and the ladder before asking the main agent; read it when you merge or judge a worker's work"
    keywords = ("merger",)
    commands = ("merger",)
