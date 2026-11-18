<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\ImportRuleProposalsHandler;
use App\Processes\Values\ProposalReceipt;

/**
 * An agent or a user imports a repository's declaration file: its text becomes proposals awaiting review, never
 * active rules.
 *
 * @implements Command<list<ProposalReceipt>>
 */
#[HandledBy(ImportRuleProposalsHandler::class)]
final readonly class ImportRuleProposals implements Command
{
    public function __construct(public string $declarations) {}
}
