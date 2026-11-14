from engine.skill.skill_declaration import SkillDeclaration


class JournalDispatchingWorkers(SkillDeclaration):
    """The skill journal-dispatching-workers: send a worker to write a bounded job, check its proofs and merge its work."""

    folder = "journal-dispatching-workers"
    description = "Send a worker to write a bounded job, check its proofs and merge its work; read it before dispatching one"
    keywords = ("dispatch", "workers", "merge")
    commands = ("worker", "proof")
    types = tuple(["main"])
