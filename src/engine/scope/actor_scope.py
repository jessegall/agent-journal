from engine.scope.scope import Scope


class ActorScope(Scope):
    """What an agent does stays that agent's: its marks and dock items are stored as its own, the lines it causes
    for others stay hidden, and what it reads is limited to its own rows."""
