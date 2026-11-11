from core.modules.processes.models.enums.notice_kind import NoticeKind


class NoticeWithoutDeclarationError(ValueError):
    @classmethod
    def of(cls, kind: NoticeKind) -> "NoticeWithoutDeclarationError":
        return cls(f"no cadence notice is declared for {kind.value}")
