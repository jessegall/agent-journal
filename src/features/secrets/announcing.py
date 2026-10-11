from features.secrets.resource import Kind, Secret
from resources.base import SYSTEM


def updated_added(numbers: list[int], record, **_) -> str:
    """What follows 'secret N updated' in the line an agent is sent, so an agent that waited on it knows it can go on."""
    from features.secrets.controller import Secrets
    secrets = Secrets(record, actor=SYSTEM)
    changed = [secrets.rows.peek(n) for n in numbers if secrets.rows.exists(n)]
    return "; ".join(said(secret) for secret in changed)


def said(secret: Secret) -> str:
    """What one changed secret means for the agent: a saved browser login is only in its browser tools from their next start, which nothing else tells it."""
    if secret.kind == Kind.BROWSER_LOGIN and secret.session:
        return (f'the login to "{secret.title}" is saved: start your browser tools again before you use them, '
                f'or they go on with the session they opened with and land on the sign-in page')
    return f'the user changed secret "{secret.title}": it may now run {", ".join(secret.programs) or "no program"}, so work that waited on it can go on'
