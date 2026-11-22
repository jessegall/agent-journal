<?php

declare(strict_types=1);

namespace App\Commands\ApproveRuleProposal;

use App\Contracts\CommandHandler;
use App\Models\RuleProposal;
use App\Support\ActorIdentity;
use App\Support\ProjectKey;
use App\Support\RuleApprovals;
use App\Values\ApprovalReceipt;

final readonly class ApproveRuleProposalHandler implements CommandHandler
{
    public function __construct(
        private RuleApprovals $approvals,
        private ProjectKey $projects,
    ) {}

    public function handle(ApproveRuleProposalCommand $command): ApprovalReceipt
    {
        $proposal = RuleProposal::query()
            ->ofProject($this->projects->current())
            ->whereKey($command->proposalId)
            ->lockForUpdate()
            ->sole();

        return $this->approvals->approve($proposal, $command->approval, ActorIdentity::of($command->dispatchedBy()));
    }
}
