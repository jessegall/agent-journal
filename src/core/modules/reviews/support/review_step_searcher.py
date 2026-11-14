from engine.viewer.model_searcher import ModelSearcher
from core.modules.reviews.models.review_step import ReviewStep


class ReviewStepSearcher(ModelSearcher):
    """Finds the review steps whose text holds the words."""

    model = ReviewStep
