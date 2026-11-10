from engine.listener.commit_listener import CommitListener


class SampleHandler:
    def handle(self, command, context):
        # @sin architecture_reviews_review_step_made_outside_a_listener
        self.bus.run(MakeReviewStep(1, "words"), context.actor)


class SampleListener(CommitListener):
    def handle(self, event):
        self.bus.run(MakeReviewStep(1, "words"), self.actor)
