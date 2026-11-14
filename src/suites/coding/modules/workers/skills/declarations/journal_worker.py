from engine.skill.skill_declaration import SkillDeclaration


class JournalWorker(SkillDeclaration):
    """The skill journal-worker: work your assigned tasks in your worktree, prove them, commit and ask for the merge."""

    folder = "journal-worker"
    description = "Work your assigned tasks in your worktree, prove them, commit and ask for the merge; read it when a worker session starts"
    keywords = ("worker", "worktree", "proof")
    commands = ("worker", "proof")
    types = tuple(["worker"])
