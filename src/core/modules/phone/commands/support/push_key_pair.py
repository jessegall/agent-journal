from dataclasses import dataclass


@dataclass(frozen=True)
class PushKeyPair:
    """The journal's push keys as text: the secret it signs with and the public key a phone subscribes with."""

    secret: str
    public: str
