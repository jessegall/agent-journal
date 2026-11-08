class InstructionImportQuestion:
    """The words of the approval card that offers to remove an import line."""

    @staticmethod
    def text(file: str, imported: str) -> str:
        return f"{file} puts {imported} into every context more than once. Remove the extra import line?"
