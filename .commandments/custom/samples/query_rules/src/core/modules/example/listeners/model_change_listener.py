from engine.change.touched import Touched
from core.base.listener.commit_listener import CommitListener
from core.base.model.model import Model


# @sin architecture_listeners_every_model
class ModelChangeListener(CommitListener[Touched[Model]]):
    pass
