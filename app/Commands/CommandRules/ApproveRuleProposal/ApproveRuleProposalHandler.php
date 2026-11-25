<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ApproveRuleProposal;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\RuleProposal;
use App\Support\ActorReference;
use App\Support\RuleApprovals;
use App\Support\ServedEnvironment;
use App\Values\ApprovalReceipt;

final readonly class ApproveRuleProposalHandler implements CommandHandler
{
    public function __construct(
        private RuleApprovals $approvals,
        private ServedEnvironment $projects,
    ) {}

    public function handle(ApproveRuleProposalCommand $command): ApprovalReceipt
    {
        $proposal = RuleProposal::query()
            ->ofProject($this->projects->current())
            ->whereKey($command->proposalId)
            ->lockForUpdate()
            ->sole();

        return $this->approvals->approve($proposal, $command->approval, ActorReference::of($command->dispatchedBy()));
    }
}
