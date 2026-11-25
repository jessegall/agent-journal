<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ImportRuleProposals;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;
use App\Values\ProposalReceipt;

/**
 * An agent or a user imports a repository's declaration file: its text becomes proposals awaiting review, never
 * active rules.
 *
 * @extends Command<list<ProposalReceipt>>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ImportRuleProposalsCommand extends Command
{
    public function __construct(public string $declarations) {}
}
