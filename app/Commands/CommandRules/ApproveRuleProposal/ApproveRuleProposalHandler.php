<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ApproveRuleProposal;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\RuleProposal;
use App\Support\RuleApprovals;
use App\Values\ApprovalReceipt;

final readonly class ApproveRuleProposalHandler implements CommandHandler
{
    public function __construct(private RuleApprovals $approvals) {}

    public function handle(ApproveRuleProposalCommand $command): ApprovalReceipt
    {
        $proposal = RuleProposal::query()
            ->whereKey($command->proposalId)
            ->lockForUpdate()
            ->sole();

        return $this->approvals->approve($proposal, $command->approval, $command->dispatchedBy());
    }
}
