from resources.base import SYSTEM


def updated_added(numbers: list[int], record, **_) -> str:
    """What follows 'secret N updated' in the line an agent is sent: who changed it and what it may now do, so an agent that waited on it knows it can go on."""
    from features.secrets.controller import Secrets
    secrets = Secrets(record, actor=SYSTEM)
    changed = [secrets.rows.peek(n) for n in numbers if secrets.rows.exists(n)]
    return "; ".join(f'the user changed secret "{secret.title}": it may now run {", ".join(secret.programs) or "no program"}, so work that waited on it can go on' for secret in changed)
