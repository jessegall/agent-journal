<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ImportRuleProposals;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Values\ImportedProposals;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * An agent or a user imports a repository's declaration file: its text becomes proposals awaiting review, never
 * active rules.
 *
 * @extends Command<ImportedProposals>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ImportRuleProposalsCommand extends Command
{
    public function __construct(public string $declarations) {}
}
