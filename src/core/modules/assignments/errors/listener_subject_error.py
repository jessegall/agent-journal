class ListenerSubjectError(TypeError):
    """A listener of assignments was declared without the model whose rows it hears about."""

    def __init__(self, listener_name: str) -> None:
        super().__init__(f"{listener_name} names no subject: set subject to the assignable model it hears about")
