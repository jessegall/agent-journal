class SampleHandler:
    def handle(self, review, context):
        # @sin architecture_reviews_review_moved_outside_its_model
        return review.moved("approve")
