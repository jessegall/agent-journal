from types import SimpleNamespace

from core.modules.helpers.commands.change_agent_driver.change_agent_driver_subcommand import ChangeAgentDriverSubcommand

AGENT = SimpleNamespace(id=7, number=4, role="helper", program="codex", program_model="gpt-6.1-sol")
OUT = SimpleNamespace(is_ready=False, wait_line="out until 10:30, it hit a rate limit")
READY = SimpleNamespace(is_ready=True, wait_line="")


def answer(program_state: SimpleNamespace) -> list[str]:
    return ChangeAgentDriverSubcommand(SimpleNamespace(outage_state=lambda program: program_state)).answer(AGENT).splitlines()


def test_a_change_to_a_program_that_is_ready_only_names_the_new_program_and_model():
    assert answer(READY) == ["helper 4 runs on codex gpt-6.1-sol from its next session"]


def test_a_change_to_a_program_that_is_out_also_says_until_when_and_that_the_agent_waits_on_it():
    assert answer(OUT) == ["helper 4 runs on codex gpt-6.1-sol from its next session", "codex is out: out until 10:30, it hit a rate limit; helper 4 waits on it"]
