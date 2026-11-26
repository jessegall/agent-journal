<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Models\CommandRules\RuleProposal;
use App\Values\ProposalReceipt;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\HoldsCommandRequests;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent revises its rule proposal at the revision it read.
 */
#[TestsRoute('POST', 'processes.agent.proposals.revise')]
final class AgentProposalsRevisePostTest extends GuardedRouteEntryTestCase
{
    use HoldsCommandRequests;
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $proposal = RuleProposal::query()->sole();
        $declaration = json_decode($this->declarationFile($proposal->id), true)['declarations'][0];
        $receipt = ProposalReceipt::of(RuleProposal::query()->sole(), AcmeDeclarations::proposedVerify());

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'proposal' => $proposal->id,
            ])
            ->payload([
                'declaration' => $declaration,
                'expected_revision' => 1,
                'request_key' => 'revise-1',
            ])
            ->reply(ReviseRuleProposalCommand::class, $receipt)
            ->expects(ReviseRuleProposalCommand::class, [
                'proposalId' => $proposal->id,
                'expectedRevision' => 1,
                'proposed' => AcmeDeclarations::proposedVerify(),
            ]);
    }
}
