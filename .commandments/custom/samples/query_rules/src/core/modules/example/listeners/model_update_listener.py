from core.base.change.changed import Changed
from core.base.listener.commit_listener import CommitListener
from core.base.model.model import Model


# @sin architecture_listeners_every_model
class ModelUpdateListener(CommitListener[Changed[Model]]):
    pass
