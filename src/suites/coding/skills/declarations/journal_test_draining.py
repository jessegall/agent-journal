from engine.skill.skill_declaration import SkillDeclaration


class JournalTestDraining(SkillDeclaration):
    """The skill journal-test-draining: work off the failed tests of a full run from one file, biggest cause first, with no full rerun until it is empty."""

    folder = "journal-test-draining"
    description = "Work off the failed tests of a full run from one file, biggest cause first, with no full rerun until it is empty; read it when a full run has failures"
    keywords = ("failed tests", "full run")
