<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RestoreCommandRule;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;
use App\Values\ProposalReceipt;

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
