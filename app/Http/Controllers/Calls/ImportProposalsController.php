<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\ImportProposalsCall;
use App\Calls\Processes\ProposalsImported;
use App\Commands\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\ProposalReceipt;

/**
 * Imports declarations and answers each proposal.
 */
final readonly class ImportProposalsController
{
    public function __invoke(ImportProposalsCall $call, CommandBus $commands): ProposalsImported
    {
        $imported = $commands->run(new ImportRuleProposalsCommand($call->declarations));

        $proposals = array_map(fn (ProposalReceipt $receipt): array => $receipt->toArray(), $imported);

        return ProposalsImported::from(['proposals' => $proposals]);
    }
}
