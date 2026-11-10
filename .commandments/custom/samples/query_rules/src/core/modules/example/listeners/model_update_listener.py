from engine.change.changed import Changed
from engine.listener.commit_listener import CommitListener
from engine.model.model import Model


# @sin architecture_listeners_every_model
class ModelUpdateListener(CommitListener[Changed[Model]]):
    pass
