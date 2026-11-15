from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.admission_receipt import AdmissionReceipt


class AdmissionReceiptModelDeclaration(ModelDeclaration):
    """How the module declares AdmissionReceipt."""

    model = AdmissionReceipt
    excluded_subcommands = ["make", "edit", "delete"]
