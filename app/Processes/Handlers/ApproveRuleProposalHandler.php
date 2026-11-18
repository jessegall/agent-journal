<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProjectKey;
use App\Processes\Support\RuleApprovals;
use App\Processes\Values\ApprovalReceipt;

final readonly class ApproveRuleProposalHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private RuleApprovals $approvals,
        private ProjectKey $projects,
    ) {}

    public function handle(ApproveRuleProposal $command): ApprovalReceipt
    {
        $proposal = RuleProposal::query()
            ->ofProject($this->projects->current())
            ->whereKey($command->proposalId)
            ->lockForUpdate()
            ->sole();

        return $this->approvals->approve($proposal, $command->approval, ActorIdentity::of($this->actors->actor()));
    }
}
