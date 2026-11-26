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
 * A rejection of a rule proposal sent through the agent API, with its reason.
 */
#[TestsRoute('POST', 'processes.agent.proposals.reject')]
final class AgentProposalsRejectPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $proposal = RuleProposal::query()->sole();

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'proposal' => $proposal->id,
            ])
            ->payload([
                'reason' => 'Too wide.',
                'request_key' => 'reject-1',
            ])
            ->reply(RejectRuleProposalCommand::class, $proposal->id)
            ->expects(RejectRuleProposalCommand::class, [
                'proposalId' => $proposal->id,
                'reason' => 'Too wide.',
            ]);
    }
}
