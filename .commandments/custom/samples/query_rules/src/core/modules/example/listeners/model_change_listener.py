from engine.event.touched import Touched
from engine.listener.commit_listener import CommitListener
from engine.model.model import Model


# @sin architecture_listeners_every_model
class ModelChangeListener(CommitListener[Touched[Model]]):
    pass
