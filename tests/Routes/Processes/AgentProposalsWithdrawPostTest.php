<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Models\CommandRules\RuleProposal;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent withdraws its rule proposal.
 */
#[TestsRoute('POST', 'processes.agent.proposals.withdraw')]
final class AgentProposalsWithdrawPostTest extends GuardedRouteEntryTestCase
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
                'request_key' => 'withdraw-1',
            ])
            ->reply(WithdrawRuleProposalCommand::class, $proposal->id)
            ->expects(WithdrawRuleProposalCommand::class, [
                'proposalId' => $proposal->id,
            ]);
    }
}
