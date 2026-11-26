<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\ImportRuleProposals\ImportRuleProposalsCommand;
use App\CommandRules\Values\ImportedProposals;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\HoldsCommandRequests;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent imports a file of rule declarations as proposals.
 */
#[TestsRoute('POST', 'processes.agent.proposals.import')]
final class AgentProposalsImportPostTest extends GuardedRouteEntryTestCase
{
    use HoldsCommandRequests;
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $declarations = $this->declarationFile('import-1');

        return RouteCall::as(Caller::Agent, $this->start)
            ->payload([
                'declarations' => $declarations,
                'request_key' => 'import-1',
            ])
            ->reply(ImportRuleProposalsCommand::class, new ImportedProposals([]))
            ->expects(ImportRuleProposalsCommand::class, [
                'declarations' => $declarations,
            ]);
    }
}
