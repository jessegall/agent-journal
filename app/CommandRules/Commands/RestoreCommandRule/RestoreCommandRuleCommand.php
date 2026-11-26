<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\RestoreCommandRule;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Values\ProposalReceipt;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

/**
 * A project owner restores an earlier approved revision of a rule: it becomes a new proposal that still needs
 * approval.
 *
 * @extends Command<ProposalReceipt>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class RestoreCommandRuleCommand extends Command
{
    public function __construct(
        public string $classificationRuleId,
        public int $fromRevision,
        public int $expectedRevision,
        public string $requestId,
    ) {}
}
