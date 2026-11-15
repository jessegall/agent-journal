from core.modules.drivers.support.compared_answer import ComparedAnswer

MONITOR_TEXT = "a sample refusal both drivers give"


def test_two_answers_agree_when_the_program_is_told_the_same_whichever_key_decided():
    old = ComparedAnswer(f"refuse: {MONITOR_TEXT}", "drivers.block-stop")
    new = ComparedAnswer(f"refuse: {MONITOR_TEXT}", "processes.monitor_required.543472")
    assert old.agrees(new) and not old.agrees(ComparedAnswer("allow"))
    assert old.text == f"refuse: {MONITOR_TEXT} (drivers.block-stop)"
