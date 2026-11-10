from engine.model.model import Model


class Positioned(Model):
    """A model whose rows have numbered places within a parent."""

    position: int
