<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RetireCommandRule;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

/**
 * A project owner retires an active rule at the revision they expect; processes already started are untouched.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class RetireCommandRuleCommand extends Command
{
    public function __construct(
        public string $classificationRuleId,
        public int $expectedRevision,
        public string $reason,
    ) {}
}
