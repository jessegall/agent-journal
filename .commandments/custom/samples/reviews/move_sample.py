class SampleHandler:
    def handle(self, review, context):
        # @sin architecture_reviews_ReviewMovedByCommandDetector
        return review.moved("approve")
