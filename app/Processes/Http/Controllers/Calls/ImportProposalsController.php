<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ImportProposalsCall;
use App\Processes\Calls\ProposalsImported;
use App\Processes\Commands\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Processes\Values\ProposalReceipt;

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
