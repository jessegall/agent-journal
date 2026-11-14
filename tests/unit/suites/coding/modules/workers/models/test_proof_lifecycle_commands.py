import re
from enum import StrEnum

import pytest

from engine.model.lifecycle import Lifecycle, next_moves_text
from engine.model.move import Move
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.workers_module import WorkersModule

COMMAND_WORD = re.compile(r"journal proof (\w+) 1")


def typed_verbs() -> set[str]:
    """The words a user can type after journal proof: the commands the module writes itself and the move commands the journal builds."""
    declaration = next(declaration for declaration in WorkersModule.model_declarations() if declaration.model is Proof)
    built = {move.name for move in ProofLifecycle.moves()} - set(declaration.excluded_subcommands)
    saved = {subcommand.name for subcommand in WorkersModule.subcommands if getattr(subcommand, "cli_name", "") == "proof"}
    return built | saved


@pytest.mark.parametrize("state", list(ProofState), ids=[state.value for state in ProofState])
def test_a_refusal_of_a_proof_names_only_commands_that_exist(state):
    labelled = set(COMMAND_WORD.findall(next_moves_text(ProofLifecycle.moves(), "proof", 1, state)))
    assert labelled <= typed_verbs(), f"from {state.value} the refusal names {sorted(labelled - typed_verbs())}, which are no proof commands"


def test_a_state_that_only_the_journals_own_work_leaves_says_so_instead_of_naming_a_command():
    class StepState(StrEnum):
        FIRST = "first"
        SECOND = "second"

    class StepLifecycle(Lifecycle):
        states = StepState
        initial = [StepState.FIRST]
        editable = ()
        deletable = ()

        advance = Move("advance", [StepState.FIRST], StepState.SECOND, has_command=False)

    assert next_moves_text(StepLifecycle.moves(), "step", 7, StepState.FIRST) == "from first it moves only through the journal's own work, no command moves it"
    assert next_moves_text(StepLifecycle.moves(), "step", 7, StepState.SECOND) == "second is final"
