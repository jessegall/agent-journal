PROOF = "proof"
HANDOVER = "handover"
SERVING = "serving"
FINISHED = "finished"
FAILED = "failed"


class UpdateSteps:
    """The steps of a code update, from the new code's proof to the end; this one shows them nowhere."""

    def record(self, step: str, detail: str = "") -> None:
        return
