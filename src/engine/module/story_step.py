from typing import ClassVar

from engine.container.container import Container


class StoryStep:
    """A step a module offers the stories of its behaviour, named in their words, for a part of the world a story
    cannot make through a command, such as a run printing its output; a story asks for it by name."""

    name: ClassVar[str]

    def run(self, container: Container, *arguments: object) -> object:
        raise NotImplementedError
