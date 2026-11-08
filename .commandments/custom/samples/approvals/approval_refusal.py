from core.base.user_approval_refusal import UserApprovalRefusal


def refused_without_command():
    # @sin architecture_approvals_approval_without_its_command
    raise UserApprovalRefusal("Run it?")


def refused_with_command(resume):
    # @righteous architecture_approvals_approval_without_its_command
    raise UserApprovalRefusal("Run it?", command=resume)


def refused_with_words(identifier):
    # @righteous architecture_approvals_approval_without_its_command
    raise UserApprovalRefusal("Run it?", ("agent", "resume", identifier))


def refused_for_a_read():
    # @righteous architecture_approvals_approval_without_its_command
    raise UserApprovalRefusal("Show it?", returns_output=True)
