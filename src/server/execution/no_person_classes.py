from engine.execution.classes.person_classes import PersonClasses


class NoPersonClasses(PersonClasses):
    """The instant lane takes the built-in classes only: a person's class names a shell line or a plugin."""

    def classes(self) -> tuple:
        return ()
