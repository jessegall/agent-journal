from core.base.viewer.model_searcher import ModelSearcher
from core.modules.phone.models.phone import Phone


class PhoneSearcher(ModelSearcher):
    """Finds the phones whose name holds the words."""

    model = Phone
