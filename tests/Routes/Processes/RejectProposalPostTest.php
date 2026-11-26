<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\RejectRuleProposal\RejectRuleProposalCommand;
use App\Models\CommandRules\RuleProposal;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner rejects a rule proposal with a reason.
 */
#[TestsRoute('POST', 'processes.reject-proposal')]
final class RejectProposalPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $proposal = RuleProposal::query()->sole();

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->parameters([
                'proposal' => $proposal->id,
            ])
            ->payload([
                'reason' => 'Too wide.',
            ])
            ->reply(RejectRuleProposalCommand::class, $proposal->id)
            ->expects(RejectRuleProposalCommand::class, [
                'proposalId' => $proposal->id,
                'reason' => 'Too wide.',
            ]);
    }
}
