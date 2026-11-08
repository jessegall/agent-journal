from core.base.user_approval_refusal import UserApprovalRefusal


def refused_without_command():
    # @sin architecture_approvals_approval_without_its_command
    raise UserApprovalRefusal("Run it?")


def refused_with_command(resume):
    # @righteous architecture_approvals_approval_without_its_command
    raise UserApprovalRefusal("Run it?", command=resume)
