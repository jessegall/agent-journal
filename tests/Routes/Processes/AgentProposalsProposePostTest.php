<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
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
 * An agent proposes a rule for the command request it holds.
 */
#[TestsRoute('POST', 'processes.agent.proposals.propose')]
final class AgentProposalsProposePostTest extends GuardedRouteEntryTestCase
{
    use HoldsCommandRequests;
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $declaration = json_decode($this->declarationFile('propose-1'), true)['declarations'][0];
        $receipt = ProposalReceipt::of(RuleProposal::query()->sole(), AcmeDeclarations::proposedVerify());

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'commandRequest' => $this->requestId,
            ])
            ->payload([
                'declaration' => $declaration,
                'request_key' => 'propose-1',
            ])
            ->reply(ProposeCommandRuleCommand::class, $receipt)
            ->expects(ProposeCommandRuleCommand::class, [
                'commandRequestId' => $this->requestId,
                'requestId' => 'propose-1',
                'proposed' => AcmeDeclarations::proposedVerify(),
            ]);
    }
}
