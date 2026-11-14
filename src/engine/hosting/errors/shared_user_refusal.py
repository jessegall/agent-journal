from engine.errors.refusal import Refusal


class SharedUserRefusal(Refusal):
    """The agent user of the hosted file is the user the journal itself runs as."""

    @classmethod
    def same_user(cls, user: str) -> "SharedUserRefusal":
        return cls(f"the agent user {user} is the user the journal runs as", "name another user as agent_user in the hosted file")
