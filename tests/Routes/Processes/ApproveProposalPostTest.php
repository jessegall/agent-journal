<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\CommandRules\Values\ApprovalReceipt;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner approves a rule proposal at the revisions the page showed.
 */
#[TestsRoute('POST', 'processes.approve-proposal')]
final class ApproveProposalPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $this->approvePair();
        $proposal = RuleProposal::query()->sole();

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->parameters([
                'proposal' => $proposal->id,
            ])
            ->payload([
                'expected_revision' => 1,
                'expected_active_revision' => 0,
                'reason' => 'proven',
            ])
            ->reply(ApproveRuleProposalCommand::class, ApprovalReceipt::of(RuleRevision::query()->sole()))
            ->expects(ApproveRuleProposalCommand::class, [
                'proposalId' => $proposal->id,
            ]);
    }
}
