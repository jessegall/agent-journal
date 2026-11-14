from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.phase_test_deferral import PhaseTestDeferral


class PhaseTestDeferralModelDeclaration(ModelDeclaration):
    """How the module declares PhaseTestDeferral."""

    model = PhaseTestDeferral
    excluded_subcommands = ["make", "edit", "delete"]
