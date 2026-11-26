<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ImportProposalsPayload;
use App\Api\Processes\ProposalsImported;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\ImportRuleProposals\ImportRuleProposalsCommand;

/**
 * Imports declarations and answers each proposal.
 */
final readonly class ImportProposalsController
{
    #[Dispatches(ImportRuleProposalsCommand::class)]
    public function __invoke(ImportProposalsPayload $call, CommandBus $commands): ProposalsImported
    {
        $imported = $commands->run(new ImportRuleProposalsCommand($call->declarations));

        return ProposalsImported::from(['proposals' => $imported->toArray()]);
    }
}
