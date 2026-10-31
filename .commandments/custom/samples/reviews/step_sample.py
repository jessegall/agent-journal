from core.base.listener.commit_listener import CommitListener


class SampleHandler:
    def handle(self, command, context):
        # @sin architecture_reviews_StepsOnlyFromListenersDetector
        self.bus.run(MakeReviewStep(1, "words"), context.actor)


class SampleListener(CommitListener):
    def handle(self, event):
        self.bus.run(MakeReviewStep(1, "words"), self.actor)
