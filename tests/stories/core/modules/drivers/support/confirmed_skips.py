from engine.actor.actor import Actor

TRIED = "read the refusal and found it does not fit this case"


def confirmed_skip(story, rule: str, actor: Actor, reason: str = "it is wrong here") -> int:
    skip_id = story.new_row_id(f'refusal skip {rule} --reason "{reason}" --environment main', actor=actor)
    story.expect_success(f'refusal confirm {skip_id} --tried "{TRIED}" --environment main', actor=actor)
    return skip_id
