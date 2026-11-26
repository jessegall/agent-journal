<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use App\Values\ApprovalReceipt;
use App\Values\OwnerApproval;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An approval of a rule proposal sent through the agent API names the revisions it expects.
 */
#[TestsRoute('POST', 'processes.agent.proposals.approve')]
final class AgentProposalsApprovePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $this->approvePair();
        $proposal = RuleProposal::query()->sole();

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'proposal' => $proposal->id,
            ])
            ->payload([
                'expected_revision' => 1,
                'expected_active_revision' => 0,
                'reader_revision' => null,
                'proof' => null,
                'reason' => 'proven',
                'request_key' => 'approve-1',
            ])
            ->reply(ApproveRuleProposalCommand::class, ApprovalReceipt::of(RuleRevision::query()->sole()))
            ->expects(ApproveRuleProposalCommand::class, [
                'proposalId' => $proposal->id,
                'approval' => new OwnerApproval(1, 0, [], 'proven'),
            ]);
    }
}
