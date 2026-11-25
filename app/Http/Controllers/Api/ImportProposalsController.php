<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ImportProposalsPayload;
use App\Api\Processes\ProposalsImported;
use App\Commands\CommandRules\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\ProposalReceipt;

/**
 * Imports declarations and answers each proposal.
 */
final readonly class ImportProposalsController
{
    public function __invoke(ImportProposalsPayload $call, CommandBus $commands): ProposalsImported
    {
        $imported = $commands->run(new ImportRuleProposalsCommand($call->declarations));

        $proposals = array_map(fn (ProposalReceipt $receipt): array => $receipt->toArray(), $imported);

        return ProposalsImported::from(['proposals' => $proposals]);
    }
}
