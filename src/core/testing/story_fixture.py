from typing import ClassVar

from core.testing.story import Story


class StoryFixture:
    """A named starting state for stories: the fixture it builds on, the steps that make its state, and what that
    state must be; it is built once per run and copied for every story that starts from it."""

    parent: ClassVar[type["StoryFixture"] | None] = None

    def steps(self, story: Story) -> None:
        raise NotImplementedError(f"{type(self).__name__} has no steps")

    def expect(self, story: Story) -> None:
        return None

    @classmethod
    def chain(cls) -> tuple[type["StoryFixture"], ...]:
        return (*(cls.parent.chain() if cls.parent else ()), cls)

    @classmethod
    def declared(cls) -> tuple[type["StoryFixture"], ...]:
        return tuple(fixture for child in cls.__subclasses__() for fixture in (child, *child.declared()))
