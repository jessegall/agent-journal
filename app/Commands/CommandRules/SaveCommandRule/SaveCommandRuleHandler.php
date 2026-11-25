<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\SaveCommandRule;

use App\Contracts\Bus\CommandHandler;
use App\Enums\CommandRules\ProposalStatus;
use App\Exceptions\ApprovalRefused;
use App\Models\CommandRules\RuleRevision;
use App\Support\ActorIdentity;
use App\Support\ProposalChecks;
use App\Support\RuleApprovals;
use App\Support\RuleProposals;
use App\Support\ServedEnvironment;
use App\Values\ApprovalReceipt;
use App\Values\OwnerApproval;

final readonly class SaveCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private ProposalChecks $checks,
        private RuleApprovals $approvals,
        private ServedEnvironment $projects,
        private RuleProposals $proposals,
    ) {}

    /**
     * @throws ApprovalRefused
     */
    public function handle(SaveCommandRuleCommand $command): ApprovalReceipt
    {
        $owner = ActorIdentity::of($command->dispatchedBy());
        $rule = $command->proposed->rule;

        if ($rule->hasContract()) {
            throw ApprovalRefused::checkWithoutRequest($rule->id);
        }

        $this->checks->check($rule, false);
        $projectKey = $this->projects->current();
        $proposal = $this->proposals->open($projectKey, $owner, $command->requestId, $command->proposed, null);

        if ($proposal->status === ProposalStatus::Approved) {
            $declaration = $proposal->revisions()->numbered($proposal->current_revision)->sole();

            $approved = RuleRevision::query()->ofRuleProposalRevision($declaration->id)->sole();

            return ApprovalReceipt::of($approved);
        }

        $expected = $command->expectedActiveRevision;
        $approval = new OwnerApproval($proposal->current_revision, $expected, [], $command->reason);

        return $this->approvals->approve($proposal, $approval, $owner);
    }
}
