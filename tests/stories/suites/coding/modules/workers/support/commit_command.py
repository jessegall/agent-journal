from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType

COMMIT_COMMAND = "worker commit"
COMMIT = f"{COMMIT_COMMAND} --wait --differences none"
MERGE_REQUEST = 'worker ask-merge "the committed work of the unit"'


def request_merge(story, worker) -> None:
    """The worker asks for the merge of its unit, as a worker of several tasks must; a unit of one asks by its
    commit, so its refusal is passed over."""
    story.run(MERGE_REQUEST, actor=Actor(worker.id, ActorType.AGENT))
