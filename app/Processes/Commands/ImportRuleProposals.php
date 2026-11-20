<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\ImportRuleProposalsHandler;
use App\Processes\Policies\ProcessPolicy;
use App\Processes\Values\ProposalReceipt;

/**
 * An agent or a user imports a repository's declaration file: its text becomes proposals awaiting review, never
 * active rules.
 *
 * @extends Command<list<ProposalReceipt>>
 */
#[HandledBy(ImportRuleProposalsHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ImportRuleProposals extends Command
{
    public function __construct(public string $declarations) {}
}
