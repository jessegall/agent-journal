from dataclasses import dataclass


@dataclass(frozen=True)
class SetupAnswers:
    """What the setup asks the person setting up a team server: the admin's name, email and password typed twice."""

    name: str
    email: str
    password: str
    password_repeat: str
