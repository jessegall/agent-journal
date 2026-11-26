<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ApproveRuleProposal;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\RuleApprovals;
use App\CommandRules\Values\ApprovalReceipt;
use App\Models\CommandRules\RuleProposal;

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
