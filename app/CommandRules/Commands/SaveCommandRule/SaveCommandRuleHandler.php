<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\SaveCommandRule;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Enums\ProposalStatus;
use App\CommandRules\Exceptions\ApprovalRefused;
use App\CommandRules\ProposalChecks;
use App\CommandRules\RuleApprovals;
use App\CommandRules\RuleProposals;
use App\CommandRules\Values\ApprovalReceipt;
use App\CommandRules\Values\OwnerApproval;
use App\Models\CommandRules\RuleRevision;
use App\Projects\SelectedProject;

final readonly class SaveCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private ProposalChecks $checks,
        private RuleApprovals $approvals,
        private SelectedProject $projects,
        private RuleProposals $proposals,
    ) {}

    /**
     * @throws ApprovalRefused
     */
    public function handle(SaveCommandRuleCommand $command): ApprovalReceipt
    {
        $owner = $command->dispatchedBy();
        $rule = $command->proposed->rule;

        if ($rule->hasContract()) {
            throw ApprovalRefused::checkWithoutRequest($rule->id);
        }

        $this->checks->check($rule, false);
        $project = $this->projects->find();
        $proposal = $this->proposals->open($project, $owner, $command->requestId, $command->proposed, null);

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
