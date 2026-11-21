<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * A project owner retires an active rule at the revision they expect; processes already started are untouched.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class RetireCommandRule extends Command
{
    public function __construct(
        public string $classificationRuleId,
        public int $expectedRevision,
        public string $reason,
    ) {}
}
