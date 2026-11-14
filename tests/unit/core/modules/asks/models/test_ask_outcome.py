from core.modules.asks.models.enums.ask_outcome import AskOutcome


def test_each_outcome_gives_its_line_to_the_asker():
    assert AskOutcome.ANSWERED.asker_line("overseer", "run worker_status.py") == "The overseer answers your question: run worker_status.py"
    assert AskOutcome.FIXED.asker_line("overseer", "the reader is saved") == "The overseer settled what you asked about: the reader is saved"
    assert AskOutcome.PARENT.asker_line("main agent", "needs a merge") == "Your question went to the main agent: needs a merge"
    assert AskOutcome.MOOT.asker_line("12", "the task was cancelled") == "Your question 12 is closed: the task was cancelled"
