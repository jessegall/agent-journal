<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\SaveCommandRule;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Enums\ProposalState;
use App\Processes\Exceptions\ApprovalRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleRevision;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Support\ProjectKey;
use App\Processes\Support\ProposalChecks;
use App\Processes\Support\RuleApprovals;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\OwnerApproval;

final readonly class SaveCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $administration,
        private CurrentActor $actors,
        private ProposalChecks $checks,
        private RuleApprovals $approvals,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws ApprovalRefused
     */
    public function handle(SaveCommandRule $command): ApprovalReceipt
    {
        $this->administration->authorize(ProcessAdministrationPolicy::class, CommandRequest::class, ProcessAbility::Administer);
        $owner = ActorIdentity::of($this->actors->actor());
        $rule = $command->proposed->rule;
        if ($rule->hasContract()) {
            throw ApprovalRefused::checkWithoutRequest($rule->id);
        }
        $this->checks->check($rule, false);
        $projectKey = $this->projects->current();
        $proposal = RuleProposal::open($projectKey, $owner, $command->requestId, $command->proposed, null);
        if ($proposal->state === ProposalState::Approved) {
            $declaration = $proposal->revisions()->where('revision', $proposal->current_revision)->sole();

            $approved = RuleRevision::query()->where('rule_proposal_revision_id', $declaration->id)->sole();

            return ApprovalReceipt::of($approved);
        }

        $expected = $command->expectedActiveRevision;
        $approval = new OwnerApproval($proposal->current_revision, $expected, [], $command->reason);

        return $this->approvals->approve($proposal, $approval, $owner);
    }
}
