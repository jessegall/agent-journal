import ast
import inspect
import textwrap
from pathlib import Path
from typing import ClassVar

from engine.file.file_access import FileAccess
from engine.testing.stories.story import Story

SEVERAL_ENVIRONMENTS = ""


class StoryFixture:
    """A named starting state for stories: the fixture it builds on, the steps that make its state, and what
    that state must be; it is built once per run and copied for every story that starts from it. Its source
    is read when the class is defined, so a file changed during a run does not ask for another template. The
    environment it names is the one a user's line of a story on it runs in, unless the line names another;
    a fixture with several environments names SEVERAL_ENVIRONMENTS, and each line names its own."""

    parent: ClassVar[type["StoryFixture"] | None] = None
    environment: ClassVar[str | None] = None
    source_text: ClassVar[str] = ""

    def __init_subclass__(cls, **options: object) -> None:
        super().__init_subclass__(**options)
        source = inspect.getsourcefile(cls)
        cls.source_text = FileAccess.read(Path(source)) if source else ""

    def steps(self, story: Story) -> None:
        raise NotImplementedError(f"{type(self).__name__} has no steps")

    def expect(self, story: Story) -> None:
        return None

    @classmethod
    def has_steps(cls) -> bool:
        if "steps" not in cls.__dict__:
            return False
        function = ast.parse(textwrap.dedent(inspect.getsource(cls.steps))).body[0]
        if not isinstance(function, ast.FunctionDef):
            return False
        story_name = function.args.args[1].arg
        return any(isinstance(node, ast.Name) and node.id == story_name for statement in function.body for node in ast.walk(statement))

    @classmethod
    def line_environment(cls) -> str | None:
        return next((fixture.environment for fixture in reversed(cls.chain()) if fixture.environment is not None), SEVERAL_ENVIRONMENTS) or None

    @classmethod
    def chain(cls) -> tuple[type["StoryFixture"], ...]:
        return (*(cls.parent.chain() if cls.parent else ()), cls)

    @classmethod
    def declared(cls) -> tuple[type["StoryFixture"], ...]:
        return tuple(fixture for child in cls.__subclasses__() for fixture in (child, *child.declared()))
